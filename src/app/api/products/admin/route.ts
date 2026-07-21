import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'
import { requireAdmin } from '@/lib/auth'
import { clearStoreProductsCache } from '@/lib/product-data'

function toSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

async function buildUniqueSlug(name: string) {
    const baseSlug = toSlug(name)
    if (!baseSlug) return ''

    let slug = baseSlug
    let suffix = 1

    while (await Product.exists({ slug })) {
        slug = `${baseSlug}-${suffix}`
        suffix += 1
    }

    return slug
}

function normalizeMediaList(value: unknown) {
    return Array.isArray(value)
        ? value.map((item) => String(item || '').trim()).filter(Boolean)
        : []
}

function normalizeProductPayload(body: any) {
    const name = String(body?.name || '').trim()
    const description = String(body?.description || '').trim()
    const category = String(body?.category || '').trim()
    const price = Number(body?.price)
    const stockQuantity = Number(body?.stockQuantity ?? body?.stock ?? 0)

    return {
        name,
        description,
        category,
        price,
        stockQuantity: Number.isNaN(stockQuantity) ? 0 : stockQuantity,
        images: normalizeMediaList(body?.images),
        videos: normalizeMediaList(body?.videos),
        isFeatured: Boolean(body?.isFeatured),
        isNew: Boolean(body?.isNew),
        isBestSeller: Boolean(body?.isBestSeller),
        discount: body?.discount === undefined || body?.discount === '' ? undefined : Number(body.discount),
    }
}

// GET /api/products/admin?id=... - Get product details (Admin only)
export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const adminCheck = await requireAdmin(req)
        if (!adminCheck.ok) return adminCheck.response

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (id) {
            const product = await Product.findById(id)
            if (!product) {
                return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 })
            }
            return NextResponse.json({ success: true, data: product })
        }

        const products = await Product.find({}).sort({ createdAt: -1 }).limit(200)
        return NextResponse.json({ success: true, data: products })
    } catch (error: any) {
        console.error('Error fetching admin product:', error)
        return NextResponse.json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        }, { status: 500 })
    }
}

// POST /api/products/admin - Create new product (Admin only)
export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const adminCheck = await requireAdmin(req)
        if (!adminCheck.ok) return adminCheck.response

        const body = await req.json()

        const {
            name,
            description,
            category,
            price,
            stockQuantity,
            images,
            videos,
            isFeatured,
            isNew,
            isBestSeller,
            discount,
        } = normalizeProductPayload(body)

        if (!name || !description || !category || Number.isNaN(price)) {
            return NextResponse.json({
                success: false,
                message: 'Missing required product fields',
                error: 'name, description, category, and valid price are required'
            }, { status: 400 })
        }

        const slug = await buildUniqueSlug(name)
        if (!slug) {
            return NextResponse.json({
                success: false,
                message: 'Invalid product name',
                error: 'Could not generate slug from the product name'
            }, { status: 400 })
        }

        const product = new Product({
            name,
            description,
            category,
            price,
            slug,
            images,
            videos,
            stockQuantity,
            inStock: stockQuantity > 0,
            isFeatured,
            isNew,
            isBestSeller,
            ...(discount !== undefined && !Number.isNaN(discount) ? { discount } : {}),
            isActive: true
        })

        await product.save()
        clearStoreProductsCache()
        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product created successfully'
        }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating product:', error)

        const isDuplicateError = error?.code === 11000
        if (isDuplicateError) {
            return NextResponse.json({
                success: false,
                message: 'Duplicate product value',
                error: 'A product with this slug already exists. Try a different product name.'
            }, { status: 409 })
        }

        return NextResponse.json({
            success: false,
            message: 'Error creating product',
            error: error.message
        }, { status: 400 })
    }
}

// PUT /api/products/admin - Update product (Admin only)
export async function PUT(req: NextRequest) {
    try {
        await dbConnect()
        const adminCheck = await requireAdmin(req)
        if (!adminCheck.ok) return adminCheck.response

        const body = await req.json()
        const id = String(body?.id || '').trim()
        const {
            name,
            description,
            category,
            price,
            stockQuantity,
            images,
            videos,
            isFeatured,
            isNew,
            isBestSeller,
            discount,
        } = normalizeProductPayload(body)

        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Product id is required'
            }, { status: 400 })
        }

        if (!name || !description || !category || Number.isNaN(price)) {
            return NextResponse.json({
                success: false,
                message: 'Missing required product fields',
                error: 'name, description, category, and valid price are required'
            }, { status: 400 })
        }

        const existing = await Product.findById(id)
        if (!existing) {
            return NextResponse.json({
                success: false,
                message: 'Product not found'
            }, { status: 404 })
        }

        const nextSlug = existing.name !== name ? await buildUniqueSlug(name) : existing.slug
        const product = await Product.findByIdAndUpdate(id, {
            name,
            description,
            category,
            price,
            slug: nextSlug,
            images,
            videos,
            stockQuantity,
            inStock: stockQuantity > 0,
            isFeatured,
            isNew,
            isBestSeller,
            discount: discount !== undefined && !Number.isNaN(discount) ? discount : undefined,
        }, { new: true, runValidators: true })
        if (!product) {
            return NextResponse.json({
                success: false,
                message: 'Product not found'
            }, { status: 404 })
        }
        clearStoreProductsCache()
        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product updated successfully'
        })
    } catch (error: any) {
        console.error('Error updating product:', error)
        return NextResponse.json({
            success: false,
            message: 'Error updating product',
            error: error.message
        }, { status: 400 })
    }
}

// DELETE /api/products/admin - Delete product (Admin only)
export async function DELETE(req: NextRequest) {
    try {
        await dbConnect()
        const adminCheck = await requireAdmin(req)
        if (!adminCheck.ok) return adminCheck.response

        const { id } = await req.json()
        const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true })
        if (!product) {
            return NextResponse.json({
                success: false,
                message: 'Product not found'
            }, { status: 404 })
        }
        clearStoreProductsCache()
        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        })
    } catch (error: any) {
        console.error('Error deleting product:', error)
        return NextResponse.json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        }, { status: 500 })
    }
}
