import { NextRequest, NextResponse } from 'next/server'
import Flutterwave from 'flutterwave-node-v3'

// GET /api/payment/verify
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const transaction_id = searchParams.get('transaction_id')
        if (!transaction_id) {
            return NextResponse.json({
                success: false,
                message: 'Transaction ID is required',
            }, { status: 400 })
        }
        const flw = new (Flutterwave as any)(
            process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
            process.env.FLW_SECRET_KEY
        )
        const response = await flw.Transaction.verify({ id: transaction_id })
        return NextResponse.json({
            success: true,
            data: response.data,
            message: 'Payment verified successfully',
        })
    } catch (error: any) {
        console.error('Payment verification error:', error)
        return NextResponse.json({
            success: false,
            message: 'Payment verification failed',
            error: error.message,
        }, { status: 500 })
    }
}
