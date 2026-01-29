import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-midnight text-white overflow-hidden">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto p-8 bg-gradient-radial from-midnight to-space-black">
                {children}
            </main>
        </div>
    )
}
