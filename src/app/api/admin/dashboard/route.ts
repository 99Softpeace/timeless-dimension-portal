import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'
import Order from '@/models/Order'
import Product from '@/models/Product'
import User from '@/models/User'

export const dynamic = 'force-dynamic'

async function requireAdmin(req: NextRequest) {
  const userId = getUserIdFromRequest(req)
  if (!userId) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      ),
    }
  }

  const user = await (User as any).findById(userId).select('role isActive')
  if (!user || !user.isActive || user.role !== 'admin') {
    return {
      ok: false as const,
      response: NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      ),
    }
  }

  return { ok: true as const }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    const adminCheck = await requireAdmin(req)
    if (!adminCheck.ok) {
      return adminCheck.response
    }

    const [recentOrders, totalOrders, activeOrders, usersCount, productsCount, revenueAgg] =
      await Promise.all([
        Order.find({})
          .populate('user', 'firstName lastName email')
          .sort({ createdAt: -1 })
          .limit(8),
        Order.countDocuments({}),
        Order.countDocuments({ status: { $in: ['pending', 'processing', 'shipped'] } }),
        User.countDocuments({ isActive: true }),
        Product.countDocuments({}),
        Order.aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
        ]),
      ])

    const totalRevenue = Number(revenueAgg?.[0]?.totalRevenue || 0)

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalRevenue,
          totalOrders,
          activeOrders,
          productsCount,
          usersCount,
        },
        recentOrders,
      },
    })
  } catch (error: any) {
    console.error('Error fetching admin dashboard:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching dashboard data',
        error: error.message,
      },
      { status: 500 }
    )
  }
}
