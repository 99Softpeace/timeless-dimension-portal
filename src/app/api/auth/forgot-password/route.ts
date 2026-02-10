import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function POST(req: Request) {
    try {
        await dbConnect()
        const { email } = await req.json()

        const user = await (User as any).findByEmail(email)
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            )
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        )

        // Save reset token and expiry
        user.passwordResetToken = resetToken
        user.passwordResetExpires = new Date(Date.now() + 3600000) // 1 hour
        await user.save()

        // TODO: Send email with reset link
        // For now, just return the token (in production, send via email)
        return NextResponse.json({
            success: true,
            message: 'Password reset token generated',
            resetToken // Remove this in production
        })
    } catch (error: any) {
        console.error('Forgot password error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to process forgot password request', error: error.message },
            { status: 500 }
        )
    }
}
