'use client'

import Link from 'next/link'
import { Package, ShoppingBag, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function CustomerPage() {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto glass-card p-8 text-center text-silver-dark">
          Loading your account...
        </div>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto glass-card p-8 text-center space-y-4">
          <h1 className="text-3xl font-display font-bold text-silver">Customer Portal</h1>
          <p className="text-silver-dark">Please sign in to view your account.</p>
          <Link
            href="/login"
            className="inline-flex items-center px-5 py-2 rounded-lg bg-teal text-midnight font-semibold hover:bg-teal/90"
          >
            Sign In
          </Link>
        </div>
      </section>
    )
  }

  if (isAdmin) {
    return (
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto glass-card p-8 text-center space-y-4">
          <h1 className="text-3xl font-display font-bold text-silver">Admin Account</h1>
          <p className="text-silver-dark">
            Your account has admin access. Use the admin dashboard to manage the store.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center px-5 py-2 rounded-lg bg-teal text-midnight font-semibold hover:bg-teal/90"
          >
            Open Admin Dashboard
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-display font-bold text-silver">
            Welcome back, {user.firstName}
          </h1>
          <p className="text-silver-dark mt-2">
            Manage your orders, continue shopping, and keep your account details up to date.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/orders" className="glass-card p-6 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3 text-teal mb-3">
              <ShoppingBag size={20} />
              <span className="font-semibold">My Orders</span>
            </div>
            <p className="text-silver-dark text-sm">Track payment, shipping, and delivery updates.</p>
          </Link>

          <Link href="/shop" className="glass-card p-6 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3 text-teal mb-3">
              <Package size={20} />
              <span className="font-semibold">Continue Shopping</span>
            </div>
            <p className="text-silver-dark text-sm">Browse the latest Senator watch collections.</p>
          </Link>

          <Link href="/contact" className="glass-card p-6 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3 text-teal mb-3">
              <User size={20} />
              <span className="font-semibold">Support</span>
            </div>
            <p className="text-silver-dark text-sm">Need help with an order or account issue? Contact support.</p>
          </Link>
        </div>
      </div>
    </section>
  )
}
