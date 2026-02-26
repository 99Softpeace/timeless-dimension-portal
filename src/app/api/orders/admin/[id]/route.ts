import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'
import Order from '@/models/Order'
import User from '@/models/User'
import { sendOrderStatusUpdateEmail } from '@/lib/order-email'

const VALID_ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const

const VALID_PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const

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

  return { ok: true as const, userId }
}

// PATCH /api/orders/admin/[id] - Update order status/details (Admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const adminCheck = await requireAdmin(req)
    if (!adminCheck.ok) {
      return adminCheck.response
    }

    const body = await req.json()
    const order = await Order.findById(params.id)

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    const nextStatus = body.status ? String(body.status) : undefined
    const nextPaymentStatus = body.paymentStatus ? String(body.paymentStatus) : undefined
    const trackingNumber =
      body.trackingNumber !== undefined ? String(body.trackingNumber || '').trim() : undefined
    const notes = body.notes !== undefined ? String(body.notes || '').trim() : undefined
    const previous = {
      status: String(order.status),
      paymentStatus: String(order.paymentStatus),
      trackingNumber: String(order.trackingNumber || ''),
    }

    if (nextStatus && !VALID_ORDER_STATUSES.includes(nextStatus as any)) {
      return NextResponse.json(
        { success: false, message: 'Invalid order status' },
        { status: 400 }
      )
    }

    if (nextPaymentStatus && !VALID_PAYMENT_STATUSES.includes(nextPaymentStatus as any)) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment status' },
        { status: 400 }
      )
    }

    if (nextStatus) {
      order.status = nextStatus as any

      if (nextStatus === 'delivered') {
        order.deliveredAt = new Date()
      }

      if (nextStatus === 'cancelled') {
        order.cancelledAt = new Date()
        if (notes) {
          order.cancellationReason = notes
        }
      }
    }

    if (nextPaymentStatus) {
      order.paymentStatus = nextPaymentStatus as any
    }

    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber || undefined
    }

    if (notes !== undefined) {
      order.notes = notes || undefined
    }

    await order.save()

    const changed =
      previous.status !== String(order.status) ||
      previous.paymentStatus !== String(order.paymentStatus) ||
      previous.trackingNumber !== String(order.trackingNumber || '')

    if (changed) {
      try {
        const customer = await (User as any).findById(order.user).select(
          'email firstName lastName isActive'
        )
        if (customer?.email && customer?.isActive !== false) {
          await sendOrderStatusUpdateEmail(
            {
              email: String(customer.email),
              firstName: customer.firstName,
              lastName: customer.lastName,
            },
            {
              orderNumber: String(order.orderNumber),
              status: String(order.status),
              paymentStatus: String(order.paymentStatus),
              total: Number(order.total || 0),
              currency: String(order.currency || 'NGN'),
              trackingNumber: order.trackingNumber ? String(order.trackingNumber) : undefined,
              createdAt: (order as any).createdAt,
            },
            previous
          )
        }
      } catch (emailError) {
        console.error('Order status email error:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    })
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, message: 'Error updating order', error: error.message },
      { status: 500 }
    )
  }
}
