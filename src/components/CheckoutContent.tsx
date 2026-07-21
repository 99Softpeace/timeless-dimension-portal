'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/CartContext'
import V4PaymentFields from '@/components/V4PaymentFields'

export default function CheckoutContent() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [isPaying, setIsPaying] = useState(false)
  const [card, setCard] = useState({ number: '', expiryMonth: '', expiryYear: '', cvv: '', pin: '' })

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
    paymentMethod: 'card',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (!token || !userStr) {
      router.push('/login?redirect=/checkout')
      return
    }

    try {
      const user = JSON.parse(userStr)
      setFormData((prev) => ({
        ...prev,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      }))
    } catch (error) {
      console.error('Error parsing user data', error)
    }
  }, [router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateCheckoutForm = () => {
    const requiredFields: Array<keyof typeof formData> = [
      'email',
      'firstName',
      'lastName',
      'phone',
      'address1',
      'city',
      'state',
      'postalCode',
      'country',
    ]

    const missing = requiredFields.find((field) => !String(formData[field]).trim())
    if (missing) {
      alert(`Please fill in ${missing}.`)
      return false
    }

    if (items.length === 0) {
      alert('Your cart is empty.')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isPaying) return
    if (!validateCheckoutForm()) return

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login?redirect=/checkout')
      return
    }

    try {
      setIsPaying(true)

      const payload = {
        amount: getTotalPrice(),
        currency: 'NGN',
        email: formData.email,
        phone: formData.phone,
        phone_number: formData.phone,
        phonenumber: formData.phone,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        paymentMethod: formData.paymentMethod,
        ...(formData.paymentMethod === 'card' ? { card } : {}),
        cartItems: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address1: formData.address1,
          address2: formData.address2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address1: formData.address1,
          address2: formData.address2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
      }

      const isPayOnDelivery = formData.paymentMethod === 'cash_on_delivery'
      const res = await fetch(isPayOnDelivery ? '/api/orders' : '/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        if (res.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/login?redirect=/checkout')
          throw new Error('Your login session expired. Please login again to place your order.')
        }

        throw new Error(result.error || result.message || 'Unable to place order.')
      }

      if (isPayOnDelivery) {
        clearCart()
        const order = result?.data
        const query = new URLSearchParams({
          orderNumber: String(order?.orderNumber || ''),
          paymentMethod: 'cash_on_delivery',
        })
        if (order?._id) query.set('orderId', String(order._id))
        router.push(`/order-success?${query.toString()}`)
        return
      }

      if (formData.paymentMethod === 'bank_transfer') {
        const query = new URLSearchParams({
          orderId: String(result.data.orderId), orderNumber: String(result.data.orderNumber),
          bankName: String(result.data.bankName), accountNumber: String(result.data.accountNumber),
          accountName: String(result.data.accountName), amount: String(result.data.amount),
          expiresAt: String(result.data.expiresAt || ''),
        })
        router.push(`/payment/secure-transfer?${query.toString()}`)
        return
      }
      if (result?.data?.redirectUrl) {
        window.location.assign(result.data.redirectUrl)
        return
      }
      if (result?.data?.chargeId && result?.data?.status === 'succeeded') {
        const query = new URLSearchParams({ transaction_id: String(result.data.chargeId), tx_ref: String(result.data.reference), status: 'succeeded' })
        window.location.assign(`/payment/callback?${query.toString()}`)
        return
      }
      throw new Error('Card payment is pending. Complete the authorization requested by your bank.')
    } catch (error: any) {
      setIsPaying(false)
      alert(error?.message || 'Unable to start payment.')
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
            Your cart is empty
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Add some products to get started
          </p>
          <Link
            href="/watches"
            className="px-6 py-3 rounded-full font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 flex items-center justify-center space-x-8">
          {[1, 2, 3].map((num, index) => (
            <div key={num} className="flex items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                  step >= num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                }`}
              >
                {num}
              </div>

              {index < 2 && (
                <div
                  className={`w-12 h-0.5 ml-4 transition ${
                    step > num ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-slate-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700"
                  >
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                      Contact Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        'firstName',
                        'lastName',
                        'email',
                        'phone',
                        'address1',
                        'address2',
                        'city',
                        'state',
                        'postalCode',
                      ].map((field) => (
                        <input
                          key={field}
                          type="text"
                          name={field}
                          placeholder={field}
                          value={(formData as any)[field]}
                          onChange={handleInputChange}
                          className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700"
                  >
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                      Payment Information
                    </h2>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900 p-4 text-sm text-emerald-900 dark:text-emerald-200">
                      Delivery is free in Lagos and outside Lagos. Choose how you want to pay below.
                    </div>

                    <div className="grid gap-3">
                      <label className={`block cursor-pointer rounded-xl border p-4 transition ${
                        formData.paymentMethod === 'card'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                          : 'border-gray-200 dark:border-slate-700'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="flutterwave"
                          checked={formData.paymentMethod === 'card'}
                          onChange={() => setFormData((prev) => ({ ...prev, paymentMethod: 'card' }))}
                          className="mr-3"
                        />
                        <span className="font-semibold text-slate-800 dark:text-white">Pay now with Flutterwave</span>
                        <p className="mt-1 pl-7 text-sm text-slate-500 dark:text-slate-400">
                          Card, bank transfer, or USSD details are collected securely on Flutterwave.
                        </p>
                      </label>
                      <V4PaymentFields paymentMethod={formData.paymentMethod} card={card} setCard={setCard} onMethodChange={(paymentMethod) => setFormData((prev) => ({ ...prev, paymentMethod }))} />

                      <label className={`block cursor-pointer rounded-xl border p-4 transition ${
                        formData.paymentMethod === 'cash_on_delivery'
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                          : 'border-gray-200 dark:border-slate-700'
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash_on_delivery"
                          checked={formData.paymentMethod === 'cash_on_delivery'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span className="font-semibold text-slate-800 dark:text-white">Pay on delivery</span>
                        <p className="mt-1 pl-7 text-sm text-slate-500 dark:text-slate-400">
                          Place your order now and pay when your free delivery arrives.
                        </p>
                      </label>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700"
                  >
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
                      Review Order
                    </h2>

                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between mb-3 text-slate-600 dark:text-slate-300"
                      >
                        <span>{item.name}</span>
                        <span>NGN {item.price.toLocaleString()}</span>
                      </div>
                    ))}

                    <div className="border-t border-gray-200 dark:border-slate-700 pt-4 flex justify-between font-semibold text-slate-800 dark:text-white">
                      <span>Total:</span>
                      <span>NGN {getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="mt-3 flex justify-between text-sm text-emerald-600 dark:text-emerald-300">
                      <span>Delivery:</span>
                      <span>Free in and outside Lagos</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between pt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 rounded-full border border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  >
                    Previous
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-6 py-3 rounded-full font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition ml-auto"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isPaying}
                    className="px-6 py-3 rounded-full font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition ml-auto"
                  >
                    {isPaying
                      ? formData.paymentMethod === 'cash_on_delivery'
                        ? 'Placing Order...'
                        : 'Redirecting to Payment...'
                      : formData.paymentMethod === 'cash_on_delivery'
                        ? 'Place Order - Pay on Delivery'
                        : 'Place Order & Pay'}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 sticky top-24">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
                Order Summary
              </h3>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between mb-3 text-slate-500 dark:text-slate-400"
                >
                  <span>{item.name}</span>
                  <span>NGN {item.price.toLocaleString()}</span>
                </div>
              ))}

              <div className="border-t border-gray-200 dark:border-slate-700 pt-4 flex justify-between font-semibold text-slate-800 dark:text-white">
                <span>Total:</span>
                <span>NGN {getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="mt-3 flex justify-between text-sm text-emerald-600 dark:text-emerald-300">
                <span>Delivery</span>
                <span>Free in and outside Lagos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

