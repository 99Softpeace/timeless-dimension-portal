import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'
// import { auth, admin } from '@/middleware/auth' // TODO: Implement auth middleware for serverless

// POST /api/products/admin - Create new product (Admin only)
export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        // TODO: Add authentication/authorization check for admin
        const body = await req.json()
        const product = new Product(body)
        await product.save()
        return NextResponse.json({
            success: true,
            data: product,
            message: 'Product created successfully'
        }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating product:', error)
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
