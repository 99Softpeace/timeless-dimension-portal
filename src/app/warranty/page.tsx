'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function WarrantyPage() {
    return (
        <div className="bg-white min-h-screen">

            {/* 1. The Promise Hero */}
            <section className="pt-32 pb-24 px-6 max-w-3xl mx-auto text-center">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-6 block"
                >
                    THE SENATOR PROMISE
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8 leading-none"
                >
                    10 Years. <br />
                    No Questions.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-slate-600 font-light leading-relaxed"
                >
                    We build for perpetuity. Every Senator timepiece is backed by a decade-long comprehensive warranty on the movement and mechanics.
                </motion.p>
            </section>

            {/* 2. Divider */}
            <div className="w-full h-px bg-slate-100 max-w-7xl mx-auto" />

            {/* 3. Coverage Details (Editorial List) */}
            <section className="py-24 px-6 max-w-4xl mx-auto">
                <div className="space-y-16">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <h3 className="text-2xl font-serif font-bold text-slate-900">Coverage</h3>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            <p className="text-slate-600 leading-relaxed">
                                Our warranty covers all manufacturing defects in the watch movement, case integrity, and dial assembly. If the watch fails to keep time within specification, we will repair or replace it free of charge.
                            </p>
                            <ul className="space-y-3 font-mono text-sm text-slate-500">
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                                    Internal Movement Failure
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                                    Water Resistance Failure (under rated depth)
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                                    Crystal Detachment
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-100" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <h3 className="text-2xl font-serif font-bold text-slate-900">Service</h3>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            <p className="text-slate-600 leading-relaxed">
                                Should you require service, our concierge team in Lagos will handle the entire process. We offer door-to-door pickup and return for all warranty claims within Nigeria.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-2 text-slate-900 border-b border-slate-900 pb-1 hover:opacity-70 transition-opacity">
                                <span className="uppercase tracking-widest text-sm font-medium">Initiate Claim</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-100" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <h3 className="text-2xl font-serif font-bold text-slate-900 text-slate-400">Exclusions</h3>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            <p className="text-slate-500 leading-relaxed font-light">
                                While we stand by our engineering, this warranty does not cover routine wear and tear on leather straps, accidental damage to the sapphire crystal, or damage resulting from unauthorized modifications.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* 4. Footer Statement */}
            <section className="bg-slate-50 py-24 text-center px-6">
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">Built to Outlast.</h2>
                <p className="text-slate-500 mb-8 max-w-xl mx-auto">
                    A Senator watch is not just a purchase; it is an inheritance. We are here to ensure it lasts for the next generation.
                </p>
                <Link href="/shop" className="btn-primary inline-flex">
                    Shop the Collection
                </Link>
            </section>
        </div>
    )
}
