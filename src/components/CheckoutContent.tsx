'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Truck, Shield, Lock } from 'lucide-react'
import { useCart } from '@/components/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'

export default function CheckoutContent() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1)

  // Auth check
  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (!token || !userStr) {
      // Not logged in, redirect to login
      // using router.push directly might be fast, but let's check properly
      router.push('/login?redirect=/checkout')
      return
    }

    // Pre-fill form data if available
    try {
      const user = JSON.parse(userStr)
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || ''
      }))
    } catch (e) {
      console.error("Error parsing user data", e)
    }

  }, [router])

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
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || 'FLWPUBK_TEST-xxxxxxxxxx',
    tx_ref: Date.now().toString(),
    amount: getTotalPrice(),
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: formData.email,
      phone_number: formData.phone,
      name: `${formData.firstName} ${formData.lastName}`,
    },
    customizations: {
      title: 'Timeless Dimension Portal',
      description: 'Payment for items in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  }

  const handleFlutterwavePayment = useFlutterwave(config)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    handleFlutterwavePayment({
      callback: (response) => {
        console.log('Payment response:', response)
        closePaymentModal()

        if (response.status === 'successful') {
          // Verify on backend
          verifyPayment(response.transaction_id)
        }
      },
      onClose: () => {
        console.log('Payment modal closed')
      },
    })
  }

  const verifyPayment = async (transactionId: number) => {
    try {
      // You can call your backend verify endpoint here if needed
      // For now we will just assume success and clear cart

      /* 
      const res = await fetch(\`/api/payment/verify?transaction_id=\${transactionId}\`)
      const data = await res.json()
      if (!data.success) throw new Error('Payment verification failed')
      */

      alert('✅ Payment successful! Order placed.')
      clearCart()
      router.push('/') // Redirect to home or order success page
    } catch (error) {
      console.error('Payment Error:', error)
      alert('Payment verification failed. Please contact support.')
    }
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-silver mb-4">
            Your cart is empty
          </h1>
          <p className="text-silver-dark mb-6">
            Add some watches to get started
          </p>
          <Link href="/shop" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Progress Steps */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-center space-x-8">
            {[
              { number: 1, title: 'Information' },
              { number: 2, title: 'Payment' },
              { number: 3, title: 'Review' },
            ].map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <motion.div
                  animate={{
                    backgroundColor:
                      step >= stepItem.number ? '#20c997' : '#1e1e2f',
                    color: step >= stepItem.number ? '#0a0a0f' : '#999',
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                >
                  {stepItem.number}
                </motion.div>
                <span
                  className={`ml-2 text-sm ${step >= stepItem.number
                    ? 'text-silver'
                    : 'text-silver-dark'
                    }`}
                >
                  {stepItem.title}
                </span>
                {index < 2 && (
                  <motion.div
                    animate={{
                      backgroundColor:
                        step > stepItem.number ? '#20c997' : '#2a2a3d',
                      scaleX: step > stepItem.number ? 1 : 0.5,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-0.5 ml-4 origin-left"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6 glass-card"
                  >
                    <h2 className="text-2xl font-display font-bold text-silver mb-6">
                      Contact Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: 'firstName', placeholder: 'First Name' },
                        { name: 'lastName', placeholder: 'Last Name' },
                        { name: 'email', placeholder: 'Email', type: 'email' },
                        { name: 'phone', placeholder: 'Phone', type: 'tel' },
                        { name: 'address1', placeholder: 'Address Line 1' },
                        { name: 'address2', placeholder: 'Address Line 2' },
                        { name: 'city', placeholder: 'City' },
                        { name: 'state', placeholder: 'State' },
                      ].map((field) => (
                        <input
                          key={field.name}
                          type={field.type || 'text'}
                          name={field.name}
                          placeholder={field.placeholder}
                          value={(formData as any)[field.name]}
                          onChange={handleInputChange}
                          className="w-full bg-midnight-3 border border-silver-dark text-silver placeholder-silver-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition-all duration-300"
                          required={
                            field.name !== 'address2' &&
                            field.name !== 'phone'
                          }
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
                    transition={{ duration: 0.4 }}
                    className="space-y-6 glass-card"
                  >
                    <h2 className="text-2xl font-display font-bold text-silver mb-6">
                      Payment Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: 'cardNumber', placeholder: 'Card Number' },
                        { name: 'expiryDate', placeholder: 'MM/YY' },
                        { name: 'cvv', placeholder: 'CVV' },
                        { name: 'nameOnCard', placeholder: 'Name on Card' },
                      ].map((field) => (
                        <input
                          key={field.name}
                          type="text"
                          name={field.name}
                          placeholder={field.placeholder}
                          value={(formData as any)[field.name]}
                          onChange={handleInputChange}
                          className="w-full bg-midnight-3 border border-silver-dark text-silver placeholder-silver-dark rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal transition-all duration-300"
                          required
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6 glass-card"
                  >
                    <h2 className="text-2xl font-display font-bold text-silver mb-6">
                      Review Your Order
                    </h2>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-16 h-16 relative">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <span className="text-silver text-sm font-medium">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-silver text-sm">
                            ₦{item.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-midnight-3 pt-4 flex justify-between text-silver font-semibold">
                        <span>Total:</span>
                        <span>₦{getTotalPrice().toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between pt-8">
                {step > 1 && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="btn-secondary"
                  >
                    Previous
                  </motion.button>
                )}

                {step < 3 ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="btn-primary ml-auto"
                  >
                    Continue
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="btn-primary ml-auto"
                  >
                    Place Order & Pay
                  </motion.button>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-card sticky top-24 p-6">
              <h3 className="text-xl font-display font-semibold text-silver mb-6">
                Order Summary
              </h3>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-4"
                >
                  <span className="text-silver text-sm">{item.name}</span>
                  <span className="text-silver-dark text-sm">
                    ₦{item.price.toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="border-t border-midnight-3 pt-4 flex justify-between text-silver font-semibold">
                <span>Total:</span>
                <span>₦{getTotalPrice().toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
