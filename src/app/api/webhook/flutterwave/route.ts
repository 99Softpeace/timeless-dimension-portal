import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Order from '@/src/models/Order';

export async function POST(request: NextRequest) {
  try {
    // Verify Flutterwave request
    const verifHash = request.headers.get('verif-hash');
    const secretHash = process.env.FLW_SECRET_HASH;

    if (!verifHash || verifHash !== secretHash) {
      console.warn('Invalid Flutterwave verification hash');
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse the webhook payload
    const payload = await request.json();

    console.log('Flutterwave webhook received:', {
      event: payload.event,
      status: payload.data?.status,
      flwRef: payload.data?.flw_ref,
    });

    // Handle charge.completed events
    if (payload.event === 'charge.completed' && payload.data?.status === 'successful') {
      const { flw_ref, tx_ref, amount, currency, customer } = payload.data;

      // Connect to database
      await connectToDatabase();

      // Check if order already exists (prevent duplicates)
      const existingOrder = await Order.findOne({ flwRef: flw_ref });

      if (existingOrder) {
        console.log(`Order with flwRef ${flw_ref} already exists. Skipping duplicate.`);
        return new NextResponse(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Create new order
      const newOrder = new Order({
        flwRef: flw_ref,
        txRef: tx_ref,
        amount,
        currency,
        customerEmail: customer?.email,
        customerName: customer?.name,
        status: 'pending',
        paymentStatus: 'paid',
        paymentMethod: 'flutterwave',
        paymentReference: flw_ref,
      });

      await newOrder.save();
      console.log(`Order saved successfully with flwRef: ${flw_ref}`);

      return new NextResponse(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // For other events or statuses, still return 200 to acknowledge receipt
    console.log(`Webhook event ${payload.event} processed but not handled`);
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Flutterwave webhook error:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
