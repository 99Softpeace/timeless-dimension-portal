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
                    We exist at the intersection of refined style and Nigerian ambition. A store for people who understand that every detail speaks.
                </motion.p>
            </section>

            {/* 2. Split Section: Curated Quality */}
            <section className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[600px] lg:h-auto bg-slate-100">
                    <Image
                        src="/assets/images/bento-mechanical.png"
                        alt="Senator product detail"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="flex items-center justify-center p-12 lg:p-24 bg-slate-50">
                    <div className="max-w-md">
                        <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 block">
                            [01] THE CURATION
                        </span>
                        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">
                            Curated Eye.
                        </h2>
                        <p className="text-lg text-slate-600 font-light leading-relaxed">
                            Every Senator item is chosen for quality, presence, and everyday usefulness. From bags and clothes to belts, frames, watches, and jewelry, we select pieces that sharpen the full look.
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
                            We do not just stock products; we interpret style for real movement. Our catalog is built for Lagos pace, business days, weekend events, and moments that deserve presence.
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
                        "Style is the quiet detail <br /> that announces arrival."
                    </h2>
                    <p className="text-slate-400 text-lg mb-12">
                        And every detail can be chosen beautifully.
                    </p>
                    <div className="border border-white/20 inline-block px-12 py-4 rounded-full text-sm font-mono tracking-widest uppercase">
                        SENATOR ACCESSORIES ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â EST. 2026
                    </div>
                </div>
            </section>
        </div>
    )
}
