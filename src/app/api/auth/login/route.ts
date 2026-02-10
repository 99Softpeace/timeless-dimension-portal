import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function POST(req: Request) {
    try {
        await dbConnect()
        const { email, password } = await req.json()

        // Find user by email
        const user = await (User as any).findByEmail(email)
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Update last login
        user.lastLogin = new Date()
        await user.save()

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        )

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.getPublicProfile(),
                token
            }
        })

    } catch (error: any) {
        console.error('Login error:', error)
        return NextResponse.json(
            { success: false, message: 'Login failed', error: error.message },
            { status: 500 }
        )
    }
}
