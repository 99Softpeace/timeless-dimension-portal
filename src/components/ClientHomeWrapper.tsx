"use client"

import dynamic from 'next/dynamic'
import React from 'react'

// Use dynamic import here in the client wrapper to avoid importing
// heavy client-only libraries at server build/prerender time.
const ClientHome: any = dynamic(() => import('@/components/ClientHome') as any, {
  ssr: false,
  loading: () => <div className="py-20 text-center text-silver-dark">Loading interactive content…</div>,
})

export default function ClientHomeWrapper() {
  return <ClientHome />
}
