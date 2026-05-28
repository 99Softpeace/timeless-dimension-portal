import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/db'
import User from '@/models/User'

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function connectWithRetry(attempts = 2) {
    let lastError: any

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            return await dbConnect()
        } catch (error) {
            lastError = error
            if (attempt < attempts) {
                await wait(1000)
            }
        }
    }

    throw lastError
}

export async function POST(req: Request) {
    try {
        try {
            await connectWithRetry()
        } catch (dbError: any) {
            console.error('Login database connection error:', dbError)
            return NextResponse.json(
                {
                    success: false,
                    message: 'Login is temporarily unavailable because the database could not be reached. Please try again shortly.',
                },
                { status: 503 }
            )
        }

        const { email, password } = await req.json()

        if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            )
        }

        const normalizedEmail = email.toLowerCase().trim()

        // Find user by email
        const user = await (User as any).findByEmail(normalizedEmail)
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Check password
        let isPasswordValid = false
        try {
            isPasswordValid = await user.comparePassword(password)
        } catch (passwordError) {
            console.error('Login password comparison error:', passwordError)
            isPasswordValid = false
        }
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
