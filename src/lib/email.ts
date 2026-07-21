import nodemailer from 'nodemailer'

type MailInput = {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

let transporter: any = null
let transporterKey = ''

function getEmailConfig() {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com'
  const port = Number(process.env.EMAIL_PORT || 465)
  const user = process.env.EMAIL_USER
  const rawPass = process.env.EMAIL_PASS
  const pass = host.includes('gmail') ? rawPass?.replace(/\s+/g, '') : rawPass

  if (!user || !pass || pass === 'your-app-password') {
    return null
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    from: process.env.EMAIL_FROM || `Senators Accessories <${user}>`,
  }
}

type EmailConfig = NonNullable<ReturnType<typeof getEmailConfig>>

function createTransporter(config: EmailConfig) {
  const key = `${config.host}:${config.port}:${config.auth.user}`
  if (transporter && transporterKey === key) return transporter

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })
  transporterKey = key

  return transporter
}

function getTransporter() {
  const config = getEmailConfig()
  if (!config) return null

  return createTransporter(config)
}

export function canSendEmails() {
  return Boolean(getEmailConfig())
}

function shouldRetryWithStartTls(error: any, config: EmailConfig) {
  const message = String(error?.message || '').toLowerCase()
  return config.host.includes('gmail') && config.port === 465 && (message.includes('timeout') || message.includes('etimedout') || message.includes('enetunreach') || message.includes('econnrefused'))
}

export async function sendEmail(input: MailInput) {
  const config = getEmailConfig()
  const tx = getTransporter()

  if (!config || !tx) {
    console.warn('Email not sent: SMTP config missing', {
      to: input.to,
      subject: input.subject,
    })
    return { sent: false as const, reason: 'missing_config' }
  }

  const mail = {
    from: config.from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  }

  let info

  try {
    info = await tx.sendMail(mail)
  } catch (error: any) {
    if (!shouldRetryWithStartTls(error, config)) {
      throw error
    }

    console.warn('Email send timed out on Gmail port 465; retrying with STARTTLS on port 587.')
    const fallbackConfig = {
      ...config,
      port: 587,
      secure: false,
    }
    const fallbackTx = createTransporter(fallbackConfig)
    info = await fallbackTx.sendMail(mail)
  }

  console.info('Email sent', {
    to: input.to,
    subject: input.subject,
    messageId: info?.messageId,
  })

  return { sent: true as const, messageId: info?.messageId }
}


