import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { sendEmail } from '@/lib/email'

function getBaseUrl(req: Request) {
    const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.FRONTEND_URL
    if (envUrl) {
        return envUrl.replace(/\/$/, '')
    }

    const proto = req.headers.get('x-forwarded-proto')
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
    if (proto && host) {
        return `${proto}://${host}`
    }

    return new URL(req.url).origin
}

export async function POST(req: Request) {
    try {
        await dbConnect()
        const { email } = await req.json()

        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            )
        }

        const normalizedEmail = email.toLowerCase().trim()
        const safeSuccessMessage = 'If an account exists for this email, a password reset link has been sent.'

        const user = await (User as any).findByEmail(normalizedEmail)
        if (!user) {
            return NextResponse.json({
                success: true,
                message: safeSuccessMessage
            })
        }

        const resetToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        )

        user.passwordResetToken = resetToken
        user.passwordResetExpires = new Date(Date.now() + 3600000) // 1 hour
        await user.save()

        const resetLink = `${getBaseUrl(req)}/reset-password?token=${encodeURIComponent(resetToken)}`

        let emailSent = false
        try {
            const emailResult = await sendEmail({
                to: normalizedEmail,
                subject: 'Reset your password',
                html: `
                    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0f172a;">
                        <h2 style="margin:0 0 12px;">Password Reset Request</h2>
                        <p>We received a request to reset your password.</p>
                        <p>
                            <a href="${resetLink}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:10px 16px;border-radius:6px;">
                                Reset Password
                            </a>
                        </p>
                        <p>This link expires in 1 hour.</p>
                        <p>If you did not request this, you can ignore this email.</p>
                    </div>
                `,
                text: `Reset your password using this link (valid for 1 hour): ${resetLink}`
            })

            emailSent = emailResult.sent
        } catch (emailError) {
            console.error('Password reset email send failed:', emailError)
            emailSent = false
        }

        if (!emailSent) {
            if (process.env.NODE_ENV !== 'production') {
                return NextResponse.json({
                    success: true,
                    message: 'Reset link generated. Email transport is not configured, so a preview link is returned.',
                    previewResetUrl: resetLink
                })
            }

            return NextResponse.json(
                { success: false, message: 'Could not send reset email. Please try again shortly.' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: safeSuccessMessage
        })
    } catch (error: any) {
        console.error('Forgot password error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to process forgot password request' },
            { status: 500 }
        )
    }
}
