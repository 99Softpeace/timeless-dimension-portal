import { NextRequest, NextResponse } from 'next/server'
import { canSendEmails, sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

function normalizeEmail(value: unknown) {
  return String(value || '').trim().toLowerCase()
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = String(body?.name || '').trim()
    const email = normalizeEmail(body?.email)
    const inquiry = String(body?.inquiry || '').trim()

    if (!name || !isValidEmail(email) || !inquiry) {
      return NextResponse.json(
        { success: false, message: 'Name, valid email, and inquiry are required.' },
        { status: 400 }
      )
    }

    if (!canSendEmails()) {
      return NextResponse.json(
        { success: false, message: 'Email is not configured. Check EMAIL_USER and EMAIL_PASS.' },
        { status: 500 }
      )
    }

    const to = process.env.CONTACT_EMAIL || process.env.OWNER_ORDER_EMAIL || process.env.ADMIN_EMAIL || process.env.EMAIL_USER
    if (!to) {
      return NextResponse.json(
        { success: false, message: 'Contact recipient email is not configured.' },
        { status: 500 }
      )
    }

    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeInquiry = escapeHtml(inquiry).replace(/\n/g, '<br />')

    await sendEmail({
      to,
      replyTo: email,
      subject: `New contact inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${inquiry}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
          <h2>New contact inquiry</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <div style="margin-top:20px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
            ${safeInquiry}
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true, message: 'Message sent successfully.' })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, message: 'Could not send message.', error: error.message },
      { status: 500 }
    )
  }
}
