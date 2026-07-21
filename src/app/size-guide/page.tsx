import { Ruler, Info } from 'lucide-react'

export default function SizeGuidePage() {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient">
                        Size & Fit Guide
                    </h1>
                    <p className="text-silver-dark text-lg">
                        Choose the right fit for clothes, belts, eyeglasses, watches, and accessories.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="glass p-8 rounded-2xl space-y-6">
                        <div className="flex items-center space-x-3">
                            <Ruler className="text-teal" size={28} />
                            <h2 className="text-2xl font-bold text-silver">Key Measurements</h2>
                        </div>
                        <p className="text-silver-dark leading-relaxed">
                            For clothes, check chest, waist, hip, and length. For belts, measure your waist or an existing belt from buckle to the hole you use most. For eyeglasses, compare lens width, bridge, and temple length with a frame you already like.
                        </p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-silver-dark">
                                <thead>
                                    <tr className="border-b border-glass-border">
                                        <th className="py-3 px-4 font-semibold text-silver">Category</th>
                                        <th className="py-3 px-4 font-semibold text-silver">What to Check</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-glass-border">
                                    <tr><td className="py-3 px-4">Clothes</td><td className="py-3 px-4">Chest, waist, hip, length</td></tr>
                                    <tr><td className="py-3 px-4">Belts</td><td className="py-3 px-4">Waist size and buckle-to-hole length</td></tr>
                                    <tr><td className="py-3 px-4">Eyeglasses</td><td className="py-3 px-4">Lens width, bridge, temple length</td></tr>
                                    <tr><td className="py-3 px-4">Watches</td><td className="py-3 px-4">Case size and wrist circumference</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-2xl space-y-6">
                        <div className="flex items-center space-x-3">
                            <Info className="text-teal" size={28} />
                            <h2 className="text-2xl font-bold text-silver">Need Help?</h2>
                        </div>
                        <p className="text-silver-dark leading-relaxed">
                            If a product has a unique sizing note, check its description or contact the Senator team before ordering. We can help confirm fit before dispatch.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
