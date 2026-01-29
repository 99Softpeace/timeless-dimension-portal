import { Cookie, Settings, ShieldCheck } from 'lucide-react'

export default function CookiesPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient">
                        Cookie Policy
                    </h1>
                    <p className="text-silver-dark text-lg">
                        Understanding how we use cookies to improve your experience.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="glass p-8 rounded-2xl space-y-6">
                        <h2 className="text-2xl font-bold text-silver flex items-center gap-3">
                            <Cookie className="text-teal" /> What Are Cookies?
                        </h2>
                        <p className="text-silver-dark leading-relaxed">
                            Cookies are small text files that are stored on your device when you visit a website. They help the website function properly, remember your preferences, and track usage patterns to improve performance.
                        </p>
                    </div>

                    <div className="glass p-8 rounded-2xl space-y-6">
                        <h2 className="text-2xl font-bold text-silver flex items-center gap-3">
                            <Settings className="text-teal" /> How We Use Cookies
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-silver-dark pl-4">
                            <li>To remember your login status and shopping cart contents.</li>
                            <li>To understand how you use our website and identify areas for improvement.</li>
                            <li>To deliver personalized content and advertisements.</li>
                        </ul>
                    </div>

                    <div className="glass p-8 rounded-2xl space-y-6">
                        <h2 className="text-2xl font-bold text-silver flex items-center gap-3">
                            <ShieldCheck className="text-teal" /> Managing Cookies
                        </h2>
                        <p className="text-silver-dark leading-relaxed">
                            You can choose to disable cookies through your browser settings. However, please note that some features of our website may not function correctly if cookies are disabled.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
