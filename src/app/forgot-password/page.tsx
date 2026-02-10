'use client'

import { ForgotPasswordForm } from '@/components/AuthForms'

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20 flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="mb-12 text-center">
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-4 block">
                        ACCOUNT RECOVERY
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-2">
                        Reset Access.
                    </h1>
                </div>
                <ForgotPasswordForm />
            </div>
        </div>
    )
}
