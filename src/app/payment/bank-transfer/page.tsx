'use client'

import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/components/CartContext'

function TransferInstructions() {
  const params = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const orderId = params.get('orderId') || ''
  const orderNumber = params.get('orderNumber') || ''
  const bankName = params.get('bankName') || 'Flutterwave bank'
  const accountNumber = params.get('accountNumber') || ''
  const accountName = params.get('accountName') || ''
  const amount = Number(params.get('amount') || 0)
  const expiresAtValue = params.get('expiresAt') || ''
  const expiresAt = useMemo(() => {
    const parsed = Date.parse(expiresAtValue)
    return Number.isFinite(parsed) ? parsed : Date.now() + 30 * 60 * 1000
  }, [expiresAtValue])
  const [secondsLeft, setSecondsLeft] = useState(() => Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)))
  const [copied, setCopied] = useState('')
  const [message, setMessage] = useState('Waiting for your transfer...')

  useEffect(() => {
    const timer = window.setInterval(() => setSecondsLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))), 1000)
    return () => window.clearInterval(timer)
  }, [expiresAt])

  useEffect(() => {
    if (!orderId) return
    const check = async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
        const result = await response.json()
        if (response.ok && result?.data?.paymentStatus === 'paid') {
          setMessage('Payment confirmed! Redirecting to your order confirmation...')
          clearCart()
          const query = new URLSearchParams({ orderNumber })
          query.set('orderId', orderId)
          router.replace(`/order-success?${query.toString()}`)
        }
      } catch {
        setMessage('Still waiting for payment confirmation...')
      }
    }
    void check()
    const poller = window.setInterval(check, 5000)
    return () => window.clearInterval(poller)
  }, [clearCart, orderId, orderNumber, router])

  const copy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(label)
    window.setTimeout(() => setCopied(''), 1500)
  }
  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const seconds = (secondsLeft % 60).toString().padStart(2, '0')

  return (
    <main className="min-h-screen bg-gray-50 px-4 pt-24 dark:bg-slate-900">
      <section className="mx-auto max-w-xl rounded-2xl border border-gray-100 bg-white p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-9">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Bank transfer</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Complete your payment</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-300">Open your banking app and transfer the exact amount below.</p>
        </div>
        <div className="mb-5 rounded-xl bg-amber-50 p-4 text-center text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          {secondsLeft > 0 ? <>Account expires in <strong>{minutes}:{seconds}</strong></> : <strong>This account has expired. Return to checkout to generate another.</strong>}
        </div>
        <div className="space-y-4 rounded-2xl bg-slate-50 p-5 dark:bg-slate-900">
          <div><p className="text-xs uppercase text-slate-400">Bank</p><p className="font-semibold text-slate-900 dark:text-white">{bankName}</p></div>
          <div><p className="text-xs uppercase text-slate-400">Account name</p><p className="font-semibold text-slate-900 dark:text-white">{accountName}</p></div>
          <div className="flex items-end justify-between gap-3"><div><p className="text-xs uppercase text-slate-400">Account number</p><p className="text-2xl font-bold tracking-wider text-slate-900 dark:text-white">{accountNumber}</p></div><button type="button" onClick={() => copy(accountNumber, 'account')} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">{copied === 'account' ? 'Copied' : 'Copy'}</button></div>
          <div className="flex items-end justify-between gap-3"><div><p className="text-xs uppercase text-slate-400">Exact amount</p><p className="text-2xl font-bold text-slate-900 dark:text-white">&#8358;{amount.toLocaleString()}</p></div><button type="button" onClick={() => copy(String(amount), 'amount')} className="rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600">{copied === 'amount' ? 'Copied' : 'Copy'}</button></div>
        </div>
        <div className="my-5 flex items-center gap-3 rounded-xl border border-emerald-100 p-4 dark:border-emerald-900"><span className="h-3 w-3 animate-pulse rounded-full bg-emerald-500"/><p className="text-sm text-slate-600 dark:text-slate-300">{message}</p></div>
        <p className="text-center text-xs text-slate-400">Order {orderNumber}. Do not reuse this account for another order.</p>
        <div className="mt-6 flex justify-center gap-3"><Link href="/orders" className="rounded-full border px-5 py-2.5 text-sm font-semibold dark:border-slate-600 dark:text-white">View orders</Link><Link href="/checkout" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">Back to checkout</Link></div>
      </section>
    </main>
  )
}

export default function BankTransferPage() {
  return <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-24 text-center dark:bg-slate-900 dark:text-white">Loading transfer details...</div>}><TransferInstructions /></Suspense>
}



