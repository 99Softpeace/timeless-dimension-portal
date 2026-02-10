import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function POST(req: Request) {
    try {
        await dbConnect()
        const { token, newPassword } = await req.json()

        // Verify token
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')

        const user = await (User as any).findOne({
            _id: decoded.userId,
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() }
        })

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired reset token' },
                { status: 400 }
            )
        }

        // Update password
        user.password = newPassword
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully'
        })
    } catch (error: any) {
        console.error('Reset password error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to reset password', error: error.message },
            { status: 400 }
        )
    }
}
