'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/1DHw3y6Ki8/?mibextid=wwXIfr',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/senatorswristwatches_fashion?igsh=d2Jqd2trYTRqYXZp&utm_source=qr',
  },
  {
    label: 'X',
    href: 'https://x.com/godwinonyema10?s=11',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@senatorgodwin10?_r=1&_t=ZS-98DStuhrK8C',
  },
]

export default function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="bg-white text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          <div className="space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500">[01] Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/watches" className="hover:underline decoration-1 underline-offset-4">Watches</Link></li>
              <li><Link href="/bags" className="hover:underline decoration-1 underline-offset-4">Bags</Link></li>
              <li><Link href="/clothes" className="hover:underline decoration-1 underline-offset-4">Clothes</Link></li>
              <li><Link href="/belts" className="hover:underline decoration-1 underline-offset-4">Belts</Link></li>
              <li><Link href="/eyeglasses" className="hover:underline decoration-1 underline-offset-4">Eyeglasses</Link></li>
              <li><Link href="/collections" className="hover:underline decoration-1 underline-offset-4">Collections</Link></li>
              <li><Link href="/new-arrivals" className="hover:underline decoration-1 underline-offset-4">New Arrivals</Link></li>
              <li><Link href="/accessories" className="hover:underline decoration-1 underline-offset-4">Accessories</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500">[02] Support</h4>
            <ul className="space-y-4">
              <li><Link href="/shipping" className="hover:underline decoration-1 underline-offset-4">Shipping</Link></li>
              <li><Link href="/returns" className="hover:underline decoration-1 underline-offset-4">Returns</Link></li>
              <li><Link href="/size-guide" className="hover:underline decoration-1 underline-offset-4">Size Guide</Link></li>
              <li><Link href="/faq" className="hover:underline decoration-1 underline-offset-4">FAQs</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500">[03] Senator</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="hover:underline decoration-1 underline-offset-4">Our Story</Link></li>
              <li><Link href="/contact" className="hover:underline decoration-1 underline-offset-4">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500">[04] Social</h4>
            <ul className="space-y-4">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-teal-600 transition-colors"
                  >
                    {social.label} <ArrowUpRight size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-12 pb-4">
          <h1 className="text-[12vw] leading-[0.8] font-serif font-bold text-slate-900 tracking-tighter text-center md:text-left select-none">
            SENATOR
          </h1>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs font-mono text-slate-500 pt-8 border-t border-slate-200">
          <div>
            &copy; 2026 SENATOR ACCESSORIES. FREE DELIVERY IN AND OUTSIDE LAGOS.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-slate-900">PRIVACY</Link>
            <Link href="/terms" className="hover:text-slate-900">TERMS</Link>
            <Link href="/cookies" className="hover:text-slate-900">COOKIES</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
