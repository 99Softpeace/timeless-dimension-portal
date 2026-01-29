'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { motion } from 'framer-motion'
import { Grid, List } from 'lucide-react'

import { allProducts } from '@/lib/products'

export default function SalePage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    // Filter for items with discount
    const products = allProducts.filter(p => p.discount)

    return (
        <motion.div
            className="pt-24 pb-16 min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-glass-border pb-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient">
                            Exclusive Sales
                        </h1>
                        <p className="text-silver-dark text-lg max-w-2xl">
                            Limited time offers on select luxury watches.
                        </p>
                    </div>

                    <div className="flex glass rounded-lg p-1 mt-4 md:mt-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded transition-colors ${viewMode === 'grid'
                                ? 'bg-teal text-midnight'
                                : 'text-silver-dark hover:text-silver'
                                }`}
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded transition-colors ${viewMode === 'list'
                                ? 'bg-teal text-midnight'
                                : 'text-silver-dark hover:text-silver'
                                }`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                <div
                    className={`grid gap-8 ${viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1'
                        }`}
                >
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <ProductCard product={product} index={index} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-silver-dark text-xl">No sale items active at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
