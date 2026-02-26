'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type OrderItem = {
  _id?: string
  name: string
  price: number
  quantity: number
  image?: string
}

type OrderDetails = {
  _id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  currency: string
  createdAt: string
  trackingNumber?: string
  paymentReference?: string
  paymentIntentId?: string
  shippingAddress?: {
    firstName?: string
    lastName?: string
    address1?: string
    address2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    phone?: string
  }
  items: OrderItem[]
}

function Badge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-rose-100 text-rose-700',
    refunded: 'bg-slate-200 text-slate-700',
    paid: 'bg-emerald-100 text-emerald-700',
    failed: 'bg-rose-100 text-rose-700',
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[value] || 'bg-slate-100 text-slate-700'}`}>
      {value}
    </span>
  )
}

function Timeline({ status }: { status: string }) {
  const steps = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'processing', label: 'Being Packed' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ]

  const activeIndex = (() => {
    if (status === 'cancelled') return -1
    if (status === 'refunded') return steps.findIndex((s) => s.key === 'delivered')
    const idx = steps.findIndex((s) => s.key === status)
    return idx >= 0 ? idx : 0
  })()

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const complete = activeIndex >= index
        const current = activeIndex === index
        return (
          <div key={step.key} className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                complete ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-slate-500'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-sm ${
                current
                  ? 'text-slate-900 dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {step.label}
            </span>
          </div>
        )
      })}
      {status === 'cancelled' && (
        <p className="text-sm text-rose-600 dark:text-rose-400 font-semibold">
          This order was cancelled.
        </p>
      )}
    </div>
  )
}

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const orderId = useMemo(() => String(params?.id || ''), [params])

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push(`/login?redirect=/orders/${orderId}`)
        return
      }

      try {
        setLoading(true)
        setError('')
        const res = await fetch(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const result = await res.json()
        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Failed to fetch order')
        }
        setOrder(result.data)
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch order')
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      void fetchOrder()
    }
  }, [orderId, router])

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 dark:bg-slate-900 px-4">
        <div className="max-w-6xl mx-auto py-8 text-slate-600 dark:text-slate-300">Loading order...</div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 dark:bg-slate-900 px-4">
        <div className="max-w-6xl mx-auto py-8">
          <p className="text-rose-600 dark:text-rose-400 mb-4">{error || 'Order not found'}</p>
          <Link href="/orders" className="text-emerald-600 font-semibold">Back to My Orders</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-slate-900 px-4">
      <div className="max-w-6xl mx-auto py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <Link href="/orders" className="text-sm text-emerald-600 font-semibold">Back to My Orders</Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{order.orderNumber}</h1>
            <p className="text-slate-500 dark:text-slate-400">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge value={order.status} />
            <Badge value={order.paymentStatus} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Items</h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={`${item.name}-${idx}`} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Qty {item.quantity} x {order.currency} {Number(item.price).toLocaleString()}
                      </p>
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {order.currency} {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Shipping Progress</h2>
              <Timeline status={order.status} />
              {order.trackingNumber && (
                <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
                  Tracking Number: <span className="font-semibold">{order.trackingNumber}</span>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Subtotal</span>
                  <span>{order.currency} {Number(order.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Shipping</span>
                  <span>{order.currency} {Number(order.shippingCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Tax</span>
                  <span>{order.currency} {Number(order.tax || 0).toLocaleString()}</span>
                </div>
                {Number(order.discount || 0) > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Discount</span>
                    <span>-{order.currency} {Number(order.discount || 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-slate-700 pt-3 flex justify-between font-semibold text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span>{order.currency} {Number(order.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Delivery Address</h2>
              <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                </p>
                <p>{order.shippingAddress?.address1}</p>
                {order.shippingAddress?.address2 && <p>{order.shippingAddress.address2}</p>}
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
                <p>{order.shippingAddress?.postalCode}</p>
                <p>{order.shippingAddress?.country}</p>
                {order.shippingAddress?.phone && <p>{order.shippingAddress.phone}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
