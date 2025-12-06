import { LoginForm } from '@/components/AuthForms'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login - Timeless Dimension Portal',
    description: 'Sign in to your account'
}

export default function LoginPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-md space-y-8 glass p-8 rounded-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-display font-bold text-silver">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-silver-dark">
                        Sign in to access your account
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}
