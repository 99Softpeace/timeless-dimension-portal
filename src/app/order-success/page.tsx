import Link from 'next/link'

type OrderSuccessPageProps = {
  searchParams?: {
    orderNumber?: string
    orderId?: string
    transactionId?: string
  }
}

export default function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const orderNumber = searchParams?.orderNumber || ''
  const orderId = searchParams?.orderId || ''
  const transactionId = searchParams?.transactionId || ''

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-24 px-4">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Payment Successful
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Your payment has been confirmed and your order has been recorded.
        </p>

        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300 mb-8">
          <p>
            <strong>Order Number:</strong> {orderNumber || 'Pending'}
          </p>
          {orderId && (
            <p>
              <strong>Order ID:</strong> {orderId}
            </p>
          )}
          {transactionId && (
            <p>
              <strong>Transaction ID:</strong> {transactionId}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {orderId && (
            <Link
              href={`/orders/${orderId}`}
              className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-700 text-white font-semibold transition"
            >
              View My Order
            </Link>
          )}
          <Link
            href="/orders"
            className="px-4 py-2 rounded-full border border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
          >
            My Orders
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
