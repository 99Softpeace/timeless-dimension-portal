import { Cookie, Settings, ShieldCheck, ToggleLeft } from 'lucide-react'
import InfoPage from '@/components/InfoPage'
export default function CookiesPage(){return <InfoPage eyebrow="Cookie policy" title="Small files, useful functions." intro="Cookies and browser storage help the store remember essential information and provide a smoother shopping experience." sections={[
 {title:'What cookies are',icon:Cookie,content:<p>Cookies are small pieces of data stored by your browser. Similar browser storage may also be used to remember your session, preferences, and cart.</p>},
 {title:'Essential functions',icon:ShieldCheck,content:<p>Essential storage supports sign-in, security, checkout, and cart recovery. Disabling it may prevent important parts of the store from working correctly.</p>},
 {title:'Performance',icon:Settings,content:<p>Where enabled, performance information helps us understand page reliability and improve navigation without selling your personal information.</p>},
 {title:'Your controls',icon:ToggleLeft,content:<p>You can remove or block cookies in your browser settings. Your browser’s privacy controls explain how to manage stored website data.</p>}
 ]} note={<p>Continuing to use essential store features requires the browser storage necessary for those features to function.</p>}/>}
