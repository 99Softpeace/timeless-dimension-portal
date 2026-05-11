import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const q = searchParams.get('q')
        const category = searchParams.get('category')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const sortBy = searchParams.get('sortBy') || 'relevance'
        const limit = parseInt(searchParams.get('limit') || '20')

        if (!q) {
            return NextResponse.json({
                success: false,
                message: 'Search query is required'
            }, { status: 400 })
        }

        const options: any = {
            category,
            minPrice: minPrice ? parseInt(minPrice) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
            sortBy: sortBy === 'relevance' ? 'score' : sortBy,
            limit
        }

        const products = await (Product as any).search(q, options)

        return NextResponse.json({
            success: true,
            data: products,
            query: q
        })
    } catch (error: any) {
        console.error('Error searching products:', error)
        return NextResponse.json({
            success: false,
            message: 'Error searching products',
            error: error.message
        }, { status: 500 })
    }
}
