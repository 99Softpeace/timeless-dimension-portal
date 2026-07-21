import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { getUserIdFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const userId = getUserIdFromRequest(req)
        if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

        const user = await (User as any).findById(userId).select('-password')
        if (!user || user.isActive === false) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, data: user.getPublicProfile() })
    } catch (error: any) {
        console.error('Error fetching user profile:', error)
        return NextResponse.json({ success: false, message: 'Error fetching user profile', error: error.message }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    try {
        await dbConnect()
        const userId = getUserIdFromRequest(req)
        if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

        const body = await req.json()
        const updates = {
            firstName: String(body?.firstName || '').trim(),
            lastName: String(body?.lastName || '').trim(),
            email: String(body?.email || '').trim().toLowerCase(),
            phone: String(body?.phone || '').trim(),
        }

        if (!updates.firstName || !updates.lastName || !updates.email) {
            return NextResponse.json({ success: false, message: 'First name, last name, and email are required' }, { status: 400 })
        }

        const user = await (User as any).findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password')
        if (!user || user.isActive === false) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, data: user.getPublicProfile() })
    } catch (error: any) {
        console.error('Error updating user profile:', error)
        return NextResponse.json({ success: false, message: 'Error updating user profile', error: error.message }, { status: 500 })
    }
}
