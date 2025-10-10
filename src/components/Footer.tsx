import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-midnight border-t border-glass-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal to-gold rounded-lg flex items-center justify-center">
                <span className="text-midnight font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-display font-bold text-gradient">
                Timeless
              </span>
            </div>
            <p className="text-silver-dark text-sm leading-relaxed">
              Fragments of forever — luxury wristwatches crafted for the Nigerian market. 
              Experience time in a new dimension with our curated collection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-silver-dark hover:text-teal transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-silver-dark hover:text-teal transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-silver-dark hover:text-teal transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-silver-dark hover:text-teal transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-silver font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-silver-dark hover:text-teal transition-colors text-sm">
                  All Watches
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-silver-dark hover:text-teal transition-colors text-sm">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-silver-dark hover:text-teal transition-colors text-sm">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/best-sellers" className="text-silver-dark hover:text-teal transition-colors text-sm">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-silver-dark hover:text-teal transition-colors text-sm">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-silver font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-silver-dark hover:text-teal transition-colors text-sm">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-silver-dark hover:text-teal transition-colors text-sm">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-silver-dark hover:text-teal transition-colors text-sm">
                  Warranty
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-silver-dark hover:text-teal transition-colors text-sm">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-silver-dark hover:text-teal transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-silver font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-teal" />
                <span className="text-silver-dark text-sm">
                  Lagos, Nigeria
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-teal" />
                <span className="text-silver-dark text-sm">
                  +234 (0) 800 000 0000
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-teal" />
                <span className="text-silver-dark text-sm">
                  hello@timeless.ng
                </span>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-silver font-medium text-sm mb-2">Stay Updated</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-midnight-3 border border-glass-border rounded-l-lg text-silver text-sm focus:outline-none focus:border-teal"
                />
                <button className="px-4 py-2 bg-teal text-midnight rounded-r-lg hover:bg-teal-dark transition-colors text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-glass-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-silver-dark text-sm">
              © 2024 Timeless Dimension Portal. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-silver-dark hover:text-teal transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-silver-dark hover:text-teal transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-silver-dark hover:text-teal transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
