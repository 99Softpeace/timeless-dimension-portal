import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// POST /api/upload
export async function POST(req: NextRequest) {
    try {
        // NOTE: Vercel serverless does not support disk uploads. Use a cloud provider (e.g. Cloudinary, S3) in production.
        // This is a placeholder for file upload logic. You should use a cloud upload here.
        return NextResponse.json({
            success: false,
            message: 'File uploads must use a cloud provider (e.g. Cloudinary, S3) on Vercel.'
        }, { status: 400 })
    } catch (error: any) {
        console.error('Upload error:', error)
        return NextResponse.json({
            success: false,
            message: 'Upload failed',
            error: error.message
        }, { status: 500 })
    }
}
