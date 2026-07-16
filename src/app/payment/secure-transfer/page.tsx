'use client'

import { Suspense } from 'react'
import BankTransferExperience from '@/components/BankTransferExperience'

export default function SecureTransferPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-24 text-center dark:bg-slate-900 dark:text-white">Loading secure payment...</div>}>
      <BankTransferExperience />
    </Suspense>
  )
}
