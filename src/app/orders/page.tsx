'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type OrderListItem = {
  _id: string
  orderNumber: string
  total: number
  currency: string
  status: string
  paymentStatus: string
  createdAt: string
  totalItems?: number
}

function StatusBadge({ value }: { value: string }) {
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

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login?redirect=/orders')
        return
      }

      try {
        setLoading(true)
        setError('')

        const params = new URLSearchParams({ page: '1', limit: '50' })
        if (statusFilter !== 'all') {
          params.set('status', statusFilter)
        }

        const res = await fetch(`/api/orders?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const result = await res.json()

        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Failed to fetch orders')
        }

        setOrders(result.data || [])
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }

    void fetchOrders()
  }, [router, statusFilter])

  return (
    <div className="pt-24 min-h-screen bg-gray-50 dark:bg-slate-900 px-4">
      <div className="max-w-6xl mx-auto py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Orders</h1>
            <p className="text-slate-600 dark:text-slate-300">
              Track payment and fulfillment progress for your purchases.
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-slate-800 dark:text-white"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing / Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-300">Loading orders...</div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-rose-600 dark:text-rose-400 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-full bg-emerald-500 text-white font-semibold"
              >
                Retry
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No orders yet</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-5">Your paid orders will appear here.</p>
              <Link
                href="/shop"
                className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-900/40 border-b border-gray-100 dark:border-slate-700">
                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500">Order</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500">Date</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500">Total</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500">Fulfillment</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500">Payment</th>
                    <th className="px-5 py-4 text-xs uppercase tracking-wider text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/70 dark:hover:bg-slate-900/30">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{order.orderNumber}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {(order.totalItems || 0) > 0 ? `${order.totalItems} item(s)` : 'Order'}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                        {order.currency} {Number(order.total).toLocaleString()}
                      </td>
                      <td className="px-5 py-4"><StatusBadge value={order.status} /></td>
                      <td className="px-5 py-4"><StatusBadge value={order.paymentStatus} /></td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/orders/${order._id}`}
                          className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                        >
                          View details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
