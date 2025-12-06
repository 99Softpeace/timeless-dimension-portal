'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

// Types
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
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data: AuthResponse = await res.json()

            if (data.success && data.data) {
                // Store token
                localStorage.setItem('token', data.data.token)
                localStorage.setItem('user', JSON.stringify(data.data.user))

                // Redirect
                router.push('/shop')
                router.refresh()
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
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium text-silver">Email</label>
                <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-midnight-2 border border-glass-border rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent text-silver outline-none transition-all"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-silver">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full px-4 py-3 bg-midnight-2 border border-glass-border rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent text-silver outline-none transition-all pr-12"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-silver-dark hover:text-silver transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <div className="flex justify-end">
                    <Link href="/forgot-password" className="text-sm text-teal hover:text-teal-400 transition-colors">
                        Forgot password?
                    </Link>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>

            <p className="text-center text-silver-dark text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="text-teal hover:text-teal-400 font-medium transition-colors">
                    Create one
                </Link>
            </p>
        </form>
    )
}

export function RegisterForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
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
            const res = await fetch('http://localhost:4000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data: AuthResponse = await res.json()

            if (data.success && data.data) {
                localStorage.setItem('token', data.data.token)
                localStorage.setItem('user', JSON.stringify(data.data.user))
                router.push('/shop')
                router.refresh()
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
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-silver">First Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-midnight-2 border border-glass-border rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent text-silver outline-none transition-all"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-silver">Last Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-midnight-2 border border-glass-border rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent text-silver outline-none transition-all"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-silver">Email</label>
                <input
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-midnight-2 border border-glass-border rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent text-silver outline-none transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-silver">Phone (Optional)</label>
                <input
                    type="tel"
                    className="w-full px-4 py-3 bg-midnight-2 border border-glass-border rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent text-silver outline-none transition-all"
                    placeholder="+234..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-silver">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        className="w-full px-4 py-3 bg-midnight-2 border border-glass-border rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent text-silver outline-none transition-all pr-12"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-silver-dark hover:text-silver transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
            </button>

            <p className="text-center text-silver-dark text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-teal hover:text-teal-400 font-medium transition-colors">
                    Sign in
                </Link>
            </p>
        </form>
    )
}
