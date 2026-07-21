'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
]

type AdminSidebarProps = {
    className?: string
    onNavigate?: () => void
}

export default function AdminSidebar({ className, onNavigate }: AdminSidebarProps) {
    const pathname = usePathname()
    const { logout } = useAuth()

    return (
        <div className={cn('flex h-full min-h-screen flex-col w-64 bg-[#0B1020] border-r border-white/10 shadow-2xl', className)}>
            <div className="flex items-center justify-center h-16 border-b border-white/10">
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
                                onClick={onNavigate}
                                className={cn(
                                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                                    isActive
                                        ? 'bg-teal/10 text-teal'
                                        : 'text-slate-200 hover:bg-white/10 hover:text-white'
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        'mr-3 flex-shrink-0 h-6 w-6',
                                        isActive ? 'text-teal' : 'text-slate-300 group-hover:text-white'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="border-t border-white/10 p-4">
                <button
                    onClick={() => {
                        onNavigate?.()
                        logout()
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100 transition-colors hover:bg-red-500/20 hover:text-white"
                >
                    <LogOut className="h-5 w-5" />
                    Log Out
                </button>
            </div>
        </div>
    )
}
