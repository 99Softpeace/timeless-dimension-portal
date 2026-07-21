import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import NewsletterSubscriber from '@/models/NewsletterSubscriber'

export const dynamic = 'force-dynamic'

function normalizeEmail(value: unknown) {
  return String(value || '').trim().toLowerCase()
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const body = await req.json()
    const email = normalizeEmail(body?.email)
    const firstName = String(body?.firstName || '').trim()

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    await NewsletterSubscriber.findOneAndUpdate(
      { email },
      {
        email,
        firstName,
        isActive: true,
        source: 'website',
        subscribedAt: new Date(),
        $unset: { unsubscribedAt: 1 },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'You are subscribed. Watch your inbox for updates.',
    })
  } catch (error: any) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json(
      { success: false, message: 'Could not subscribe right now.', error: error.message },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const adminCheck = await requireAdmin(req)
    if (!adminCheck.ok) return adminCheck.response

    const activeSubscribers = await NewsletterSubscriber.countDocuments({ isActive: true })
    const totalSubscribers = await NewsletterSubscriber.countDocuments({})
    const recentSubscribers = await NewsletterSubscriber.find({ isActive: true })
      .sort({ subscribedAt: -1 })
      .limit(5)
      .select('email subscribedAt')
      .lean()

    return NextResponse.json({
      success: true,
      data: { activeSubscribers, totalSubscribers, recentSubscribers },
    })
  } catch (error: any) {
    console.error('Newsletter stats error:', error)
    return NextResponse.json(
      { success: false, message: 'Could not load newsletter stats.', error: error.message },
      { status: 500 }
    )
  }
}
