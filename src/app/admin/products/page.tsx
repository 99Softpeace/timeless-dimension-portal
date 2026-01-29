'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { motion } from 'framer-motion'

interface Product {
    _id: string
    name: string
    price: number
    category: string
    inStock: boolean
    image: string
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/products?limit=100`)
            const data = await res.json()
            if (data.success) {
                setProducts(data.data)
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return

        try {
            // You'll need to send the auth token here
            const token = localStorage.getItem('token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (res.ok) {
                setProducts(products.filter(p => p._id !== id))
            }
        } catch (error) {
            console.error('Error deleting product:', error)
        }
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-display font-bold text-gradient">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="flex items-center px-4 py-2 bg-teal text-midnight font-bold rounded-lg hover:bg-teal/90 transition-colors"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Add Product
                </Link>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex items-center space-x-4 bg-glass p-4 rounded-xl border border-glass-border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-midnight/50 border border-glass-border rounded-lg pl-10 pr-4 py-2 text-white placeholder-silver focus:outline-none focus:border-teal transition-colors"
                    />
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-glass rounded-xl border border-glass-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-glass-border bg-white/5">
                                <th className="px-6 py-4 text-sm font-semibold text-teal uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-sm font-semibold text-teal uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-sm font-semibold text-teal uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-sm font-semibold text-teal uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-teal uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-glass-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-silver">Loading products...</td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-silver">No products found.</td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <motion.tr
                                        key={product._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-12 w-12 rounded-lg bg-midnight/50 overflow-hidden relative">
                                                    {/* Add Image component here if you have a valid image URL */}
                                                    <div className="w-full h-full bg-teal/20 flex items-center justify-center text-teal text-xs">IMG</div>
                                                </div>
                                                <span className="font-medium text-white">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-silver">{product.category}</td>
                                        <td className="px-6 py-4 text-white font-mono">₦{product.price.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.inStock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <button className="text-silver hover:text-teal transition-colors">
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="text-silver hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
