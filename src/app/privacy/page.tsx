import { Eye, Lock, Shield, UserCheck } from 'lucide-react'
import InfoPage from '@/components/InfoPage'
export default function PrivacyPage(){return <InfoPage eyebrow="Privacy policy" title="Your information stays protected." intro="This policy explains what information Senator Accessories collects, why we use it, and the choices available to you." sections={[
 {title:'Information we collect',icon:Shield,content:<p>We collect details you provide when creating an account, placing an order, saving a cart, or contacting us. This may include your name, email, telephone number, delivery address, and order history.</p>},
 {title:'How we use it',icon:UserCheck,content:<p>We use your information to process orders, deliver products, provide account support, prevent fraud, send requested updates, and improve the store experience.</p>},
 {title:'Security and payments',icon:Lock,content:<p>Payments are handled by our payment partners. We do not store complete card details. Access to customer information is restricted to authorised operational use.</p>},
 {title:'Service providers',icon:Eye,content:<p>We may share only the information needed by trusted providers such as payment processors, hosting services, email services, and delivery partners. We do not sell customer information.</p>}
 ]} note={<p>You may contact us to request access to, correction of, or deletion of your account information, subject to records we must retain for completed transactions and legal obligations.</p>}/>}
