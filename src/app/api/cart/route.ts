import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { getUserIdFromRequest } from '@/lib/auth'
import SavedCart from '@/models/SavedCart'
export async function GET(req: NextRequest) { await dbConnect(); const user = getUserIdFromRequest(req); if (!user) return NextResponse.json({success:false},{status:401}); const cart: any = await SavedCart.findOne({user}).lean(); return NextResponse.json({success:true,data:cart?.items || []}) }
export async function PUT(req: NextRequest) { await dbConnect(); const user = getUserIdFromRequest(req); if (!user) return NextResponse.json({success:false},{status:401}); const body=await req.json(); const items=Array.isArray(body.items)?body.items.slice(0,50):[]; const cart=await SavedCart.findOneAndUpdate({user},{user,items,$unset:{reminderSentAt:1}},{upsert:true,new:true}); return NextResponse.json({success:true,data:cart.items}) }
export async function DELETE(req: NextRequest) { await dbConnect(); const user=getUserIdFromRequest(req); if (!user) return NextResponse.json({success:false},{status:401}); await SavedCart.findOneAndUpdate({user},{items:[],$unset:{reminderSentAt:1}}); return NextResponse.json({success:true}) }
