export default function Loading() {
    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="h-10 w-48 bg-midnight-3 rounded-lg animate-pulse mb-4"></div>
            <div className="h-6 w-64 bg-midnight-3 rounded-lg animate-pulse mb-8"></div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Skeleton */}
                <div className="hidden lg:block w-64 space-y-6">
                    <div className="h-40 bg-midnight-3 rounded-lg animate-pulse"></div>
                    <div className="h-40 bg-midnight-3 rounded-lg animate-pulse"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="flex-1">
                    <div className="flex justify-between mb-6">
                        <div className="h-10 w-32 bg-midnight-3 rounded-lg animate-pulse"></div>
                        <div className="h-10 w-32 bg-midnight-3 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-square bg-midnight-3 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
