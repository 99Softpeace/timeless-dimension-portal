'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, CheckCircle2, Clock3, Copy, Landmark, LockKeyhole, ShieldCheck, Smartphone } from 'lucide-react'
import { useCart } from '@/components/CartContext'

export default function BankTransferExperience() {
  const params = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const details = {
    orderId: params.get('orderId') || '', orderNumber: params.get('orderNumber') || '',
    bankName: params.get('bankName') || 'Flutterwave Bank', accountNumber: params.get('accountNumber') || '',
    accountName: params.get('accountName') || '', amount: Number(params.get('amount') || 0),
  }
  const expiresAt = useMemo(() => {
    const parsed = Date.parse(params.get('expiresAt') || '')
    return Number.isFinite(parsed) ? parsed : Date.now() + 30 * 60 * 1000
  }, [params])
  const [secondsLeft, setSecondsLeft] = useState(() => Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)))
  const [copied, setCopied] = useState('')
  const [status, setStatus] = useState<'waiting' | 'confirmed'>('waiting')

  useEffect(() => {
    const timer = window.setInterval(() => setSecondsLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))), 1000)
    return () => window.clearInterval(timer)
  }, [expiresAt])

  useEffect(() => {
    if (!details.orderId) return
    const check = async () => {
      const token = localStorage.getItem('token')
      if (!token) return
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(details.orderId)}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
        const result = await response.json()
        if (response.ok && result?.data?.paymentStatus === 'paid') {
          setStatus('confirmed')
          clearCart()
          window.setTimeout(() => router.replace(`/order-success?${new URLSearchParams({ orderNumber: details.orderNumber, orderId: details.orderId })}`), 1200)
        }
      } catch { /* keep waiting; webhook confirmation can take a moment */ }
    }
    void check()
    const poller = window.setInterval(check, 5000)
    return () => window.clearInterval(poller)
  }, [clearCart, details.orderId, details.orderNumber, router])

  const copy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    window.setTimeout(() => setCopied(''), 1800)
  }
  const time = `${Math.floor(secondsLeft / 60).toString().padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f8f7] px-4 pb-16 pt-24 dark:bg-slate-950">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/20" />
      <div className="relative mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          <LockKeyhole className="h-4 w-4 text-emerald-600" /> Secure payment powered by Flutterwave
        </div>

        <section className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_24px_80px_-28px_rgba(15,23,42,.25)] dark:border-slate-800 dark:bg-slate-900">
          <header className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 py-8 text-white sm:px-10">
            <div className="flex items-start justify-between gap-5">
              <div><p className="mb-2 text-xs font-semibold uppercase tracking-[.22em] text-emerald-300">Senators Watches</p><h1 className="text-2xl font-bold sm:text-3xl">Complete your bank transfer</h1><p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">Use your bank app to send the exact amount. We’ll confirm your order automatically—no receipt upload needed.</p></div>
              <div className="hidden rounded-2xl bg-white/10 p-3 sm:block"><ShieldCheck className="h-7 w-7 text-emerald-300" /></div>
            </div>
          </header>

          <div className="px-5 py-6 sm:px-10 sm:py-8">
            <div className={`mb-7 flex items-center justify-between rounded-2xl border px-4 py-3 ${secondsLeft ? 'border-emerald-100 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100' : 'border-rose-100 bg-rose-50 text-rose-800'}`}>
              <span className="flex items-center gap-2 text-sm font-medium"><Clock3 className="h-4 w-4" />{secondsLeft ? 'Account reserved for you' : 'Account expired'}</span>
              <strong className="font-mono text-lg tracking-wider">{time}</strong>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/60 sm:p-6">
              <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-800"><div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><Landmark className="h-5 w-5" /></div><div><p className="text-xs uppercase tracking-wider text-slate-400">Transfer to</p><p className="font-bold text-slate-900 dark:text-white">{details.bankName}</p></div></div>
              <div className="space-y-5">
                <div><p className="text-xs font-medium uppercase tracking-wider text-slate-400">Account name</p><p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">{details.accountName}</p></div>
                <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-wider text-slate-400">Account number</p><p className="mt-1 text-2xl font-black tracking-[.12em] text-slate-950 dark:text-white sm:text-3xl">{details.accountNumber}</p></div><CopyButton active={copied === 'account'} onClick={() => copy(details.accountNumber, 'account')} /></div>
                <div className="flex items-end justify-between gap-4 border-t border-slate-200 pt-5 dark:border-slate-800"><div><p className="text-xs font-medium uppercase tracking-wider text-slate-400">Exact amount</p><p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">₦{details.amount.toLocaleString()}</p></div><CopyButton active={copied === 'amount'} onClick={() => copy(String(details.amount), 'amount')} /></div>
              </div>
            </div>

            <div className="my-7 grid grid-cols-3 gap-2 text-center text-xs text-slate-500 dark:text-slate-400">
              <Step icon={<Smartphone />} number="1" text="Open bank app" /><Step icon={<Landmark />} number="2" text="Make transfer" /><Step icon={<CheckCircle2 />} number="3" text="Auto-confirm" />
            </div>

            <div className={`flex items-center gap-3 rounded-2xl p-4 ${status === 'confirmed' ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-50 text-blue-900 dark:bg-blue-950/30 dark:text-blue-100'}`}>
              {status === 'confirmed' ? <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" /> : <span className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-blue-500" />}
              <div><p className="text-sm font-semibold">{status === 'confirmed' ? 'Payment confirmed' : 'Waiting for payment'}</p><p className="text-xs opacity-70">{status === 'confirmed' ? 'Taking you to your confirmation page...' : 'This page updates automatically after your transfer.'}</p></div>
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">Order {details.orderNumber} · Only use this account for this order</p>
            <div className="mt-6 flex justify-center gap-3"><Link href="/orders" className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-white">View orders</Link><Link href="/checkout" className="rounded-full px-5 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">Cancel payment</Link></div>
          </div>
        </section>
        <div className="mt-5 flex items-center justify-center gap-5 text-xs text-slate-400"><span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Secure processing</span><span>•</span><span>Instant confirmation</span></div>
      </div>
    </main>
  )
}

function CopyButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex min-w-20 items-center justify-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-600 dark:bg-white dark:text-slate-900">{active ? <><Check className="h-3.5 w-3.5" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}</button>
}

function Step({ icon, number, text }: { icon: React.ReactElement; number: string; text: string }) {
  return <div className="rounded-xl bg-slate-50 px-2 py-3 dark:bg-slate-950"><div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm dark:bg-slate-900">{icon}</div><span className="font-semibold text-slate-700 dark:text-slate-200">{number}. {text}</span></div>
}
