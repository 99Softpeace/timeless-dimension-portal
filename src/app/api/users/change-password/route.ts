import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { getUserIdFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const userId = getUserIdFromRequest(req)
        if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

        const { currentPassword, newPassword } = await req.json()
        if (!currentPassword || !newPassword || String(newPassword).length < 6) {
            return NextResponse.json({ success: false, message: 'Current password and a new password of at least 6 characters are required' }, { status: 400 })
        }

        const user = await (User as any).findById(userId)
        if (!user || user.isActive === false) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        const isCurrentPasswordValid = await user.comparePassword(currentPassword)
        if (!isCurrentPasswordValid) {
            return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 400 })
        }

        user.password = newPassword
        await user.save()
        return NextResponse.json({ success: true, message: 'Password changed successfully' })
    } catch (error: any) {
        console.error('Error changing password:', error)
        return NextResponse.json({ success: false, message: 'Error changing password', error: error.message }, { status: 400 })
    }
}
