'use client'

import { RegisterForm } from '@/components/AuthForms'

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="mb-12 text-center">
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 block">
                        SENATOR ACCOUNT
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-2">
                        Join the Circle.
                    </h1>
                </div>
                <RegisterForm />
            </div>
        </div>
    )
}
