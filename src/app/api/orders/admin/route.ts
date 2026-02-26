import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'
import Order from '@/models/Order'
import User from '@/models/User'

async function requireAdmin(req: NextRequest) {
    const userId = getUserIdFromRequest(req)
    if (!userId) {
        return { ok: false as const, response: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }) }
    }

    const user = await (User as any).findById(userId).select('role isActive')
    if (!user || !user.isActive || user.role !== 'admin') {
        return { ok: false as const, response: NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 }) }
    }

    return { ok: true as const, userId }
}

// GET /api/orders/admin - Get all orders (Admin only)
export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const adminCheck = await requireAdmin(req)
        if (!adminCheck.ok) {
            return adminCheck.response
        }
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const status = searchParams.get('status')
        const options: any = {
            limit,
            skip: (page - 1) * limit,
            status
        }
        const query: any = {}
        if (status) query.status = status
        const orders = await Order.find(query)
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(options.skip)
            .limit(options.limit)
        const total = await Order.countDocuments(query)
        return NextResponse.json({
            success: true,
            data: orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error: any) {
        console.error('Error fetching orders:', error)
        return NextResponse.json({ success: false, message: 'Error fetching orders', error: error.message }, { status: 500 })
    }
}
