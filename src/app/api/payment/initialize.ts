import { NextRequest, NextResponse } from 'next/server'
import Flutterwave from 'flutterwave-node-v3'
import { v4 as uuidv4 } from 'uuid'

// POST /api/payment/initialize
export async function POST(req: NextRequest) {
    try {
        const { amount, currency, email, phonenumber, name, user_id } = await req.json()
        const flw = new (Flutterwave as any)(
            process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
            process.env.FLW_SECRET_KEY
        )
        const payload = {
            tx_ref: uuidv4(),
            amount,
            currency,
            payment_options: 'card, mobilemoneyghana, ussd',
            redirect_url: `${process.env.FRONTEND_URL}/payment/callback`,
            customer: { email, phonenumber, name },
            meta: { user_id },
            customizations: {
                title: 'Timeless Dimension Portal',
                description: 'Payment for items in cart',
                logo: 'https://assets.piedpiper.com/logo.png',
            },
        }
        const response = await flw.Payment.standard(payload)
        return NextResponse.json({
            success: true,
            data: response.data,
            message: 'Payment initialized successfully',
        })
    } catch (error: any) {
        console.error('Payment initialization error:', error)
        return NextResponse.json({
            success: false,
            message: 'Payment initialization failed',
            error: error.message,
        }, { status: 500 })
    }
}
