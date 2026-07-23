import Link from 'next/link'
import { BadgeCheck, CircleDollarSign, RotateCcw, Send } from 'lucide-react'
import InfoPage from '@/components/InfoPage'
export default function ReturnsPage(){return <InfoPage eyebrow="Returns & exchanges" title="A fair and simple return process." intro="If an eligible item is not right for you, contact us within seven days of delivery and we will guide you through the next steps." sections={[
 {title:'Seven-day window',icon:RotateCcw,content:<p>Request a return within <strong className="text-slate-900">7 days of delivery</strong>. Items must be unused, unworn, and returned with their original packaging, tags, protective stickers, and accessories.</p>},
 {title:'Eligibility check',icon:BadgeCheck,content:<p>Every return is inspected. Items showing wear, damage, stains, alterations, missing packaging, or removed protective materials may not qualify.</p>},
 {title:'Refunds',icon:CircleDollarSign,content:<p>Approved refunds are returned to the original payment method where possible, or issued as store credit. Processing time depends on the payment provider.</p>},
 {title:'Start a return',icon:Send,content:<div className="space-y-3"><p>Send your order number, the item name, and the reason for your request before returning anything.</p><Link href="/contact" className="inline-flex rounded-full bg-slate-950 px-5 py-2.5 font-semibold text-white hover:bg-teal-700">Contact support</Link></div>}
 ]} note={<p>Items sent without an approved return request may not be accepted. Delivery charges associated with a return will be explained during approval.</p>}/>}
