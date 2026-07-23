import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import AdminPreference from '@/models/AdminPreference'

export const dynamic = 'force-dynamic'

const DEFAULT_PREFERENCES = {
  orderNotifications: true,
  lowStockAlerts: true,
  weeklySummary: true,
  timezone: 'Africa/Lagos',
}

async function getPreferences() {
  return AdminPreference.findOneAndUpdate(
    { key: 'global' },
    { $setOnInsert: { key: 'global', ...DEFAULT_PREFERENCES } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const adminCheck = await requireAdmin(req)
    if (!adminCheck.ok) return adminCheck.response

    const preferences = await getPreferences()
    return NextResponse.json({ success: true, data: preferences })
  } catch (error: any) {
    console.error('Admin preferences fetch error:', error)
    return NextResponse.json({ success: false, message: 'Could not load preferences', error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect()
    const adminCheck = await requireAdmin(req)
    if (!adminCheck.ok) return adminCheck.response

    const body = await req.json()
    const preferences = await AdminPreference.findOneAndUpdate(
      { key: 'global' },
      {
        key: 'global',
        orderNotifications: Boolean(body?.orderNotifications),
        lowStockAlerts: Boolean(body?.lowStockAlerts),
        weeklySummary: Boolean(body?.weeklySummary),
        timezone: String(body?.timezone || 'Africa/Lagos').trim() || 'Africa/Lagos',
        updatedBy: adminCheck.userId,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    )

    return NextResponse.json({ success: true, data: preferences, message: 'Preferences saved successfully.' })
  } catch (error: any) {
    console.error('Admin preferences save error:', error)
    return NextResponse.json({ success: false, message: 'Could not save preferences', error: error.message }, { status: 500 })
  }
}
