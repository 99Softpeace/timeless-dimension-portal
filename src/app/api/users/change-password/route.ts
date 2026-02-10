import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
// import { getUserIdFromRequest } from '@/lib/auth' // TODO: Implement JWT auth extraction

// POST /api/users/change-password - Change password
export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        // TODO: Extract userId from JWT token in request headers
        // const userId = getUserIdFromRequest(req)
        const userId = '' // Placeholder
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }
        const { currentPassword, newPassword } = await req.json()
        const user = await User.findById(userId)
        if (!user) {
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
