import { Truck, Globe, Clock, AlertCircle } from 'lucide-react'

export default function ShippingPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient">
                        Shipping Information
                    </h1>
                    <p className="text-silver-dark text-lg">
                        Details on how we get your timepiece to you safely and securely.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass p-8 rounded-2xl space-y-4">
                        <div className="flex items-center space-x-3">
                            <Truck className="text-teal" size={24} />
                            <h2 className="text-xl font-bold text-silver">Nationwide Delivery</h2>
                        </div>
                        <p className="text-silver-dark leading-relaxed">
                            We offer delivery to all 36 states in Nigeria and the FCT. Our logistics partners ensure that your package is handled with care and delivered to your doorstep.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl space-y-4">
                        <div className="flex items-center space-x-3">
                            <Clock className="text-teal" size={24} />
                            <h2 className="text-xl font-bold text-silver">Delivery Times</h2>
                        </div>
                        <ul className="text-silver-dark space-y-2">
                            <li className="flex justify-between">
                                <span>Lagos:</span>
                                <span className="text-silver font-medium">1-2 Business Days</span>
                            </li>
                            <li className="flex justify-between">
                                <span>South West:</span>
                                <span className="text-silver font-medium">2-4 Business Days</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Other Locations:</span>
                                <span className="text-silver font-medium">3-5 Business Days</span>
                            </li>
                        </ul>
                    </div>

                    <div className="glass p-8 rounded-2xl space-y-4">
                        <div className="flex items-center space-x-3">
                            <Globe className="text-teal" size={24} />
                            <h2 className="text-xl font-bold text-silver">International Shipping</h2>
                        </div>
                        <p className="text-silver-dark leading-relaxed">
                            Currently, we only ship within Nigeria. We are working on expanding our reach to serve our international customers soon.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl space-y-4">
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="text-teal" size={24} />
                            <h2 className="text-xl font-bold text-silver">Important Note</h2>
                        </div>
                        <p className="text-silver-dark leading-relaxed">
                            All orders require a signature upon delivery. Please ensure someone is available to receive the package at the shipping address provided.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
