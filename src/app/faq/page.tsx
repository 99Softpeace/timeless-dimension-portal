'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
    {
        question: "Do you offer nationwide delivery?",
        answer: "Yes, we deliver to all states within Nigeria. Delivery times vary by location but typically take 2-5 business days."
    },
    {
        question: "Are your watches authentic?",
        answer: "Absolutely. We guarantee 100% authenticity on all our timepieces. Each watch comes with its original warranty and documentation."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 7-day return policy for items in their original, unworn condition. Please visit our Returns & Exchanges page for full details."
    },
    {
        question: "How do I track my order?",
        answer: "Once your order is shipped, you will receive a tracking number via email and SMS. You can use this to track your package on our website."
    },
    {
        question: "Do you offer warranty on watches?",
        answer: "Yes, all our watches come with a manufacturer's warranty. The duration and coverage depend on the specific brand and model."
    },
    {
        question: "Can I pick up my order in person?",
        answer: "Currently, we operate primarily online. However, we may offer pickup options for specific high-value items upon request."
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
                        Find answers to common questions about our services and products.
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
