'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface AuthResponse {
    success: boolean
    message: string
    data?: {
        token: string
        user: any
    }
}

export function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const { login } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data: AuthResponse = await res.json()

            if (data.success && data.data) {
                login(data.data.token, data.data.user)
            } else {
                setError(data.message || 'Login failed')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 border-l-4 border-red-600">
                    {error}
                </div>
            )}

            <div className="space-y-8">
                <div className="group">
                    <input
                        type="email"
                        required
                        className="w-full py-4 bg-transparent border-b border-slate-300 text-slate-900 text-xl focus:outline-none focus:border-slate-900 transition-colors placeholder-slate-400"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div className="relative group">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full py-4 bg-transparent border-b border-slate-300 text-slate-900 text-xl focus:outline-none focus:border-slate-900 transition-colors placeholder-slate-400 pr-12"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <div className="flex justify-end mt-2">
                        <Link href="/forgot-password" className="text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 flex items-center justify-between px-6 hover:bg-teal-600 transition-colors group"
            >
                <span className="font-medium tracking-wide">SIGN IN</span>
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />}
            </button>

            <div className="text-center pt-8 border-t border-slate-100">
                <p className="text-slate-500 text-sm mb-4">New to Senator?</p>
                <Link href="/register" className="inline-block border border-slate-200 px-8 py-3 text-sm font-medium hover:border-slate-900 transition-colors">
                    CREATE ACCOUNT
                </Link>
            </div>
        </form>
    )
}

export function RegisterForm() {
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const { login } = useAuth()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data: AuthResponse = await res.json()

            if (data.success && data.data) {
                login(data.data.token, data.data.user)
            } else {
                setError(data.message || 'Registration failed')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 border-l-4 border-red-600">
                    {error}
                </div>
            )}

            <div className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                    <input
                        type="text"
                        required
                        className="w-full py-4 bg-transparent border-b border-slate-300 text-slate-900 text-xl focus:outline-none focus:border-slate-900 transition-colors placeholder-slate-400"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    <input
                        type="text"
                        required
                        className="w-full py-4 bg-transparent border-b border-slate-300 text-slate-900 text-xl focus:outline-none focus:border-slate-900 transition-colors placeholder-slate-400"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>

                <input
                    type="email"
                    required
                    className="w-full py-4 bg-transparent border-b border-slate-300 text-slate-900 text-xl focus:outline-none focus:border-slate-900 transition-colors placeholder-slate-400"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <input
                    type="tel"
                    className="w-full py-4 bg-transparent border-b border-slate-300 text-slate-900 text-xl focus:outline-none focus:border-slate-900 transition-colors placeholder-slate-400"
                    placeholder="Phone (Optional)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <div className="relative group">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full py-4 bg-transparent border-b border-slate-300 text-slate-900 text-xl focus:outline-none focus:border-slate-900 transition-colors placeholder-slate-400 pr-12"
                        placeholder="Create Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 flex items-center justify-between px-6 hover:bg-teal-600 transition-colors group"
            >
                <span className="font-medium tracking-wide">CREATE ACCOUNT</span>
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />}
            </button>

            <div className="text-center pt-8 border-t border-slate-100">
                <p className="text-slate-500 text-sm mb-4">Already a member?</p>
                <Link href="/login" className="inline-block border border-slate-200 px-8 py-3 text-sm font-medium hover:border-slate-900 transition-colors">
                    SIGN IN
                </Link>
            </div>
        </form>
    )
}
