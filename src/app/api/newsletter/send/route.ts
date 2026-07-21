import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { canSendEmails, sendEmail } from '@/lib/email'
import NewsletterSubscriber from '@/models/NewsletterSubscriber'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, '').replace(/\n{3,}/g, '\n\n').trim()
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function messageToHtml(message: string) {
  return escapeHtml(message)
    .split(/\n{2,}/)
    .map((paragraph) => `<p style="margin:0 0 16px;line-height:1.7;color:#334155;">${paragraph.replace(/\n/g, '<br />')}</p>`)
    .join('')
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const adminCheck = await requireAdmin(req)
    if (!adminCheck.ok) return adminCheck.response

    const body = await req.json()
    const subject = String(body?.subject || '').trim()
    const message = String(body?.message || '').trim()
    const includeSubscribers = body?.includeSubscribers !== false
    const includeCustomers = body?.includeCustomers !== false

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Subject and message are required.' },
        { status: 400 }
      )
    }

    if (!canSendEmails()) {
      return NextResponse.json(
        { success: false, message: 'Email is not configured. Check EMAIL_USER and EMAIL_PASS.' },
        { status: 500 }
      )
    }

    const recipientMap = new Map<string, { email: string; firstName?: string }>()

    if (includeSubscribers) {
      const subscribers = await NewsletterSubscriber.find({ isActive: true })
        .select('email firstName')
        .lean()
      subscribers.forEach((subscriber: any) => {
        if (subscriber.email) recipientMap.set(subscriber.email, subscriber)
      })
    }

    if (includeCustomers) {
      const users = await (User as any)
        .find({ isActive: true, role: { $ne: 'admin' } })
        .select('email firstName')
        .lean()
      users.forEach((user: any) => {
        if (user.email) recipientMap.set(user.email, user)
      })
    }

    const recipients = Array.from(recipientMap.values())
    if (recipients.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No newsletter recipients found.' },
        { status: 400 }
      )
    }

    const bodyHtml = messageToHtml(message)
    const html = `
      <div style="background:#f8fafc;padding:32px 16px;font-family:Arial,sans-serif;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e2e8f0;">
          <h1 style="margin:0 0 18px;color:#0f172a;font-size:24px;line-height:1.25;">${escapeHtml(subject)}</h1>
          ${bodyHtml}
          <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.6;">
            You are receiving this update from Senator Accessories.
          </div>
        </div>
      </div>
    `

    let sent = 0
    const failed: string[] = []

    for (const recipient of recipients) {
      try {
        const result = await sendEmail({
          to: recipient.email,
          subject,
          html,
          text: stripHtml(message),
        })
        if (result.sent) sent += 1
        else failed.push(recipient.email)
      } catch (error) {
        console.error('Newsletter send recipient error:', recipient.email, error)
        failed.push(recipient.email)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Newsletter sent to ${sent} recipient${sent === 1 ? '' : 's'}.`,
      data: { requested: recipients.length, sent, failed: failed.length },
    })
  } catch (error: any) {
    console.error('Newsletter send error:', error)
    return NextResponse.json(
      { success: false, message: 'Could not send newsletter.', error: error.message },
      { status: 500 }
    )
  }
}
