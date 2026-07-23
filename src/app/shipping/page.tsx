import { AlertCircle, Clock, CreditCard, Truck } from 'lucide-react'
import InfoPage from '@/components/InfoPage'
export default function ShippingPage(){return <InfoPage eyebrow="Delivery guide" title="From our store to your door." intro="Clear delivery expectations, careful handling, and free nationwide delivery across Nigeria." sections={[
 {title:'Nationwide delivery',icon:Truck,content:<p>We deliver to all 36 states and the FCT. Delivery is free within Lagos and to destinations outside Lagos.</p>},
 {title:'Estimated delivery times',icon:Clock,content:<ul className="space-y-3"><li className="flex justify-between gap-4 border-b border-slate-100 pb-2"><span>Lagos</span><strong className="text-slate-900">1–2 business days</strong></li><li className="flex justify-between gap-4 border-b border-slate-100 pb-2"><span>South West</span><strong className="text-slate-900">2–4 business days</strong></li><li className="flex justify-between gap-4"><span>Other locations</span><strong className="text-slate-900">3–5 business days</strong></li></ul>},
 {title:'Payment options',icon:CreditCard,content:<p>Pay securely online through Flutterwave or select pay on delivery when the option is available at checkout.</p>},
 {title:'Receiving your order',icon:AlertCircle,content:<p>Please provide an active phone number and ensure someone is available at the delivery address. Our delivery partner may call before arrival.</p>}
 ]} note={<p><strong>Need an update?</strong> Sign in and open My Orders to see the latest status, or contact our team with your order number.</p>}/>}
