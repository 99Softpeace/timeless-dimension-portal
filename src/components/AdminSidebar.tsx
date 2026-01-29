'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const { logout } = useAuth()

    return (
        <div className="flex flex-col w-64 bg-glass border-r border-glass-border min-h-screen">
            <div className="flex items-center justify-center h-16 border-b border-glass-border">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal to-gold rounded-lg flex items-center justify-center">
                        <span className="text-midnight font-bold text-sm">A</span>
                    </div>
                    <span className="text-xl font-display font-bold text-gradient">
                        Admin
                    </span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                                    isActive
                                        ? 'bg-teal/10 text-teal'
                                        : 'text-silver hover:bg-white/5 hover:text-white'
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        'mr-3 flex-shrink-0 h-6 w-6',
                                        isActive ? 'text-teal' : 'text-silver group-hover:text-white'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="border-t border-glass-border p-4">
                <button
                    onClick={logout}
                    className="flex w-full items-center px-2 py-2 text-sm font-medium text-silver hover:bg-white/5 hover:text-white rounded-md transition-colors"
                >
                    <LogOut className="mr-3 h-6 w-6 text-silver group-hover:text-white" />
                    Logout
                </button>
            </div>
        </div>
    )
}
