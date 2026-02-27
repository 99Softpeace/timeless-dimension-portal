'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import { cn } from '@/lib/utils'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setIsSidebarOpen(false)
    }, [pathname])

    return (
        <div className="min-h-screen bg-midnight text-white">
            <div className="sticky top-0 z-30 lg:hidden border-b border-glass-border bg-midnight/95 backdrop-blur px-4 py-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold tracking-wide text-silver">Admin Panel</p>
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen((prev) => !prev)}
                        className="inline-flex items-center justify-center rounded-lg border border-glass-border p-2 text-silver hover:text-white hover:bg-white/5 transition-colors"
                        aria-label={isSidebarOpen ? 'Close admin menu' : 'Open admin menu'}
                        aria-expanded={isSidebarOpen}
                    >
                        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            <div className="flex min-h-[calc(100vh-57px)] lg:min-h-screen">
                <aside className="hidden lg:block">
                    <AdminSidebar />
                </aside>

                <div
                    className={cn(
                        'fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden',
                        isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    )}
                    onClick={() => setIsSidebarOpen(false)}
                />
                <aside
                    className={cn(
                        'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-out lg:hidden',
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    )}
                >
                    <AdminSidebar onNavigate={() => setIsSidebarOpen(false)} />
                </aside>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-radial from-midnight to-space-black">
                    {children}
                </main>
            </div>
        </div>
    )
}
