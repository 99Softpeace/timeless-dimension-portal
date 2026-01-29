'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const testimonials = [
    {
        id: 1,
        name: "Emeka O.",
        role: "Lagos",
        content: "The craftsmanship is undeniable. It feels heavy, premium, and the details on the Nigerian Pride edition are just stunning.",
        tag: "COLLECTOR"
    },
    {
        id: 2,
        name: "Sarah A.",
        role: "Abuja",
        content: "I bought the Heritage Classic for my husband's 50th. The packaging was world-class. He hasn't taken it off since.",
        tag: "GIFTING"
    },
    {
        id: 3,
        name: "Tunde B.",
        role: "Port Harcourt",
        content: "I've owned Swiss watches before, but Timeless offers something different. It feels personal. The 'Lagos Nights' model is captivating.",
        tag: "ENTHUSIAST"
    }
]

export default function Testimonials() {
    return (
        <section className="bg-white text-slate-900 py-24 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header - VanMoof Style: Mono Label + Big Type */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-2 block">
                            [01] Voices of Senator
                        </span>
                        <h2 className="text-5xl md:text-7xl font-sans font-medium tracking-tighter leading-none">
                            What they say.
                        </h2>
                    </div>
                </div>

                {/* Grid Layout with Razor Thin Borders */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-t border-slate-200 border-l border-slate-200">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group relative p-8 md:p-12 border-r border-b border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                            {/* Mono Tag */}
                            <div className="flex justify-between items-start mb-8">
                                <span className="font-mono text-[10px] uppercase border border-slate-900/10 px-2 py-1 rounded-full">
                                    {testimonial.tag}
                                </span>
                                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" size={20} />
                            </div>

                            {/* Quote */}
                            <p className="text-xl md:text-2xl font-serif leading-tight mb-12">
                                "{testimonial.content}"
                            </p>

                            {/* Author */}
                            <div className="mt-auto">
                                <h4 className="font-bold text-sm tracking-wide uppercase">{testimonial.name}</h4>
                                <p className="text-xs font-mono text-slate-500 mt-1">{testimonial.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
