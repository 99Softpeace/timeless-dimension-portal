import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { requireAdmin } from '@/lib/auth'

// GET /api/users/admin - Get all users (Admin only)
export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const adminCheck = await requireAdmin(req)
        if (!adminCheck.ok) return adminCheck.response

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
        const adminCheck = await requireAdmin(req)
        if (!adminCheck.ok) return adminCheck.response

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
        const adminCheck = await requireAdmin(req)
        if (!adminCheck.ok) return adminCheck.response

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
