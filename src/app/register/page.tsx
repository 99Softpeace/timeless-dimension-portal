import { RegisterForm } from '@/components/AuthForms'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Account - Timeless Dimension Portal',
    description: 'Register for a new account'
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-md space-y-8 glass p-8 rounded-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-display font-bold text-silver">
                        Create Account
                    </h1>
                    <p className="mt-2 text-silver-dark">
                        Join the Timeless Dimension Portal
                    </p>
                </div>
                <RegisterForm />
            </div>
        </div>
    )
}
