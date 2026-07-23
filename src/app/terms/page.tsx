import { AlertTriangle, CreditCard, FileText, PackageCheck } from 'lucide-react'
import InfoPage from '@/components/InfoPage'
export default function TermsPage(){return <InfoPage eyebrow="Terms of service" title="Clear terms for shopping with us." intro="By using Senator Accessories or placing an order, you agree to these store terms and the policies linked throughout the website." sections={[
 {title:'Using the store',icon:FileText,content:<p>Provide accurate account, payment, and delivery information. Do not misuse the website, attempt unauthorised access, or use its content for unlawful purposes.</p>},
 {title:'Orders and payment',icon:CreditCard,content:<p>An order is accepted after successful confirmation. We may contact you to verify details or cancel an order affected by incorrect pricing, unavailable stock, suspected fraud, or an invalid payment.</p>},
 {title:'Products and delivery',icon:PackageCheck,content:<p>Product colours and appearance may vary slightly across screens. Delivery estimates are provided in good faith but can be affected by location, weather, logistics, or circumstances outside our control.</p>},
 {title:'Liability',icon:AlertTriangle,content:<p>To the extent permitted by applicable law, Senator Accessories is not responsible for indirect losses arising from website interruptions or misuse of a product. Your statutory consumer rights remain unaffected.</p>}
 ]} note={<p>Store content, branding, photography, and design may not be copied or commercially reused without written permission from Senator Accessories.</p>}/>}
