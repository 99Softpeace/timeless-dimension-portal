'use client'

import dynamic from 'next/dynamic'

// Dynamically import CheckoutContent to ensure it's client-only
const CheckoutContent = dynamic(
  () => import('@/components/CheckoutContent'),
  { ssr: false }
)

export default function CheckoutPage() {
  return <CheckoutContent />
}
