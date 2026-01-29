import { FileText, Gavel, AlertTriangle } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient">
                        Terms of Service
                    </h1>
                    <p className="text-silver-dark text-lg">
                        The rules and regulations for using our website.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="glass p-8 rounded-2xl space-y-6">
                        <h2 className="text-2xl font-bold text-silver flex items-center gap-3">
                            <FileText className="text-teal" /> Acceptance of Terms
                        </h2>
                        <p className="text-silver-dark leading-relaxed">
                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl space-y-6">
                        <h2 className="text-2xl font-bold text-silver flex items-center gap-3">
                            <Gavel className="text-teal" /> Intellectual Property
                        </h2>
                        <p className="text-silver-dark leading-relaxed">
                            All content on this site, including text, graphics, logos, and images, is the property of Timeless Dimension Portal and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works from this content without our express written consent.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl space-y-6">
                        <h2 className="text-2xl font-bold text-silver flex items-center gap-3">
                            <AlertTriangle className="text-teal" /> Limitation of Liability
                        </h2>
                        <p className="text-silver-dark leading-relaxed">
                            In no event shall Timeless Dimension Portal be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
