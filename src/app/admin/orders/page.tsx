'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

type AdminOrder = {
  _id: string
  orderNumber: string
  total: number
  currency: string
  status: string
  paymentStatus: string
  trackingNumber?: string
  createdAt: string
  user?: {
    firstName?: string
    lastName?: string
    email?: string
  }
}

type DraftState = {
  status: string
  paymentStatus: string
  trackingNumber: string
  notes: string
}

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [savingId, setSavingId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, DraftState>>({})

  const token = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : null), [])

  const seedDrafts = (list: AdminOrder[]) => {
    setDrafts((prev) => {
      const next = { ...prev }
      for (const order of list) {
        if (!next[order._id]) {
          next[order._id] = {
            status: order.status,
            paymentStatus: order.paymentStatus,
            trackingNumber: order.trackingNumber || '',
            notes: '',
          }
        }
      }
      return next
    })
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams({ page: '1', limit: '100' })
      if (statusFilter !== 'all') {
        params.set('status', statusFilter)
      }

      const res = await fetch(`/api/orders/admin?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const result = await res.json()
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch orders')
      }

      setOrders(result.data || [])
      seedDrafts(result.data || [])
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchOrders()
  }, [statusFilter])

  const updateDraft = (id: string, patch: Partial<DraftState>) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || { status: 'pending', paymentStatus: 'pending', trackingNumber: '', notes: '' }), ...patch },
    }))
  }

  const saveOrder = async (orderId: string) => {
    try {
      const draft = drafts[orderId]
      if (!draft) return

      setSavingId(orderId)

      const res = await fetch(`/api/orders/admin/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(draft),
      })

      const result = await res.json()
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to update order')
      }

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, ...result.data } : order))
      )
      alert('Order updated successfully.')
    } catch (err: any) {
      alert(err?.message || 'Failed to update order.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-display font-bold text-gradient">Orders</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-midnight/50 border border-glass-border rounded-lg px-4 py-2 text-white w-full sm:w-auto"
          >
            <option value="all">All statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button
            onClick={() => void fetchOrders()}
            className="px-4 py-2 bg-teal text-midnight font-bold rounded-lg hover:bg-teal/90 w-full sm:w-auto"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-glass rounded-xl border border-glass-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="border-b border-glass-border bg-white/5">
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Order</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Customer</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Total</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Status</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Payment</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Tracking</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Notes</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-silver">Loading orders...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-red-300">{error}</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-silver">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const draft = drafts[order._id] || {
                    status: order.status,
                    paymentStatus: order.paymentStatus,
                    trackingNumber: order.trackingNumber || '',
                    notes: '',
                  }

                  return (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 transition-colors align-top"
                    >
                      <td className="px-4 py-4">
                        <div className="text-white font-semibold">{order.orderNumber}</div>
                        <div className="text-xs text-silver-dark">{new Date(order.createdAt).toLocaleString()}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-white">
                          {order.user?.firstName || ''} {order.user?.lastName || ''}
                        </div>
                        <div className="text-xs text-silver-dark">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-4 text-white font-mono">
                        {order.currency} {Number(order.total).toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={draft.status}
                          onChange={(e) => updateDraft(order._id, { status: e.target.value })}
                          className="bg-midnight/70 border border-glass-border rounded-lg px-3 py-2 text-white text-sm"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={draft.paymentStatus}
                          onChange={(e) => updateDraft(order._id, { paymentStatus: e.target.value })}
                          className="bg-midnight/70 border border-glass-border rounded-lg px-3 py-2 text-white text-sm"
                        >
                          {PAYMENT_STATUSES.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <input
                          value={draft.trackingNumber}
                          onChange={(e) => updateDraft(order._id, { trackingNumber: e.target.value })}
                          placeholder="Tracking #"
                          className="w-40 bg-midnight/70 border border-glass-border rounded-lg px-3 py-2 text-white text-sm placeholder-silver-dark"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <input
                          value={draft.notes}
                          onChange={(e) => updateDraft(order._id, { notes: e.target.value })}
                          placeholder="Status note"
                          className="w-48 bg-midnight/70 border border-glass-border rounded-lg px-3 py-2 text-white text-sm placeholder-silver-dark"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => void saveOrder(order._id)}
                          disabled={savingId === order._id}
                          className="px-3 py-2 rounded-lg bg-teal text-midnight font-bold disabled:opacity-60"
                        >
                          {savingId === order._id ? 'Saving...' : 'Save'}
                        </button>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
