import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'
import Order from '@/models/Order'
import { encryptFlutterwaveValue, flutterwaveRequest } from '@/lib/flutterwave-v4'
import { amountsMatch, buildAddress, buildOrderItems, generateOrderNumber, generatePaymentReference, normalizeCurrency, toAmount, type CheckoutAddress, type CheckoutCartItem } from '@/lib/order-utils'

type CardInput = { number?: string; expiryMonth?: string; expiryYear?: string; cvv?: string; pin?: string }
type Body = { amount?: number | string; currency?: string; email?: string; phone?: string; name?: string; firstName?: string; lastName?: string; paymentMethod?: 'card' | 'bank_transfer'; card?: CardInput; cartItems?: CheckoutCartItem[]; shippingAddress?: CheckoutAddress; billingAddress?: CheckoutAddress }

const actionRedirect = (action: any) => action?.redirect_url?.url || action?.redirect_url || action?.url || null

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req)
    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    const body = (await req.json()) as Body
    const email = String(body.email || '').trim()
    const firstName = String(body.firstName || '').trim()
    const lastName = String(body.lastName || '').trim()
    const name = String(body.name || `${firstName} ${lastName}`).trim()
    const phone = String(body.phone || body.shippingAddress?.phone || '').replace(/\s+/g, '')
    const currency = normalizeCurrency(body.currency)
    const paymentMethod = body.paymentMethod === 'bank_transfer' ? 'bank_transfer' : 'card'
    if (!email || !name) return NextResponse.json({ success: false, message: 'Customer name and email are required' }, { status: 400 })
    if (!process.env.FLW_CLIENT_ID || !process.env.FLW_CLIENT_SECRET) return NextResponse.json({ success: false, message: 'Flutterwave V4 is not configured' }, { status: 500 })

    await dbConnect()
    const { items, subtotal } = await buildOrderItems(body.cartItems)
    const clientAmount = toAmount(body.amount)
    if (Number.isFinite(clientAmount) && !amountsMatch(subtotal, clientAmount)) return NextResponse.json({ success: false, message: 'Amount mismatch' }, { status: 400 })
    const shippingAddress = buildAddress(body.shippingAddress, phone)
    const billingAddress = buildAddress(body.billingAddress || body.shippingAddress, phone)
    const reference = generatePaymentReference('FLW4')
    const order = await Order.create({ orderNumber: generateOrderNumber(), user: userId, items, shippingAddress, billingAddress, subtotal, shippingCost: 0, tax: 0, discount: 0, total: subtotal, currency, status: 'pending', paymentStatus: 'pending', paymentMethod, paymentReference: reference, notes: `Flutterwave V4 ${paymentMethod} initialized` })

    const customerSearch = await flutterwaveRequest<{ data: any }>('/customers/search?page=1&size=10', { method: 'POST', body: JSON.stringify({ email }) })
    const matches = Array.isArray(customerSearch.data) ? customerSearch.data : customerSearch.data?.customers || customerSearch.data?.items || (customerSearch.data?.id ? [customerSearch.data] : [])
    const existingCustomer = matches.find((item: any) => String(item.email || '').toLowerCase() === email.toLowerCase())
    const customer = existingCustomer?.id
      ? { data: existingCustomer }
      : await flutterwaveRequest<{ data: { id: string } }>('/customers', { method: 'POST', body: JSON.stringify({ email, name: { first: firstName || name.split(' ')[0], last: lastName || name.split(' ').slice(1).join(' ') || firstName } }) })

    if (paymentMethod === 'bank_transfer') {
      if (currency !== 'NGN') throw new Error('Bank transfer checkout supports NGN only')
      const account = await flutterwaveRequest<{ data: any }>('/virtual-accounts', { method: 'POST', body: JSON.stringify({ reference, customer_id: customer.data.id, expiry: 1800, amount: subtotal, currency, account_type: 'dynamic', narration: name, meta: { order_id: String(order._id), order_number: order.orderNumber } }) })
      order.paymentIntentId = String(account.data.id || '')
      await order.save()
      return NextResponse.json({ success: true, data: { paymentMethod, orderId: String(order._id), orderNumber: order.orderNumber, reference, accountNumber: account.data.account_number, bankName: account.data.account_bank_name, accountName: account.data.narration || name, note: account.data.note, expiresAt: account.data.account_expiration_datetime, amount: subtotal, currency } })
    }

    const card = body.card || {}
    const number = String(card.number || '').replace(/\D/g, '')
    const month = String(card.expiryMonth || '').replace(/\D/g, '').padStart(2, '0')
    const year = String(card.expiryYear || '').replace(/\D/g, '').slice(-2)
    const cvv = String(card.cvv || '').replace(/\D/g, '')
    if (number.length < 13 || !month || !year || cvv.length < 3) return NextResponse.json({ success: false, message: 'Valid card details are required' }, { status: 400 })
    const nonce = crypto.randomBytes(9).toString('base64url').slice(0, 12)
    const method = await flutterwaveRequest<{ data: { id: string } }>('/payment-methods', { method: 'POST', body: JSON.stringify({ type: 'card', card: { encrypted_card_number: await encryptFlutterwaveValue(number, nonce), encrypted_expiry_month: await encryptFlutterwaveValue(month, nonce), encrypted_expiry_year: await encryptFlutterwaveValue(year, nonce), encrypted_cvv: await encryptFlutterwaveValue(cvv, nonce), nonce } }) })
    const frontendBase = (process.env.FRONTEND_URL || req.nextUrl.origin).replace(/\/+$/, '')
    let response = await flutterwaveRequest<{ data: any }>('/charges', { method: 'POST', body: JSON.stringify({ reference, currency, customer_id: customer.data.id, payment_method_id: method.data.id, redirect_url: `${frontendBase}/payment/callback`, amount: subtotal, meta: { order_id: String(order._id), order_number: order.orderNumber } }) })
    let charge = response.data
    order.paymentIntentId = String(charge.id || '')
    await order.save()
    const action = charge.next_action
    const needsPin = action?.authorization?.type === 'pin' || action?.type === 'requires_pin'
    if (needsPin) {
      const pin = String(card.pin || '').replace(/\D/g, '')
      if (!pin) return NextResponse.json({ success: false, message: 'This card requires a PIN' }, { status: 400 })
      const pinNonce = crypto.randomBytes(9).toString('base64url').slice(0, 12)
      response = await flutterwaveRequest<{ data: any }>(`/charges/${encodeURIComponent(charge.id)}`, { method: 'PUT', body: JSON.stringify({ authorization: { type: 'pin', pin: { nonce: pinNonce, encrypted_pin: await encryptFlutterwaveValue(pin, pinNonce) } } }) })
      charge = response.data
    }
    return NextResponse.json({ success: true, data: { paymentMethod, orderId: String(order._id), orderNumber: order.orderNumber, chargeId: charge.id, reference, status: charge.status, redirectUrl: actionRedirect(charge.next_action) } })
  } catch (error: any) {
    console.error('Flutterwave V4 initialization error:', error)
    return NextResponse.json({ success: false, message: 'Payment initialization failed', error: error.message }, { status: 500 })
  }
}
