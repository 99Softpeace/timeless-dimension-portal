import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function POST(req: Request) {
    try {
        await dbConnect()
        const { firstName, lastName, email, password, phone } = await req.json()

        if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            )
        }

        const normalizedEmail = email.toLowerCase().trim()

        // Check if user already exists
        const existingUser = await (User as any).findByEmail(normalizedEmail)
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'User already exists with this email' },
                { status: 400 }
            )
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email: normalizedEmail,
            password,
            phone
        })

        await user.save()

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        )

        return NextResponse.json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: user.getPublicProfile(),
                token
            }
        }, { status: 201 })

    } catch (error: any) {
        console.error('Registration error:', error)
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: 'User already exists with this email' },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { success: false, message: 'Registration failed', error: error.message },
            { status: 400 }
        )
    }
}
