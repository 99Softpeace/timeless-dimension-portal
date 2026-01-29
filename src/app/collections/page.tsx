'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { allProducts } from '@/lib/products'
import { ArrowRight } from 'lucide-react'

const collections = [
    {
        id: 'heritage',
        name: 'The Heritage Series',
        subtitle: 'Timeless Nigerian craftsmanship.',
        description: 'A tribute to the roots that ground us. The Heritage Series combines traditional Nigerian motifs with the exacting standards of Swiss horology.',
        image: '/assets/images/heritage-collection-poster.png',
        theme: 'light'
    },
    {
        id: 'modern',
        name: 'Modern Architecture',
        subtitle: 'Designed for the new age.',
        description: 'Clean lines, minimalist dials, and robust materials. For the visionary building the future of Lagos and beyond.',
        image: '/assets/images/modern-collection-poster.png', // Fallback or reuse suitable image
        theme: 'dark'
    },
    {
        id: 'luxury',
        name: 'Senator Reserve',
        subtitle: 'The pinnacle of success.',
        description: 'Rare materials, diamond indices, and our most complex movements. Reserved for those who have truly arrived.',
        image: '/assets/images/luxury-collection-poster.png',
        theme: 'light'
    }
]

export default function CollectionsPage() {
    return (
        <div className="bg-white">
            {/* Intro */}
            <div className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 block"
                >
                    EST. 2026 — LAGOS
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8"
                >
                    Curated Chapters
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-slate-600 font-light leading-relaxed"
                >
                    Timepieces are not just instruments; they are stories. Explore our three distinct collections, each narrating a different dimension of the Nigerian experience.
                </motion.p>
            </div>

            {/* Vertical Chapters */}
            <div className="space-y-0">
                {collections.map((collection, index) => {
                    // Filter products for this collection
                    // (Approximation: match category to collection id roughly)
                    const collectionProducts = allProducts.filter(p => {
                        if (collection.id === 'heritage') return p.category === 'heritage' || p.category === 'classic';
                        if (collection.id === 'modern') return p.category === 'modern';
                        if (collection.id === 'luxury') return p.category === 'luxury';
                        return false;
                    }).slice(0, 4); // Limit to 4 for the editorial row

                    const isDark = collection.theme === 'dark';

                    return (
                        <section key={collection.id} className="relative group">
                            {/* Editorial Banner */}
                            <div className="relative h-[80vh] w-full overflow-hidden">
                                <Image
                                    src={collection.image}
                                    alt={collection.name}
                                    fill
                                    className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay */}

                                {/* Floating Text Content */}
                                <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                                    <div className="max-w-2xl text-white">
                                        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg">
                                            {collection.name}
                                        </h2>
                                        <p className="text-lg md:text-xl font-light mb-8 drop-shadow-md text-white/90">
                                            {collection.description}
                                        </p>
                                        <Link
                                            href={`/shop?category=${collection.id === 'heritage' ? 'heritage' : collection.id}`} // Simple mapping
                                            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-slate-100 transition-colors"
                                        >
                                            Shop Collection <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Integrated Product Row */}
                            <div className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
                                <div className="max-w-7xl mx-auto">
                                    <div className="flex justify-between items-end mb-8">
                                        <h3 className="text-2xl font-serif text-slate-900">Featured in {collection.name}</h3>
                                        <Link href="/shop" className="text-sm font-medium text-slate-500 hover:text-slate-900">View All</Link>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                        {collectionProducts.map((product, idx) => (
                                            <ProductCard key={product.id} product={product} index={idx} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )
                })}
            </div>
        </div>
    )
}