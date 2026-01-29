'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Send } from 'lucide-react'

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">

                {/* Left: Concierge Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-16"
                >
                    <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-6 block">
                            CONCIERGE SERVICE
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8 leading-none">
                            At Your Service.
                        </h1>
                        <p className="text-xl text-slate-600 font-light leading-relaxed max-w-md">
                            Our team in Lagos is available to assist with acquisitions, servicing, and private viewings.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="font-serif text-xl text-slate-900 mb-2">Lagos HQ</h3>
                            <p className="text-slate-500 font-light">
                                14 Senator Avenue,<br />
                                Victoria Island, Lagos.<br />
                                Nigeria.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-serif text-xl text-slate-900 mb-2">Direct Line</h3>
                            <p className="text-slate-500 font-light font-mono">
                                +234 (0) 800 SENATOR
                            </p>
                        </div>

                        <div>
                            <h3 className="font-serif text-xl text-slate-900 mb-2">Electronic Mail</h3>
                            <p className="text-slate-500 font-light font-mono">
                                concierge@senator.ng
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Minimalist Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-slate-50 p-8 md:p-12 rounded-[2rem]"
                >
                    <form className="space-y-12">
                        <div className="space-y-8">
                            <div className="group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full py-4 bg-transparent border-b border-slate-300 text-slate-900 text-lg focus:outline-none focus:border-slate-900 transition-colors placeholder-slate-300"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full py-4 bg-transparent border-b border-slate-300 text-slate-900 text-lg focus:outline-none focus:border-slate-900 transition-colors placeholder-slate-300"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">Inquiry</label>
                                <textarea
                                    rows={4}
                                    required
                                    className="w-full py-4 bg-transparent border-b border-slate-300 text-slate-900 text-lg focus:outline-none focus:border-slate-900 transition-colors placeholder-slate-300 resize-none"
                                    placeholder="How may we assist you?"
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-900 text-white py-5 px-8 flex items-center justify-between hover:bg-teal-700 transition-colors group"
                        >
                            <span className="font-medium tracking-wide">SEND MESSAGE</span>
                            <Send className="group-hover:translate-x-1 transition-transform" size={20} />
                        </button>
                    </form>
                </motion.div>

            </div>
        </div>
    )
}
