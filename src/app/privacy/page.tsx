import { Shield, Lock, Eye } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient">
                        Privacy Policy
                    </h1>
                    <p className="text-silver-dark text-lg">
                        How we collect, use, and protect your data.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="glass p-8 rounded-2xl space-y-6">
                        <h2 className="text-2xl font-bold text-silver flex items-center gap-3">
                            <Shield className="text-teal" /> Data Collection
                        </h2>
                        <div className="space-y-4 text-silver-dark leading-relaxed">
                            <p>
                                We collect information you provide directly to us when you create an account, make a purchase, or contact us. This includes your name, email address, shipping address, and payment information.
                            </p>
                            <p>
                                We also automatically collect certain information about your device and how you interact with our website, such as your IP address, browser type, and pages visited.
                            </p>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-2xl space-y-6">
                        <h2 className="text-2xl font-bold text-silver flex items-center gap-3">
                            <Lock className="text-teal" /> Data Security
                        </h2>
                        <div className="space-y-4 text-silver-dark leading-relaxed">
                            <p>
                                We implement industry-standard security measures to protect your personal information. Your payment data is encrypted and processed securely by our payment partners. We do not store your full credit card details on our servers.
                            </p>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-2xl space-y-6">
                        <h2 className="text-2xl font-bold text-silver flex items-center gap-3">
                            <Eye className="text-teal" /> Third-Party Sharing
                        </h2>
                        <div className="space-y-4 text-silver-dark leading-relaxed">
                            <p>
                                We do not sell your personal information. We may share your data with trusted third-party service providers who help us operate our business, such as shipping companies and payment processors. These providers are obligated to protect your data and only use it for the services they provide to us.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
