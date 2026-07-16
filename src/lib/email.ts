import nodemailer from 'nodemailer'

type MailInput = {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

let transporter: any = null

function getEmailConfig() {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com'
  const port = Number(process.env.EMAIL_PORT || 465)
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS

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

function getTransporter() {
  if (transporter) return transporter

  const config = getEmailConfig()
  if (!config) return null

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  })

  return transporter
}

export function canSendEmails() {
  return Boolean(getEmailConfig())
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

  const info = await tx.sendMail({
    from: config.from,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  })

  console.info('Email sent', {
    to: input.to,
    subject: input.subject,
    messageId: info?.messageId,
  })

  return { sent: true as const, messageId: info?.messageId }
}
