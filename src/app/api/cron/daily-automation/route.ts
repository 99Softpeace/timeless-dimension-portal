import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Product from '@/models/Product'
import Order from '@/models/Order'
import User from '@/models/User'
import SavedCart from '@/models/SavedCart'
import AdminPreference from '@/models/AdminPreference'
import { sendAbandonedCartEmail, sendLowStockEmail, sendReengagementEmail, sendReviewRequestEmail, sendStaleOrderEmail } from '@/lib/automation-email'
export const dynamic='force-dynamic'; export const maxDuration=300
function authorized(req:NextRequest){const secret=process.env.CRON_SECRET; return Boolean(secret && req.headers.get('authorization')===`Bearer ${secret}`)}
export async function GET(req:NextRequest){
 if(!authorized(req)) return NextResponse.json({success:false,message:'Unauthorized'},{status:401})
 await dbConnect(); const now=new Date(); const day=86400000; const stats:any={}
 try {
  const preferences:any=await AdminPreference.findOne({key:'global'}).lean()
  await Product.updateMany({stockQuantity:{$lte:0},inStock:{$ne:false}},{$set:{inStock:false}})
  await Product.updateMany({stockQuantity:{$gt:0},inStock:false},{$set:{inStock:true}})
  await Product.updateMany({isNew:true,createdAt:{$lte:new Date(now.getTime()-30*day)}},{$set:{isNew:false}})
  await Product.updateMany({scheduledDiscount:{$gt:0},saleStartsAt:{$lte:now},saleEndsAt:{$gt:now}},[{$set:{discount:'$scheduledDiscount'}}])
  await Product.updateMany({saleEndsAt:{$lte:now}},{$unset:{discount:1,scheduledDiscount:1,saleStartsAt:1,saleEndsAt:1}})
  const low:any[]=await Product.find({stockQuantity:{$gte:0,$lte:5},isActive:{$ne:false},lowStockAlertedAt:{$exists:false}}).select('name stockQuantity').lean()
  if(low.length && preferences?.lowStockAlerts!==false){await sendLowStockEmail(low); await Product.updateMany({_id:{$in:low.map(p=>p._id)}},{$set:{lowStockAlertedAt:now}})}
  await Product.updateMany({stockQuantity:{$gt:5},lowStockAlertedAt:{$exists:true}},{$unset:{lowStockAlertedAt:1}}); stats.lowStock=low.length
  const stale:any[]=await Order.find({status:{$in:['pending','processing']},createdAt:{$lte:new Date(now.getTime()-day)},staleOrderAlertedAt:{$exists:false}}).select('orderNumber status total').lean()
  if(stale.length){await sendStaleOrderEmail(stale); await Order.updateMany({_id:{$in:stale.map(o=>o._id)}},{$set:{staleOrderAlertedAt:now}})} stats.staleOrders=stale.length
  const reviews:any[]=await Order.find({status:'delivered',deliveredAt:{$lte:new Date(now.getTime()-7*day)},reviewRequestSentAt:{$exists:false}}).limit(50).lean(); let reviewSent=0
  for(const order of reviews){const user:any=await User.findById(order.user).select('email firstName isActive').lean(); if(user?.email&&user.isActive!==false){await sendReviewRequestEmail(user,order); reviewSent++} await Order.updateOne({_id:order._id},{$set:{reviewRequestSentAt:now}})} stats.reviewRequests=reviewSent
  const carts:any[]=await SavedCart.find({'items.0':{$exists:true},updatedAt:{$lte:new Date(now.getTime()-day)},reminderSentAt:{$exists:false}}).limit(50).lean(); let cartSent=0
  for(const cart of carts){const user:any=await User.findById(cart.user).select('email firstName isActive').lean(); if(user?.email&&user.isActive!==false){await sendAbandonedCartEmail(user,cart);cartSent++} await SavedCart.updateOne({_id:cart._id},{$set:{reminderSentAt:now}})} stats.cartReminders=cartSent
  const inactive:any[]=await User.find({role:'customer',isActive:true,$or:[{lastLogin:{$lte:new Date(now.getTime()-90*day)}},{lastLogin:{$exists:false},createdAt:{$lte:new Date(now.getTime()-90*day)}}],reengagementSentAt:{$exists:false}}).select('email firstName').limit(50).lean(); let reengaged=0
  for(const user of inactive){const recent=await Order.exists({user:user._id,createdAt:{$gt:new Date(now.getTime()-90*day)}}); if(!recent&&user.email){await sendReengagementEmail(user);reengaged++} await User.updateOne({_id:user._id},{$set:{reengagementSentAt:now}})} stats.reengagementEmails=reengaged
  return NextResponse.json({success:true,stats})
 }catch(error:any){console.error('Daily automation error:',error);return NextResponse.json({success:false,error:error.message},{status:500})}
}
