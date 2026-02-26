'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react'

type DashboardStats = {
  totalRevenue: number
  totalOrders: number
  activeOrders: number
  productsCount: number
  usersCount: number
}

type RecentOrder = {
  _id: string
  orderNumber: string
  total: number
  currency: string
  status: string
  paymentStatus: string
  createdAt: string
  user?: {
    firstName?: string
    lastName?: string
    email?: string
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        setError('')
        const token = localStorage.getItem('token')

        const res = await fetch('/api/admin/dashboard', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const result = await res.json()

        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Failed to fetch dashboard')
        }

        setStats(result.data?.stats || null)
        setRecentOrders(result.data?.recentOrders || [])
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch dashboard')
      } finally {
        setLoading(false)
      }
    }

    void fetchDashboard()
  }, [])

  const cards = [
    {
      label: 'Total Revenue',
      value: stats ? `NGN ${Number(stats.totalRevenue || 0).toLocaleString()}` : '...',
      icon: DollarSign,
      color: 'text-gold',
    },
    {
      label: 'Active Orders',
      value: stats ? String(stats.activeOrders) : '...',
      icon: ShoppingBag,
      color: 'text-teal',
    },
    {
      label: 'Products',
      value: stats ? String(stats.productsCount) : '...',
      icon: Package,
      color: 'text-blue-400',
    },
    {
      label: 'Customers',
      value: stats ? String(stats.usersCount) : '...',
      icon: Users,
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-silver">Dashboard</h1>
          <p className="text-silver-dark text-sm mt-1">
            Live order, customer and revenue overview.
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="px-4 py-2 bg-teal text-midnight font-bold rounded-lg hover:bg-teal/90 transition-colors"
        >
          Manage Orders
        </Link>
      </div>

      {error && (
        <div className="glass-card p-4 border border-red-400/20 text-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xl font-bold text-silver">{stat.value}</span>
            </div>
            <h3 className="text-silver-dark text-sm">{stat.label}</h3>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-silver">Recent Orders</h2>
          <Link href="/admin/orders" className="text-teal text-sm font-semibold hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="py-10 text-center text-silver-dark">Loading dashboard data...</div>
        ) : recentOrders.length === 0 ? (
          <div className="py-10 text-center text-silver-dark">
            No orders yet. Once customers pay, they will appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-glass-border">
                  <th className="px-3 py-3 text-xs font-semibold text-teal uppercase tracking-wider">Order</th>
                  <th className="px-3 py-3 text-xs font-semibold text-teal uppercase tracking-wider">Customer</th>
                  <th className="px-3 py-3 text-xs font-semibold text-teal uppercase tracking-wider">Total</th>
                  <th className="px-3 py-3 text-xs font-semibold text-teal uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3 text-xs font-semibold text-teal uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-3 py-3">
                      <div className="text-silver font-medium">{order.orderNumber}</div>
                      <div className="text-xs text-silver-dark">{order._id}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-silver">
                        {order.user?.firstName || ''} {order.user?.lastName || ''}
                      </div>
                      <div className="text-xs text-silver-dark">{order.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-3 py-3 text-silver font-mono">
                      {order.currency} {Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-silver-dark">
                      {order.status} / {order.paymentStatus}
                    </td>
                    <td className="px-3 py-3 text-silver-dark text-sm">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
