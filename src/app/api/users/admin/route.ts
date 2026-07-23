import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import SavedCart from '@/models/SavedCart'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try { await dbConnect(); const admin=await requireAdmin(req); if(!admin.ok)return admin.response; const users=await User.find({}).select('-password').sort({createdAt:-1}); return NextResponse.json({success:true,data:users}) }
  catch(error:any){return NextResponse.json({success:false,message:'Error fetching users',error:error.message},{status:500})}
}
export async function PUT(req: NextRequest) {
  try { await dbConnect(); const admin=await requireAdmin(req); if(!admin.ok)return admin.response; const body=await req.json(); const id=String(body.id||''); if(!id)return NextResponse.json({success:false,message:'User id is required'},{status:400}); if(String(admin.userId)===id && body.isActive===false)return NextResponse.json({success:false,message:'You cannot ban your own admin account.'},{status:400}); const allowed:any={}; if(body.role!==undefined)allowed.role=body.role;if(body.isActive!==undefined)allowed.isActive=Boolean(body.isActive); const user=await User.findByIdAndUpdate(id,allowed,{new:true,runValidators:true}).select('-password');if(!user)return NextResponse.json({success:false,message:'User not found'},{status:404});return NextResponse.json({success:true,data:user,message:user.isActive?'Account is active.':'Account has been banned.'}) }
  catch(error:any){return NextResponse.json({success:false,message:'Error updating user',error:error.message},{status:400})}
}
export async function DELETE(req: NextRequest) {
  try { await dbConnect(); const admin=await requireAdmin(req); if(!admin.ok)return admin.response; const {id,permanent}=await req.json();if(String(admin.userId)===String(id))return NextResponse.json({success:false,message:'You cannot delete your own admin account.'},{status:400});if(permanent===true){const user=await User.findByIdAndDelete(id);if(!user)return NextResponse.json({success:false,message:'User not found'},{status:404});await SavedCart.deleteOne({user:id});return NextResponse.json({success:true,message:'Account permanently deleted.'})}const user=await User.findByIdAndUpdate(id,{isActive:false},{new:true}).select('-password');if(!user)return NextResponse.json({success:false,message:'User not found'},{status:404});return NextResponse.json({success:true,data:user,message:'Account banned.'}) }
  catch(error:any){return NextResponse.json({success:false,message:'Error deleting user',error:error.message},{status:500})}
}
