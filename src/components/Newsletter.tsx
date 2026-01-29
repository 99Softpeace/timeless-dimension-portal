'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

export default function Newsletter() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setTimeout(() => {
            setStatus('success')
            setEmail('')
        }, 1500)
    }

    return (
        <section className="bg-white text-slate-900 py-24 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">

                    {/* Left: Typography */}
                    <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 block">
                            [02] Newsletter
                        </span>
                        <h2 className="text-6xl md:text-8xl font-sans font-medium tracking-tighter leading-[0.9] mb-6">
                            Join the <br />
                            inner circle.
                        </h2>
                        <p className="text-lg text-slate-600 max-w-md font-light">
                            Be the first to know about limited drops, exclusive events, and private sales.
                        </p>
                    </div>

                    {/* Right: Form - VanMoof Style Underline Input */}
                    <div className="w-full">
                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl font-serif italic text-teal-600"
                            >
                                Welcome to the family.
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="relative group">
                                <div className="relative flex items-end border-b border-slate-300 focus-within:border-slate-900 transition-colors duration-300 pb-4">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-transparent text-xl md:text-2xl placeholder-slate-300 focus:outline-none font-sans"
                                    />
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="bg-slate-900 text-white w-12 h-12 flex items-center justify-center hover:bg-teal-600 transition-colors disabled:opacity-50"
                                    >
                                        {status === 'loading' ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <ArrowUpRight size={24} />
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                        <p className="mt-4 text-[10px] font-mono uppercase text-slate-400">
                            No spam. Unsubscribe anytime.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
