import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'
import { getStoreProducts } from '@/lib/product-data'

export const dynamic = 'force-dynamic'

// GET /api/products - Get all products with filtering and pagination
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const sortBy = searchParams.get('sortBy') || 'createdAt'
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1
        const featured = searchParams.get('featured')
        const inStock = searchParams.get('inStock')

        const canUseStoreCache = !search && !minPrice && !maxPrice && !featured && !inStock && sortBy === 'createdAt' && !category

        if (canUseStoreCache) {
            const cachedProducts = await getStoreProducts()
            const pagedProducts = cachedProducts.slice((page - 1) * limit, page * limit)

            return NextResponse.json({
                success: true,
                data: pagedProducts,
                pagination: {
                    page,
                    limit,
                    total: cachedProducts.length,
                    pages: Math.ceil(cachedProducts.length / limit)
                }
            })
        }

        await dbConnect()

        let query: any = { $or: [{ isActive: true }, { isActive: { $exists: false } }] }
        if (search) query.$text = { $search: search }
        if (category && category !== 'all') query.category = category
        if (minPrice || maxPrice) {
            query.price = {}
            if (minPrice) query.price.$gte = parseInt(minPrice)
            if (maxPrice) query.price.$lte = parseInt(maxPrice)
        }
        if (featured === 'true') query.isFeatured = true
        if (inStock === 'true') query.inStock = true

        const products = await Product.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit)
        const total = await Product.countDocuments(query)

        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error: any) {
        console.error('Error fetching products:', error)
        return NextResponse.json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        }, { status: 500 })
    }
}



