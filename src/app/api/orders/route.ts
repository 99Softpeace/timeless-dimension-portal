import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'
import Order from '@/models/Order'
import User from '@/models/User'
import '@/models/Product'
import {
    amountsMatch,
    buildAddress,
    buildOrderItems,
    generateOrderNumber,
    generatePaymentReference,
    normalizeCurrency,
    toAmount,
    reduceInventory,
} from '@/lib/order-utils'
import {
    sendOrderConfirmationEmail,
    sendOwnerOrderNotificationEmail,
} from '@/lib/order-email'

// GET /api/orders - Get user orders
export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const userId = getUserIdFromRequest(req)
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const status = searchParams.get('status')
        const options: any = {
            limit,
            skip: (page - 1) * limit,
            status
        }
        const orders = await (Order as any).findByUser(userId, options)
        const totalQuery: any = { user: userId }
        if (status) totalQuery.status = status
        const total = await Order.countDocuments(totalQuery)
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

// POST /api/orders - Create a pay-on-delivery order
export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const userId = getUserIdFromRequest(req)
        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const currency = normalizeCurrency(body?.currency)
        const clientAmount = toAmount(body?.amount)
        const phone = String(
            body?.phone ||
            body?.phonenumber ||
            body?.phone_number ||
            body?.shippingAddress?.phone ||
            body?.billingAddress?.phone ||
            ''
        ).trim()

        const { items, subtotal } = await buildOrderItems(body?.cartItems)

        if (Number.isFinite(clientAmount) && !amountsMatch(subtotal, clientAmount)) {
            return NextResponse.json({ success: false, message: 'Amount mismatch' }, { status: 400 })
        }

        const shippingAddress = buildAddress(
            body?.shippingAddress,
            phone || body?.billingAddress?.phone
        )
        const billingAddress = buildAddress(body?.billingAddress || body?.shippingAddress, shippingAddress.phone)

        const order = await Order.create({
            orderNumber: generateOrderNumber(),
            user: userId,
            items,
            shippingAddress,
            billingAddress,
            subtotal,
            shippingCost: 0,
            tax: 0,
            discount: 0,
            total: subtotal,
            currency,
            status: 'processing',
            paymentStatus: 'pending',
            paymentMethod: 'cash_on_delivery',
            paymentReference: generatePaymentReference('COD'),
            notes: 'Customer selected pay on delivery. Delivery is free in and outside Lagos.',
        })

        await reduceInventory(order.items as any)

        try {
            const user = await (User as any).findById(userId).select('email firstName lastName isActive')
            const customer = {
                email: String(body?.email || user?.email || ''),
                firstName: String(body?.firstName || user?.firstName || shippingAddress.firstName || ''),
                lastName: String(body?.lastName || user?.lastName || shippingAddress.lastName || ''),
                phone: shippingAddress.phone,
            }
            const orderSummary = {
                orderNumber: String(order.orderNumber),
                status: String(order.status),
                paymentStatus: String(order.paymentStatus),
                paymentMethod: 'cash_on_delivery',
                total: Number(order.total || 0),
                currency: String(order.currency || 'NGN'),
                createdAt: (order as any).createdAt,
                items: order.items.map((item: any) => ({
                    name: String(item.name),
                    quantity: Number(item.quantity || 0),
                    price: Number(item.price || 0),
                    image: String(item.image || ''),
          selectedColor: String(item.selectedColor || ''),
                })),
                shippingAddress: order.shippingAddress,
            }

            try {
                await sendOwnerOrderNotificationEmail(customer, orderSummary)
            } catch (ownerEmailError) {
                console.error('Owner order notification email error:', ownerEmailError)
            }

            if (customer.email && user?.isActive !== false) {
                try {
                    await sendOrderConfirmationEmail(customer, orderSummary)
                } catch (customerEmailError) {
                    console.error('Customer order confirmation email error:', customerEmailError)
                }
            }
        } catch (emailError) {
            console.error('Order email notification error:', emailError)
        }

        return NextResponse.json({
            success: true,
            message: 'Pay-on-delivery order created successfully',
            data: order,
        }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating order:', error)
        return NextResponse.json({ success: false, message: 'Error creating order', error: error.message }, { status: 500 })
    }
}
