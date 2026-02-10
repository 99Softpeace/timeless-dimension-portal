import { NextResponse } from 'next/server'

export async function POST() {
    // In a stateless JWT system, logout is handled client-side by removing the token from storage
    return NextResponse.json({
        success: true,
        message: 'Logged out successfully'
    })
}
