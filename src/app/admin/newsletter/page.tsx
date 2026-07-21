'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Loader2, Mail, Send } from 'lucide-react'

type NewsletterStats = {
    activeSubscribers: number
    totalSubscribers: number
}

export default function AdminNewsletterPage() {
    const [stats, setStats] = useState<NewsletterStats | null>(null)
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [includeSubscribers, setIncludeSubscribers] = useState(true)
    const [includeCustomers, setIncludeCustomers] = useState(true)
    const [loadingStats, setLoadingStats] = useState(true)
    const [sending, setSending] = useState(false)
    const [feedback, setFeedback] = useState('')

    const token = useMemo(
        () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null),
        []
    )

    useEffect(() => {
        async function loadStats() {
            try {
                setLoadingStats(true)
                const res = await fetch('/api/newsletter', {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                })
                const result = await res.json()
                if (!res.ok || !result.success) {
                    throw new Error(result.message || 'Could not load newsletter stats.')
                }
                setStats(result.data)
            } catch (error: any) {
                setFeedback(error?.message || 'Could not load newsletter stats.')
            } finally {
                setLoadingStats(false)
            }
        }

        loadStats()
    }, [token])

    const handleSend = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSending(true)
        setFeedback('')

        try {
            const res = await fetch('/api/newsletter/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    subject,
                    message,
                    includeSubscribers,
                    includeCustomers,
                }),
            })
            const result = await res.json()

            if (!res.ok || !result.success) {
                throw new Error(result.message || 'Could not send newsletter.')
            }

            setFeedback(result.message || 'Newsletter sent.')
            setSubject('')
            setMessage('')
        } catch (error: any) {
            setFeedback(error?.message || 'Could not send newsletter.')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-gradient">Newsletter</h1>
                <p className="text-silver-dark text-sm mt-1">
                    Send product drops, offers, and store updates using the configured Gmail account.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 text-silver mb-3">
                        <Mail size={18} className="text-teal" />
                        <h2 className="text-sm font-semibold uppercase tracking-wide">Subscribers</h2>
                    </div>
                    <p className="text-3xl font-display text-white">
                        {loadingStats ? '...' : stats?.activeSubscribers ?? 0}
                    </p>
                    <p className="text-xs text-silver-dark mt-1">
                        Active newsletter subscribers
                    </p>
                </div>

                <div className="glass-card p-5 lg:col-span-2">
                    <p className="text-sm text-silver-dark leading-relaxed">
                        Messages are sent one by one, so recipients do not see each other's email addresses. Registered customers can be included along with newsletter subscribers.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSend} className="glass-card p-5 sm:p-6 space-y-5">
                <div>
                    <label className="text-xs uppercase tracking-wider text-silver-dark">Subject</label>
                    <input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        placeholder="New arrivals just landed"
                        className="mt-1 w-full rounded-lg border border-glass-border bg-midnight/60 px-3 py-3 text-white placeholder:text-silver-dark focus:outline-none focus:border-teal"
                    />
                </div>

                <div>
                    <label className="text-xs uppercase tracking-wider text-silver-dark">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={9}
                        placeholder="Write the update you want to send..."
                        className="mt-1 w-full rounded-lg border border-glass-border bg-midnight/60 px-3 py-3 text-white placeholder:text-silver-dark focus:outline-none focus:border-teal"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center justify-between gap-3 rounded-lg border border-glass-border bg-midnight/40 px-3 py-3">
                        <span className="text-sm text-silver">Newsletter subscribers</span>
                        <input
                            type="checkbox"
                            checked={includeSubscribers}
                            onChange={(e) => setIncludeSubscribers(e.target.checked)}
                            className="h-4 w-4"
                        />
                    </label>
                    <label className="flex items-center justify-between gap-3 rounded-lg border border-glass-border bg-midnight/40 px-3 py-3">
                        <span className="text-sm text-silver">Registered customers</span>
                        <input
                            type="checkbox"
                            checked={includeCustomers}
                            onChange={(e) => setIncludeCustomers(e.target.checked)}
                            className="h-4 w-4"
                        />
                    </label>
                </div>

                {feedback && (
                    <p className="text-sm text-silver-dark">{feedback}</p>
                )}

                <button
                    type="submit"
                    disabled={sending || (!includeSubscribers && !includeCustomers)}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-teal px-5 py-3 font-semibold text-midnight disabled:opacity-60"
                >
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Send Update
                </button>
            </form>
        </div>
    )
}
