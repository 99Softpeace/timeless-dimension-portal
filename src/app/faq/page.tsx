'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
    {
        question: "Do you offer nationwide delivery?",
        answer: "Yes, we deliver bags, clothes, belts, eyeglasses, watches, and accessories to all states within Nigeria. Delivery times vary by location but typically take 2-5 business days."
    },
    {
        question: "Are your products authentic?",
        answer: "Absolutely. We only list products selected by Senator Accessories, and each item is checked before it is offered for sale."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 7-day return policy for eligible items in their original, unused condition. Please visit our Returns page for full details."
    },
    {
        question: "How do I track my order?",
        answer: "Once your order is shipped, you will receive a tracking number via email and SMS. You can also view your order status from your account."
    },
    {
        question: "Do you offer warranty or after-sales support?",
        answer: "Yes. Warranty and support depend on the product type and brand. Product-specific warranty details can be confirmed before purchase."
    },
    {
        question: "Can I request help choosing an item?",
        answer: "Yes. Contact our concierge team for help choosing bags, outfits, belts, frames, watches, and accessories for your occasion."
    }
]

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-silver-dark text-lg">
                        Find answers to common questions about our products, delivery, and support.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="glass rounded-xl overflow-hidden border border-glass-border"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-midnight-3 transition-colors"
                            >
                                <span className="font-semibold text-silver">{faq.question}</span>
                                {openIndex === index ? (
                                    <Minus className="text-teal" size={20} />
                                ) : (
                                    <Plus className="text-teal" size={20} />
                                )}
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-silver-dark leading-relaxed border-t border-glass-border/50 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
