import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function GET(req: Request) {
    try {
        await dbConnect()
        const authHeader = req.headers.get('authorization')
        const token = authHeader?.replace('Bearer ', '')

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'No token provided' },
                { status: 401 }
            )
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        const user = await (User as any).findById(decoded.userId).select('-password')

        if (!user || !user.isActive) {
            return NextResponse.json(
                { success: false, message: 'User not found or inactive' },
                { status: 401 }
            )
        }

        return NextResponse.json({
            success: true,
            data: user.getPublicProfile()
        })
    } catch (error: any) {
        console.error('Get user error:', error)
        return NextResponse.json(
            { success: false, message: 'Invalid token', error: error.message },
            { status: 401 }
        )
    }
}
