'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">

            {/* 1. Minimalist Text Hero */}
            <section className="pt-32 pb-24 px-6 max-w-4xl mx-auto text-center">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-6 block"
                >
                    OUR STORY
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8 leading-tight"
                >
                    The Senator <br /> Standard.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl md:text-2xl text-slate-600 font-light leading-relaxed"
                >
                    We exist at the intersection of Swiss precision and Nigerian ambition. A tribute to those who build the future.
                </motion.p>
            </section>

            {/* 2. Split Section: Swiss Precision */}
            <section className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[600px] lg:h-auto bg-slate-100">
                    <Image
                        src="/assets/images/bento-mechanical.png"
                        alt="Swiss Movement Detail"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex items-center justify-center p-12 lg:p-24 bg-slate-50">
                    <div className="max-w-md">
                        <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 block">
                            [01] THE ENGINE
                        </span>
                        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">
                            Swiss Heart.
                        </h2>
                        <p className="text-lg text-slate-600 font-light leading-relaxed">
                            Every Senator timepiece pulses with a Swiss mechanical movement. We refuse to compromise on the engine that drives your day. 42-hour power reserve, self-winding capability, and flawless accuracy.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Split Section: Nigerian Soul (Reversed) */}
            <section className="grid grid-cols-1 lg:grid-cols-2 lg:flex-row-reverse">
                <div className="flex items-center justify-center p-12 lg:p-24 bg-white order-2 lg:order-1">
                    <div className="max-w-md">
                        <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 block">
                            [02] THE IDENTITY
                        </span>
                        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">
                            Nigerian Soul.
                        </h2>
                        <p className="text-lg text-slate-600 font-light leading-relaxed">
                            We don't just import; we interpret. Our designs are inspired by the architecture of Lagos, the history of Kano, and the resilience of Port Harcourt. A watch that feels like home.
                        </p>
                    </div>
                </div>
                <div className="relative h-[600px] lg:h-auto bg-slate-900 order-1 lg:order-2">
                    <Image
                        src="/assets/images/nigerian-pride-collection-poster.png"
                        alt="Nigerian Heritage Design"
                        fill
                        className="object-cover opacity-90"
                    />
                </div>
            </section>

            {/* 4. The Manifesto */}
            <section className="py-32 px-6 text-center bg-slate-900 text-white">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">
                        "Time is the only luxury <br /> that cannot be bought."
                    </h2>
                    <p className="text-slate-400 text-lg mb-12">
                        But it can be measured beautifully.
                    </p>
                    <div className="border border-white/20 inline-block px-12 py-4 rounded-full text-sm font-mono tracking-widest uppercase">
                        SENATOR WATCHES — EST. 2026
                    </div>
                </div>
            </section>
        </div>
    )
}
