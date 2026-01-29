export default function Loading() {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-8 h-6 w-24 bg-midnight-3 rounded animate-pulse"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                <div className="aspect-square bg-midnight-3 rounded-2xl animate-pulse"></div>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="h-12 w-3/4 bg-midnight-3 rounded animate-pulse"></div>
                        <div className="h-6 w-1/4 bg-midnight-3 rounded animate-pulse"></div>
                        <div className="h-10 w-32 bg-midnight-3 rounded animate-pulse"></div>
                    </div>
                    <div className="h-32 w-full bg-midnight-3 rounded animate-pulse"></div>
                    <div className="h-12 w-full bg-midnight-3 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}
