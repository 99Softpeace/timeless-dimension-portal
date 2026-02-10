import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
// import { getUserIdFromRequest, isAdmin } from '@/lib/auth' // TODO: Implement JWT auth extraction and admin check

// GET /api/users/admin - Get all users (Admin only)
export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        // TODO: Add admin authentication/authorization
        // if (!isAdmin(req)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        const users = await User.find({ isActive: true }).select('-password')
        return NextResponse.json({ success: true, data: users })
    } catch (error: any) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ success: false, message: 'Error fetching users', error: error.message }, { status: 500 })
    }
}

// PUT /api/users/admin - Update user (Admin only)
export async function PUT(req: NextRequest) {
    try {
        await dbConnect()
        // TODO: Add admin authentication/authorization
        // if (!isAdmin(req)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        const { id, ...update } = await req.json()
        const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).select('-password')
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, data: user })
    } catch (error: any) {
        console.error('Error updating user:', error)
        return NextResponse.json({ success: false, message: 'Error updating user', error: error.message }, { status: 400 })
    }
}

// DELETE /api/users/admin - Deactivate user (Admin only)
export async function DELETE(req: NextRequest) {
    try {
        await dbConnect()
        // TODO: Add admin authentication/authorization
        // if (!isAdmin(req)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        const { id } = await req.json()
        const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true })
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, message: 'User deactivated successfully' })
    } catch (error: any) {
        console.error('Error deactivating user:', error)
        return NextResponse.json({ success: false, message: 'Error deactivating user', error: error.message }, { status: 500 })
    }
}
