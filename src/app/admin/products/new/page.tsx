'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadAdminMedia } from '@/lib/admin-media-upload'

const CATEGORIES = [
    'Watches',
    'Shoes',
    'Bags',
    'Clothes',
    'Belts',
    'Eyeglasses',
    'Jewelry',
    'Accessories',
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
        category: 'Accessories',
        gender: '' as '' | 'men' | 'women' | 'unisex',
        stock: '',
        images: [] as string[],
        videos: [] as string[],
        colors: '',
        isFeatured: false
    })

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        setUploading(true)

        try {
            const token = localStorage.getItem('token')
            const uploadedImages: string[] = []
            const uploadedVideos: string[] = []

            for (const file of files) {

                const result = await uploadAdminMedia(file, token)

                if (result.type === 'video') {
                    uploadedVideos.push(result.url)
                } else {
                    uploadedImages.push(result.url)
                }
            }

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedImages],
                videos: [...prev.videos, ...uploadedVideos],
            }))
        } catch (error: any) {
            console.error('Error uploading media:', error)
            alert(error?.message || 'Error uploading media')
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    const removeImage = (url: string) => {
        setFormData((prev) => ({ ...prev, images: prev.images.filter((image) => image !== url) }))
    }

    const removeVideo = (url: string) => {
        setFormData((prev) => ({ ...prev, videos: prev.videos.filter((video) => video !== url) }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = localStorage.getItem('token')
            const stockQuantity = parseInt(formData.stock, 10)

            const res = await fetch('/api/products/admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    price: parseFloat(formData.price),
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    gender: formData.gender,
                    images: formData.images,
                    videos: formData.videos,
                    colors: formData.colors.split(',').map((color) => color.trim()).filter(Boolean),
                    stockQuantity,
                    inStock: stockQuantity > 0,
                    isFeatured: formData.isFeatured
                })
            })

            const data = await res.json()

            if (data.success) {
                router.push('/admin/products')
            } else {
                alert('Failed to create product: ' + (data.error || data.message))
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
                {/* Media Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-silver">Product Images & Videos</label>
                    <div className="space-y-4">
                        {(formData.images.length > 0 || formData.videos.length > 0) && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {formData.images.map((image) => (
                                    <div key={image} className="relative h-32 rounded-lg overflow-hidden border border-glass-border group">
                                        <img src={image} alt="Product preview" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(image)}
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Remove image"
                                        >
                                            <X className="text-white" />
                                        </button>
                                    </div>
                                ))}

                                {formData.videos.map((video) => (
                                    <div key={video} className="relative h-32 rounded-lg overflow-hidden border border-glass-border group bg-black">
                                        <video src={video} className="h-full w-full object-cover" muted playsInline />
                                        <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] uppercase tracking-wide text-white">
                                            Video
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeVideo(video)}
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Remove video"
                                        >
                                            <X className="text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-glass-border border-dashed rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                    {uploading ? (
                                        <Loader2 className="h-8 w-8 text-silver animate-spin" />
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 text-silver mb-2" />
                                            <p className="text-sm text-silver">Click to upload multiple images or videos</p>
                                            <p className="text-xs text-silver/70 mt-1">Images up to 5MB, videos up to 100MB</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*,video/mp4,video/webm,video/quicktime"
                                    multiple
                                    onChange={handleMediaUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
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
                            placeholder="e.g. Leather Tote Bag"
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
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-silver">Audience</label>
                        <select
                            required
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as '' | 'men' | 'women' | 'unisex' })}
                            className="w-full bg-midnight/50 border border-glass-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal transition-colors"
                        >
                            <option value="" disabled>Select audience</option>
                            <option value="unisex">Unisex / Everyone</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                        </select>
                        <p className="text-xs text-silver/60">Controls which Men or Women collection page displays this product.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-silver">Price (Naira)</label>
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
                <div className="space-y-2">
                    <label className="text-sm font-medium text-silver">Available Colors</label>
                    <input
                        type="text"
                        value={formData.colors}
                        onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                        className="w-full bg-midnight/50 border border-glass-border rounded-lg px-4 py-2 text-white placeholder-silver/50 focus:outline-none focus:border-teal transition-colors"
                        placeholder="e.g. Black, Brown, Gold, Silver"
                    />
                    <p className="text-xs text-silver/60">Separate colors with commas. Customers will select one before adding to cart.</p>
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






