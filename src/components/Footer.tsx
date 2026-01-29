'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, ArrowUpRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="bg-white text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* Top Grid: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">

          {/* Column 1: Shop */}
          <div className="space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500">[01] Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/shop" className="hover:underline decoration-1 underline-offset-4">All Watches</Link></li>
              <li><Link href="/collections" className="hover:underline decoration-1 underline-offset-4">Collections</Link></li>
              <li><Link href="/new-arrivals" className="hover:underline decoration-1 underline-offset-4">New Arrivals</Link></li>
              <li><Link href="/accessories" className="hover:underline decoration-1 underline-offset-4">Accessories</Link></li>
            </ul>
          </div>

          {/* Column 2: Support */}
          <div className="space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500">[02] Support</h4>
            <ul className="space-y-4">
              <li><Link href="/shipping" className="hover:underline decoration-1 underline-offset-4">Shipping</Link></li>
              <li><Link href="/returns" className="hover:underline decoration-1 underline-offset-4">Returns</Link></li>
              <li><Link href="/warranty" className="hover:underline decoration-1 underline-offset-4">Warranty (10 Years)</Link></li>
              <li><Link href="/faq" className="hover:underline decoration-1 underline-offset-4">FAQs</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500">[03] Senator</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="hover:underline decoration-1 underline-offset-4">Our Story</Link></li>
              <li><Link href="/careers" className="hover:underline decoration-1 underline-offset-4">Careers</Link></li>
              <li><Link href="/press" className="hover:underline decoration-1 underline-offset-4">Press</Link></li>
              <li><Link href="/contact" className="hover:underline decoration-1 underline-offset-4">Contact</Link></li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div className="space-y-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500">[04] Social</h4>
            <ul className="space-y-4">
              <li><a href="#" className="flex items-center gap-1 hover:text-teal-600 transition-colors">Instagram <ArrowUpRight size={14} /></a></li>
              <li><a href="#" className="flex items-center gap-1 hover:text-teal-600 transition-colors">Twitter <ArrowUpRight size={14} /></a></li>
              <li><a href="#" className="flex items-center gap-1 hover:text-teal-600 transition-colors">LinkedIn <ArrowUpRight size={14} /></a></li>
            </ul>
          </div>
        </div>

        {/* Big Signature */}
        <div className="border-t border-slate-200 pt-12 pb-4">
          <h1 className="text-[12vw] leading-[0.8] font-serif font-bold text-slate-900 tracking-tighter text-center md:text-left select-none">
            SENATOR
          </h1>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs font-mono text-slate-500 pt-8 border-t border-slate-200">
          <div>
            © 2026 SENATOR WATCHES. LAGOS, NIGERIA.
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-slate-900">PRIVACY</Link>
            <Link href="/terms" className="hover:text-slate-900">TERMS</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
