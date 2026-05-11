import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'
// import { auth, admin } from '@/middleware/auth' // TODO: Implement auth middleware for serverless

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

// POST /api/products/admin - Create new product (Admin only)
export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        // TODO: Add authentication/authorization check for admin
        const body = await req.json()

        const name = String(body?.name || '').trim()
        const description = String(body?.description || '').trim()
        const category = String(body?.category || '').trim()
        const price = Number(body?.price)
        const stockQuantity = Number(body?.stockQuantity ?? 0)
        const images = Array.isArray(body?.images) ? body.images.filter(Boolean) : []
        const videos = Array.isArray(body?.videos) ? body.videos.filter(Boolean) : []

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
            stockQuantity: Number.isNaN(stockQuantity) ? 0 : stockQuantity,
            inStock: (Number.isNaN(stockQuantity) ? 0 : stockQuantity) > 0,
            isFeatured: Boolean(body?.isFeatured),
            isActive: true
        })

        await product.save()
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
        // TODO: Add authentication/authorization check for admin
        const { id, ...update } = await req.json()
        const product = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true })
        if (!product) {
            return NextResponse.json({
                success: false,
                message: 'Product not found'
            }, { status: 404 })
        }
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
        // TODO: Add authentication/authorization check for admin
        const { id } = await req.json()
        const product = await Product.findByIdAndUpdate(id, { isActive: false }, { new: true })
        if (!product) {
            return NextResponse.json({
                success: false,
                message: 'Product not found'
            }, { status: 404 })
        }
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
