import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        await dbConnect()
        const { slug } = params
        const product = await Product.findOne({
            slug,
            $or: [{ isActive: true }, { isActive: { $exists: false } }]
        })
        if (!product) {
            return NextResponse.json({
                success: false,
                message: 'Product not found'
            }, { status: 404 })
        }
        // Get related products
        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
            $or: [{ isActive: true }, { isActive: { $exists: false } }]
        }).limit(4)
        return NextResponse.json({
            success: true,
            data: product,
            related: relatedProducts
        })
    } catch (error: any) {
        console.error('Error fetching product:', error)
        return NextResponse.json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        }, { status: 500 })
    }
}
