import { RotateCcw, ShieldCheck, HelpCircle } from 'lucide-react'

export default function ReturnsPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient">
                        Returns & Exchanges
                    </h1>
                    <p className="text-silver-dark text-lg">
                        Our commitment to your satisfaction.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="glass p-8 rounded-2xl space-y-6">
                        <div className="flex items-center space-x-3">
                            <RotateCcw className="text-teal" size={28} />
                            <h2 className="text-2xl font-bold text-silver">Return Policy</h2>
                        </div>
                        <div className="space-y-4 text-silver-dark leading-relaxed">
                            <p>
                                We want you to be completely happy with your purchase. If for any reason you are not satisfied, we accept returns within <span className="text-teal font-bold">7 days</span> of delivery.
                            </p>
                            <p>
                                To be eligible for a return, your item must be strictly unused and in the same condition that you received it. It must also be in the original packaging with all tags, protective stickers, and accessories intact.
                            </p>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-2xl space-y-6">
                        <div className="flex items-center space-x-3">
                            <ShieldCheck className="text-teal" size={28} />
                            <h2 className="text-2xl font-bold text-silver">Refund Process</h2>
                        </div>
                        <div className="space-y-4 text-silver-dark leading-relaxed">
                            <p>
                                Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                            </p>
                            <p>
                                If you are approved, then your refund will be processed, and a credit will automatically be applied to your original method of payment or provided as store credit, within a certain amount of days.
                            </p>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-2xl space-y-6">
                        <div className="flex items-center space-x-3">
                            <HelpCircle className="text-teal" size={28} />
                            <h2 className="text-2xl font-bold text-silver">How to Initiate a Return</h2>
                        </div>
                        <div className="space-y-4 text-silver-dark leading-relaxed">
                            <p>
                                To start a return, please contact our support team at <a href="mailto:hello@timeless.ng" className="text-teal hover:underline">hello@timeless.ng</a> with your order number and reason for return.
                            </p>
                            <p>
                                Items sent back to us without first requesting a return will not be accepted.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
