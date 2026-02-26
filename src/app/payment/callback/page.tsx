'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/components/CartContext'

type CallbackState = {
  loading: boolean
  success: boolean
  message: string
  data?: {
    transactionId?: string | null
    txRef?: string | null
    status?: string | null
    amount?: number
    currency?: string | null
    order?: {
      _id?: string
      orderNumber?: string
    }
    payment?: {
      transactionId?: string | null
      txRef?: string | null
      status?: string | null
      amount?: number
      currency?: string | null
    }
  }
}

export default function PaymentCallbackPage() {
  const router = useRouter()
  const { clearCart } = useCart()
  const searchParams = useSearchParams()
  const [state, setState] = useState<CallbackState>({
    loading: true,
    success: false,
    message: 'Verifying payment...',
  })

  useEffect(() => {
    const transactionId = searchParams.get('transaction_id')
    const txRef = searchParams.get('tx_ref')
    const status = searchParams.get('status')

    if (!transactionId) {
      setState({
        loading: false,
        success: false,
        message: 'Missing transaction ID in callback URL.',
      })
      return
    }

    const verify = async () => {
      try {
        const query = new URLSearchParams({
          transaction_id: transactionId,
          finalize: '1',
        })
        if (txRef) {
          query.set('tx_ref', txRef)
        }

        const res = await fetch(`/api/payment/verify?${query.toString()}`)
        const result = await res.json()

        const order = result?.data?.order
        if (res.ok && result.success && order?.orderNumber) {
          clearCart()
          const successQuery = new URLSearchParams({
            orderNumber: String(order.orderNumber),
          })
          if (order?._id) {
            successQuery.set('orderId', String(order._id))
          }
          if (transactionId) {
            successQuery.set('transactionId', String(transactionId))
          }
          router.replace(`/order-success?${successQuery.toString()}`)
          return
        }

        setState({
          loading: false,
          success: Boolean(result.success),
          message: result.message || (result.success ? 'Payment verified.' : 'Payment verification failed.'),
          data: result.data,
        })
      } catch (error) {
        setState({
          loading: false,
          success: false,
          message: 'Unable to verify payment right now.',
        })
      }
    }

    if (status && status !== 'successful') {
      setState({
        loading: false,
        success: false,
        message: `Payment status: ${status}`,
      })
      return
    }

    verify()
  }, [clearCart, router, searchParams])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 px-4">
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Payment Callback
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">{state.message}</p>

        {state.data && (
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300 mb-6">
            <p><strong>Transaction ID:</strong> {state.data.payment?.transactionId || state.data.transactionId || 'N/A'}</p>
            <p><strong>Reference:</strong> {state.data.payment?.txRef || state.data.txRef || 'N/A'}</p>
            <p><strong>Status:</strong> {state.data.payment?.status || state.data.status || 'N/A'}</p>
            {Number.isFinite(state.data.payment?.amount ?? state.data.amount) && (
              <p><strong>Amount:</strong> {(state.data.payment?.amount ?? state.data.amount)?.toLocaleString()} {state.data.payment?.currency || state.data.currency || ''}</p>
            )}
            {state.data.order?.orderNumber && (
              <p><strong>Order:</strong> {state.data.order.orderNumber}</p>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <Link
            href="/checkout"
            className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
          >
            Return to Checkout
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-full border border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
