import { Ruler, Info } from 'lucide-react'

export default function SizeGuidePage() {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient">
                        Watch Size Guide
                    </h1>
                    <p className="text-silver-dark text-lg">
                        Find the perfect fit for your wrist.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="glass p-8 rounded-2xl space-y-6">
                        <div className="flex items-center space-x-3">
                            <Ruler className="text-teal" size={28} />
                            <h2 className="text-2xl font-bold text-silver">Case Diameter</h2>
                        </div>
                        <p className="text-silver-dark leading-relaxed">
                            The case diameter is the most significant factor in how a watch looks on your wrist. It is measured in millimeters (mm) from the outer edge of the case at 9 o'clock to the outer edge at 3 o'clock, excluding the crown.
                        </p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-silver-dark">
                                <thead>
                                    <tr className="border-b border-glass-border">
                                        <th className="py-3 px-4 font-semibold text-silver">Wrist Size (cm)</th>
                                        <th className="py-3 px-4 font-semibold text-silver">Recommended Case Size (mm)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-glass-border">
                                    <tr>
                                        <td className="py-3 px-4">15cm - 16cm (Small)</td>
                                        <td className="py-3 px-4">34mm - 38mm</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4">16cm - 17cm (Average)</td>
                                        <td className="py-3 px-4">38mm - 42mm</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4">17cm - 18cm (Average)</td>
                                        <td className="py-3 px-4">40mm - 44mm</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4">19cm+ (Large)</td>
                                        <td className="py-3 px-4">44mm - 46mm+</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-2xl space-y-6">
                        <div className="flex items-center space-x-3">
                            <Info className="text-teal" size={28} />
                            <h2 className="text-2xl font-bold text-silver">How to Measure</h2>
                        </div>
                        <div className="space-y-4 text-silver-dark leading-relaxed">
                            <p>
                                To measure your wrist size, use a flexible tape measure or a strip of paper.
                            </p>
                            <ol className="list-decimal list-inside space-y-2 pl-4">
                                <li>Wrap the tape or paper around your wrist where you typically wear a watch.</li>
                                <li>If using paper, mark the point where it overlaps and measure the length with a ruler.</li>
                                <li>Round up to the nearest centimeter for a comfortable fit.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
