'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const CATEGORIES = [
    'Watches',
    'Jewelry',
    'Accessories',
    'Collections',
    'Limited Edition'
]

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Watches',
        stock: '',
        image: '',
        isFeatured: false
    })

    // Handle Image Upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const data = new FormData()
        data.append('image', file)

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            })

            const result = await res.json()
            if (result.success) {
                setFormData({ ...formData, image: result.url })
            } else {
                alert('Upload failed: ' + result.message)
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Error uploading image')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    countInStock: parseInt(formData.stock)
                })
            })

            const data = await res.json()

            if (data.success) {
                router.push('/admin/products')
            } else {
                alert('Failed to create product: ' + data.message)
            }
        } catch (error) {
            console.error('Error creating product:', error)
            alert('Error creating product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-gradient">Add New Product</h1>
                <p className="text-silver mt-2">Create a new product for your catalog.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-glass p-8 rounded-2xl border border-glass-border">
                {/* Image Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-silver">Product Image</label>
                    <div className="flex items-center space-x-4">
                        {formData.image ? (
                            <div className="relative h-32 w-32 rounded-lg overflow-hidden border border-glass-border group">
                                <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image: '' })}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="text-white" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-glass-border border-dashed rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {uploading ? (
                                            <Loader2 className="h-8 w-8 text-silver animate-spin" />
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-silver mb-2" />
                                                <p className="text-sm text-silver">Click to upload image</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-silver">Product Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-midnight/50 border border-glass-border rounded-lg px-4 py-2 text-white placeholder-silver/50 focus:outline-none focus:border-teal transition-colors"
                            placeholder="e.g. Chronos Elite"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-silver">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-midnight/50 border border-glass-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal transition-colors"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-silver">Price (₦)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full bg-midnight/50 border border-glass-border rounded-lg px-4 py-2 text-white placeholder-silver/50 focus:outline-none focus:border-teal transition-colors"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-silver">Stock Quantity</label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="w-full bg-midnight/50 border border-glass-border rounded-lg px-4 py-2 text-white placeholder-silver/50 focus:outline-none focus:border-teal transition-colors"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-silver">Description</label>
                    <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-midnight/50 border border-glass-border rounded-lg px-4 py-2 text-white placeholder-silver/50 focus:outline-none focus:border-teal transition-colors resize-none"
                        placeholder="Product description..."
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="featured"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="rounded border-glass-border bg-midnight/50 text-teal focus:ring-teal"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-silver">
                        Mark as Featured Product
                    </label>
                </div>

                <div className="pt-4 flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 text-silver hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-gradient-to-r from-teal to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-teal/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Product
                    </button>
                </div>
            </form>
        </div>
    )
}
