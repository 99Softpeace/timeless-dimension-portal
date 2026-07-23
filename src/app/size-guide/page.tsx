import Link from 'next/link'
import { Glasses, Ruler, Shirt, Watch } from 'lucide-react'
import InfoPage from '@/components/InfoPage'
export default function SizeGuidePage(){return <InfoPage eyebrow="Size & fit" title="Choose a fit that feels right." intro="Use measurements from an item you already own where possible, and contact us before ordering if you need help." sections={[
 {title:'Clothes',icon:Shirt,content:<p>Compare chest, waist, hip, shoulder, sleeve, and garment length measurements. Allow room for your preferred relaxed or fitted look.</p>},
 {title:'Belts',icon:Ruler,content:<p>Measure an existing belt from the buckle pin to the hole you use most, or measure your waist where the belt will sit.</p>},
 {title:'Eyeglasses',icon:Glasses,content:<p>Check the lens width, bridge width, and temple length printed inside a frame that already fits you comfortably.</p>},
 {title:'Watches',icon:Watch,content:<p>Compare the case diameter with your wrist size. Smaller cases wear subtly, while larger cases create a stronger presence.</p>}
 ]} note={<p><strong>Unsure about a size?</strong> <Link href="/contact" className="underline underline-offset-4">Contact the Senator team</Link> with the product name before placing your order.</p>}/>}
