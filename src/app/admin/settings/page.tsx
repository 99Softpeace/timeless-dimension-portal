'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Loader2, Save, Shield, Bell } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

type AdminPreferences = {
    orderNotifications: boolean
    lowStockAlerts: boolean
    weeklySummary: boolean
    timezone: string
}

const DEFAULT_PREFERENCES: AdminPreferences = {
    orderNotifications: true,
    lowStockAlerts: true,
    weeklySummary: false,
    timezone: 'Africa/Lagos',
}

export default function AdminSettingsPage() {
    const { user, loading } = useAuth()
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    })
    const [preferences, setPreferences] = useState<AdminPreferences>(DEFAULT_PREFERENCES)
    const [savingProfile, setSavingProfile] = useState(false)
    const [savingPreferences, setSavingPreferences] = useState(false)
    const [profileMessage, setProfileMessage] = useState('')
    const [preferencesMessage, setPreferencesMessage] = useState('')

    const token = useMemo(
        () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null),
        []
    )

    useEffect(() => {
        if (!user) return

        const storedUserRaw = localStorage.getItem('user')
        let storedPhone = ''
        if (storedUserRaw) {
            try {
                const parsed = JSON.parse(storedUserRaw)
                storedPhone = parsed?.phone || ''
            } catch (error) {
                storedPhone = ''
            }
        }

        setProfile({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: storedPhone,
        })

        const prefsRaw = localStorage.getItem('adminPreferences')
        if (prefsRaw) {
            try {
                const parsed = JSON.parse(prefsRaw)
                setPreferences({ ...DEFAULT_PREFERENCES, ...parsed })
            } catch (error) {
                setPreferences(DEFAULT_PREFERENCES)
            }
        }
    }, [user])

    const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!user?._id) return

        try {
            setSavingProfile(true)
            setProfileMessage('')

            const res = await fetch('/api/users/admin', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    id: user._id,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    email: profile.email,
                    phone: profile.phone,
                }),
            })
            const result = await res.json()

            if (!res.ok || !result.success) {
                throw new Error(result.message || 'Failed to update profile')
            }

            const existingRaw = localStorage.getItem('user')
            const existing = existingRaw ? JSON.parse(existingRaw) : {}
            localStorage.setItem('user', JSON.stringify({ ...existing, ...result.data }))
            setProfileMessage('Profile updated successfully.')
        } catch (error: any) {
            setProfileMessage(error?.message || 'Failed to update profile.')
        } finally {
            setSavingProfile(false)
        }
    }

    const handlePreferencesSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSavingPreferences(true)
        setPreferencesMessage('')

        localStorage.setItem('adminPreferences', JSON.stringify(preferences))
        setPreferencesMessage('Preferences saved successfully.')
        setSavingPreferences(false)
    }

    if (loading) {
        return (
            <div className="glass-card p-6 text-silver-dark text-center">
                Loading settings...
            </div>
        )
    }

    if (!user) {
        return (
            <div className="glass-card p-6 text-silver-dark text-center">
                Sign in to manage admin settings.
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-gradient">Settings</h1>
                <p className="text-silver-dark text-sm mt-1">
                    Update your admin profile and dashboard preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <form
                    onSubmit={handleProfileSubmit}
                    className="glass-card p-5 sm:p-6 space-y-5"
                >
                    <div className="flex items-center gap-2 text-silver">
                        <Shield size={18} className="text-teal" />
                        <h2 className="text-lg font-semibold">Admin Profile</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs uppercase tracking-wider text-silver-dark">First Name</label>
                            <input
                                value={profile.firstName}
                                onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
                                required
                                className="mt-1 w-full rounded-lg border border-glass-border bg-midnight/60 px-3 py-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="text-xs uppercase tracking-wider text-silver-dark">Last Name</label>
                            <input
                                value={profile.lastName}
                                onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
                                required
                                className="mt-1 w-full rounded-lg border border-glass-border bg-midnight/60 px-3 py-2 text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs uppercase tracking-wider text-silver-dark">Email</label>
                        <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                            required
                            className="mt-1 w-full rounded-lg border border-glass-border bg-midnight/60 px-3 py-2 text-white"
                        />
                    </div>

                    <div>
                        <label className="text-xs uppercase tracking-wider text-silver-dark">Phone</label>
                        <input
                            value={profile.phone}
                            onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                            placeholder="+234..."
                            className="mt-1 w-full rounded-lg border border-glass-border bg-midnight/60 px-3 py-2 text-white"
                        />
                    </div>

                    {profileMessage && (
                        <p className="text-sm text-silver-dark">{profileMessage}</p>
                    )}

                    <button
                        type="submit"
                        disabled={savingProfile}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2 font-semibold text-midnight disabled:opacity-60"
                    >
                        {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Profile
                    </button>
                </form>

                <form
                    onSubmit={handlePreferencesSubmit}
                    className="glass-card p-5 sm:p-6 space-y-5"
                >
                    <div className="flex items-center gap-2 text-silver">
                        <Bell size={18} className="text-teal" />
                        <h2 className="text-lg font-semibold">Preferences</h2>
                    </div>

                    <div className="space-y-3">
                        <label className="flex items-center justify-between gap-3 rounded-lg border border-glass-border bg-midnight/40 px-3 py-2">
                            <span className="text-sm text-silver">Order notifications</span>
                            <input
                                type="checkbox"
                                checked={preferences.orderNotifications}
                                onChange={(e) =>
                                    setPreferences((prev) => ({ ...prev, orderNotifications: e.target.checked }))
                                }
                                className="h-4 w-4"
                            />
                        </label>

                        <label className="flex items-center justify-between gap-3 rounded-lg border border-glass-border bg-midnight/40 px-3 py-2">
                            <span className="text-sm text-silver">Low stock alerts</span>
                            <input
                                type="checkbox"
                                checked={preferences.lowStockAlerts}
                                onChange={(e) =>
                                    setPreferences((prev) => ({ ...prev, lowStockAlerts: e.target.checked }))
                                }
                                className="h-4 w-4"
                            />
                        </label>

                        <label className="flex items-center justify-between gap-3 rounded-lg border border-glass-border bg-midnight/40 px-3 py-2">
                            <span className="text-sm text-silver">Weekly summary email</span>
                            <input
                                type="checkbox"
                                checked={preferences.weeklySummary}
                                onChange={(e) =>
                                    setPreferences((prev) => ({ ...prev, weeklySummary: e.target.checked }))
                                }
                                className="h-4 w-4"
                            />
                        </label>
                    </div>

                    <div>
                        <label className="text-xs uppercase tracking-wider text-silver-dark">Timezone</label>
                        <select
                            value={preferences.timezone}
                            onChange={(e) =>
                                setPreferences((prev) => ({ ...prev, timezone: e.target.value }))
                            }
                            className="mt-1 w-full rounded-lg border border-glass-border bg-midnight/60 px-3 py-2 text-white"
                        >
                            <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                            <option value="UTC">UTC</option>
                            <option value="Europe/London">Europe/London</option>
                            <option value="America/New_York">America/New_York</option>
                        </select>
                    </div>

                    {preferencesMessage && (
                        <p className="text-sm text-silver-dark">{preferencesMessage}</p>
                    )}

                    <button
                        type="submit"
                        disabled={savingPreferences}
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-teal px-4 py-2 font-semibold text-midnight disabled:opacity-60"
                    >
                        {savingPreferences ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Preferences
                    </button>
                </form>
            </div>
        </div>
    )
}
