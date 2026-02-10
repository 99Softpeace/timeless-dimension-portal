import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Order from '@/models/Order'
// import { isAdmin } from '@/lib/auth' // TODO: Implement admin check

// GET /api/orders/admin - Get all orders (Admin only)
export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        // TODO: Add admin authentication/authorization
        // if (!isAdmin(req)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
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
        const orders = await Order.find(query).skip(options.skip).limit(options.limit)
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
