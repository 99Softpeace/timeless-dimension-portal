import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'

export async function GET() {
    try {
        await dbConnect()
        const categories = await Product.aggregate([
            { $match: { $or: [{ isActive: true }, { isActive: { $exists: false } }] } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])
        return NextResponse.json({
            success: true,
            data: categories.map((cat: any) => ({
                id: cat._id,
                name: cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
                count: cat.count
            }))
        })
    } catch (error: any) {
        console.error('Error fetching categories:', error)
        return NextResponse.json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        }, { status: 500 })
    }
}
