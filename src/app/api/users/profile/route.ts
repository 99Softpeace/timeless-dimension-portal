import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
// import { getUserIdFromRequest } from '@/lib/auth' // TODO: Implement JWT auth extraction

// GET /api/users/profile - Get user profile
export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        // TODO: Extract userId from JWT token in request headers
        // const userId = getUserIdFromRequest(req)
        const userId = '' // Placeholder
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }
        const user = await User.findById(userId).select('-password')
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, data: user.getPublicProfile() })
    } catch (error: any) {
        console.error('Error fetching user profile:', error)
        return NextResponse.json({ success: false, message: 'Error fetching user profile', error: error.message }, { status: 500 })
    }
}

// PUT /api/users/profile - Update user profile
export async function PUT(req: NextRequest) {
    try {
        await dbConnect()
        // TODO: Extract userId from JWT token in request headers
        // const userId = getUserIdFromRequest(req)
        const userId = '' // Placeholder
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }
        const updates = await req.json()
        delete updates.password
        delete updates.role
        delete updates.isActive
        const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password')
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, data: user.getPublicProfile() })
    } catch (error: any) {
        console.error('Error updating user profile:', error)
        return NextResponse.json({ success: false, message: 'Error updating user profile', error: error.message }, { status: 500 })
    }
}
