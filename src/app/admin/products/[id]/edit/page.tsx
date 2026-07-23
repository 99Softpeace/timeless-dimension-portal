'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, Upload, X } from 'lucide-react'
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
type ProductFormData = {
    name: string
    description: string
    price: string
    category: string
    gender: 'men' | 'women' | 'unisex'
    stock: string
    images: string[]
    videos: string[]
    colors: string
    isFeatured: boolean
    isNew: boolean
    isBestSeller: boolean
    discount: string
    scheduledDiscount: string
    saleStartsAt: string
    saleEndsAt: string
}

export default function EditProductPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        price: '',
        category: 'Accessories',
        gender: 'unisex',
        stock: '',
        images: [],
        videos: [],
        colors: '',
        isFeatured: false,
        isNew: false,
        isBestSeller: false,
        discount: '',
        scheduledDiscount: '',
        saleStartsAt: '',
        saleEndsAt: '',
    })

    useEffect(() => {
        let isCancelled = false

        async function fetchProduct() {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch(`/api/products/admin?id=${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: 'no-store',
                })
                const result = await res.json()

                if (!res.ok || !result.success) {
                    throw new Error(result.message || 'Unable to load product.')
                }

                const product = result.data
                if (!isCancelled) {
                    setFormData({
                        name: product.name || '',
                        description: product.description || '',
                        price: String(product.price ?? ''),
                        category: product.category || 'Accessories',
                        gender: ['men', 'women', 'unisex'].includes(product.gender) ? product.gender : 'unisex',
                        stock: String(product.stockQuantity ?? 0),
                        images: Array.isArray(product.images) ? product.images : [],
                        videos: Array.isArray(product.videos) ? product.videos : [],
                        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
                        isFeatured: Boolean(product.isFeatured),
                        isNew: Boolean(product.isNew),
                        isBestSeller: Boolean(product.isBestSeller),
                        discount: String(product.discount ?? ''),
                        scheduledDiscount: String(product.scheduledDiscount ?? ''),
                        saleStartsAt: product.saleStartsAt ? new Date(product.saleStartsAt).toISOString().slice(0, 16) : '',
                        saleEndsAt: product.saleEndsAt ? new Date(product.saleEndsAt).toISOString().slice(0, 16) : '',
                    })
                }
            } catch (error: any) {
                alert(error?.message || 'Unable to load product.')
                router.push('/admin/products')
            } finally {
                if (!isCancelled) setLoading(false)
            }
        }

        if (params.id) fetchProduct()
        return () => {
            isCancelled = true
        }
    }, [params.id, router])

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
        setSaving(true)

        try {
            const token = localStorage.getItem('token')
            const stockQuantity = parseInt(formData.stock, 10)

            const res = await fetch('/api/products/admin', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id: params.id,
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
                    isFeatured: formData.isFeatured,
                    isNew: formData.isNew,
                    isBestSeller: formData.isBestSeller,
                    discount: formData.discount,
                    scheduledDiscount: formData.scheduledDiscount,
                    saleStartsAt: formData.saleStartsAt,
                    saleEndsAt: formData.saleEndsAt,
                }),
            })

            const result = await res.json()
            if (!res.ok || !result.success) {
                throw new Error(result.error || result.message || 'Failed to update product.')
            }

            router.push('/admin/products')
        } catch (error: any) {
            alert(error?.message || 'Error updating product')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto">
                <p className="text-silver">Loading product...</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-gradient">Edit Product</h1>
                <p className="text-silver mt-2">Update product details, images, and videos.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-glass p-8 rounded-2xl border border-glass-border">
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

                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-glass-border border-dashed rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                {uploading ? (
                                    <Loader2 className="h-8 w-8 text-silver animate-spin" />
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-silver mb-2" />
                                        <p className="text-sm text-silver">Upload more images or videos</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-silver">Product Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-midnight/50 border border-glass-border rounded-lg px-4 py-2 text-white placeholder-silver/50 focus:outline-none focus:border-teal transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-silver">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-midnight/50 border border-glass-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal transition-colors"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-silver">Audience</label>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'men' | 'women' | 'unisex' })}
                            className="w-full bg-midnight/50 border border-glass-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal transition-colors"
                        >
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


                <div className="space-y-3 rounded-xl border border-glass-border bg-midnight/30 p-4">
                    <div><h3 className="font-semibold text-silver">Discount pricing</h3><p className="text-xs text-silver/60">Apply a discount immediately or schedule one for later.</p></div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="text-xs text-silver">Current discount %<input type="number" min="0" max="100" value={formData.discount} onChange={(e) => setFormData({...formData, discount:e.target.value})} className="mt-1 w-full rounded-lg border border-glass-border bg-midnight/60 px-3 py-2 text-white" /></label>
                        <div className="rounded-lg border border-glass-border bg-midnight/50 p-3 text-sm text-silver"><span className="block text-xs text-silver/60">Price preview</span>{formData.discount && Number(formData.discount) > 0 ? <><span className="mr-2 line-through">₦{Number(formData.price || 0).toLocaleString()}</span><strong className="text-teal">₦{Math.round(Number(formData.price || 0) * (1 - Number(formData.discount) / 100)).toLocaleString()}</strong></> : <strong>₦{Number(formData.price || 0).toLocaleString()}</strong>}</div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <label className="text-xs text-silver">Discount %<input type="number" min="0" max="100" value={formData.scheduledDiscount} onChange={(e) => setFormData({...formData, scheduledDiscount:e.target.value})} className="mt-1 w-full rounded-lg border border-glass-border bg-midnight/60 px-3 py-2 text-white" /></label>
                        <label className="text-xs text-silver">Starts<input type="datetime-local" value={formData.saleStartsAt} onChange={(e) => setFormData({...formData, saleStartsAt:e.target.value})} className="mt-1 w-full rounded-lg border border-glass-border bg-midnight/60 px-3 py-2 text-white" /></label>
                        <label className="text-xs text-silver">Ends<input type="datetime-local" value={formData.saleEndsAt} onChange={(e) => setFormData({...formData, saleEndsAt:e.target.value})} className="mt-1 w-full rounded-lg border border-glass-border bg-midnight/60 px-3 py-2 text-white" /></label>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        ['isFeatured', 'Featured Product'],
                        ['isNew', 'New Arrival'],
                        ['isBestSeller', 'Best Seller'],
                    ].map(([key, label]) => (
                        <label key={key} className="flex items-center space-x-2 text-sm font-medium text-silver">
                            <input
                                type="checkbox"
                                checked={Boolean((formData as any)[key])}
                                onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                                className="rounded border-glass-border bg-midnight/50 text-teal focus:ring-teal"
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>

                <div className="pt-4 flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/products')}
                        className="px-6 py-2 text-silver hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving || uploading}
                        className="px-6 py-2 bg-gradient-to-r from-teal to-blue-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-teal/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}
