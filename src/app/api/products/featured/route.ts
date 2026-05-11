import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        await dbConnect()
        const products = await (Product as any).findFeatured()
        return NextResponse.json({
            success: true,
            data: products
        })
    } catch (error: any) {
        console.error('Error fetching featured products:', error)
        return NextResponse.json({
            success: false,
            message: 'Error fetching featured products',
            error: error.message
        }, { status: 500 })
    }
}
