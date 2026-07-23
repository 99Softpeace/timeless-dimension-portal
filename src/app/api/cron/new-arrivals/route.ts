import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'
import { sendNewArrivalsDigest } from '@/lib/new-product-email'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  await dbConnect()
  const processingDeadline = new Date(Date.now() - 60 * 60 * 1000)
  const products: any[] = []

  try {
    for (let index = 0; index < 20; index += 1) {
      const product = await Product.findOneAndUpdate(
        {
          newArrivalEmailQueuedAt: { $exists: true },
          newArrivalEmailSentAt: { $exists: false },
          $or: [
            { newArrivalEmailProcessingAt: { $exists: false } },
            { newArrivalEmailProcessingAt: { $lt: processingDeadline } },
          ],
        },
        { $set: { newArrivalEmailProcessingAt: new Date() } },
        { new: true, sort: { newArrivalEmailQueuedAt: 1 } }
      ).lean()

      if (!product) break
      products.push(product)
    }

    if (products.length === 0) {
      return NextResponse.json({ success: true, message: 'No new arrivals are waiting to be announced.', products: 0 })
    }

    const delivery = await sendNewArrivalsDigest(products)
    const productIds = products.map((product) => product._id)
    await Product.updateMany(
      { _id: { $in: productIds } },
      {
        $set: { newArrivalEmailSentAt: new Date() },
        $unset: { newArrivalEmailProcessingAt: 1 },
      }
    )

    return NextResponse.json({
      success: true,
      message: `New-arrivals digest sent to ${delivery.sent} customer${delivery.sent === 1 ? '' : 's'}.`,
      products: products.length,
      delivery,
    })
  } catch (error: any) {
    if (products.length > 0) {
      await Product.updateMany(
        { _id: { $in: products.map((product) => product._id) } },
        { $unset: { newArrivalEmailProcessingAt: 1 } }
      ).catch((unlockError) => console.error('Could not release new-arrival email queue:', unlockError))
    }
    console.error('Scheduled new-arrivals email error:', error)
    return NextResponse.json({ success: false, message: 'Could not send the new-arrivals digest.', error: error.message }, { status: 500 })
  }
}
