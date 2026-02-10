import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
// import { getUserIdFromRequest } from '@/lib/auth' // TODO: Implement JWT auth extraction

// GET /api/users/addresses - Get user addresses
export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        // TODO: Extract userId from JWT token in request headers
        // const userId = getUserIdFromRequest(req)
        const userId = '' // Placeholder
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, data: user.addresses })
    } catch (error: any) {
        console.error('Error fetching addresses:', error)
        return NextResponse.json({ success: false, message: 'Error fetching addresses', error: error.message }, { status: 500 })
    }
}

// POST /api/users/addresses - Add new address
export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        // TODO: Extract userId from JWT token in request headers
        // const userId = getUserIdFromRequest(req)
        const userId = '' // Placeholder
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }
        const address = await req.json()
        const user = await User.findById(userId)
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }
        user.addresses.push(address)
        await user.save()
        return NextResponse.json({ success: true, data: user.addresses })
    } catch (error: any) {
        console.error('Error adding address:', error)
        return NextResponse.json({ success: false, message: 'Error adding address', error: error.message }, { status: 400 })
    }
}
