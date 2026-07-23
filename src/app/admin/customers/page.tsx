'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCcw, Trash2, Users, UserCheck, UserX } from 'lucide-react'

type AdminUser = {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'customer' | 'admin' | 'moderator'
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

const ROLES: Array<AdminUser['role']> = ['customer', 'moderator', 'admin']

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | AdminUser['role']>('all')
  const [savingId, setSavingId] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const token = useMemo(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : null), [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch('/api/users/admin', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to fetch customers')
      }

      setUsers(result.data || [])
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
      const matchesSearch = !q || fullName.includes(q) || user.email.toLowerCase().includes(q)
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  const updateRole = async (id: string, role: AdminUser['role']) => {
    try {
      setSavingId(id)
      const res = await fetch('/api/users/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id, role }),
      })
      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to update role')
      }

      setUsers((prev) => prev.map((user) => (user._id === id ? result.data : user)))
    } catch (err: any) {
      alert(err?.message || 'Failed to update role')
    } finally {
      setSavingId(null)
    }
  }

  const setAccountActive = async (user: AdminUser, isActive: boolean) => {
    if (!window.confirm(`${isActive ? 'Unban' : 'Ban'} ${user.email}?`)) return
    try {
      setSavingId(user._id)
      const res = await fetch('/api/users/admin', { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ id: user._id, isActive }) })
      const result = await res.json()
      if (!res.ok || !result.success) throw new Error(result.message || 'Failed to update account')
      setUsers((prev) => prev.map((item) => item._id === user._id ? result.data : item))
    } catch (err: any) { alert(err?.message || 'Failed to update account') } finally { setSavingId(null) }
  }

  const permanentlyDeleteUser = async (user: AdminUser) => {
    const confirmed = window.confirm(`Permanently delete ${user.email}? This cannot be undone.`)
    if (!confirmed || !window.confirm('Final confirmation: permanently delete this account?')) return
    try {
      setRemovingId(user._id)
      const res = await fetch('/api/users/admin', { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ id: user._id, permanent: true }) })
      const result = await res.json()
      if (!res.ok || !result.success) throw new Error(result.message || 'Failed to delete account')
      setUsers((prev) => prev.filter((item) => item._id !== user._id))
    } catch (err: any) { alert(err?.message || 'Failed to delete account') } finally { setRemovingId(null) }
  }
  const customersCount = users.filter((user) => user.role === 'customer').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient">Customers</h1>
          <p className="text-silver-dark mt-1 text-sm">
            Manage registered users, roles, and account access.
          </p>
        </div>
        <button
          onClick={() => void fetchUsers()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal text-midnight font-bold rounded-lg hover:bg-teal/90 w-full md:w-auto"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <div className="text-silver-dark text-xs uppercase tracking-wider">Total Users</div>
          <div className="text-2xl font-bold text-silver mt-1">{users.length}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-silver-dark text-xs uppercase tracking-wider">Customers</div>
          <div className="text-2xl font-bold text-silver mt-1">{customersCount}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-silver-dark text-xs uppercase tracking-wider">Admins/Moderators</div>
          <div className="text-2xl font-bold text-silver mt-1">{users.length - customersCount}</div>
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email"
            className="flex-1 bg-midnight/50 border border-glass-border rounded-lg px-4 py-2 text-white placeholder-silver-dark"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | AdminUser['role'])}
            className="bg-midnight/50 border border-glass-border rounded-lg px-4 py-2 text-white w-full md:w-auto"
          >
            <option value="all">All roles</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-glass rounded-xl border border-glass-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[920px]">
            <thead>
              <tr className="border-b border-glass-border bg-white/5">
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Name</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Email</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Role</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Joined</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Status</th>
                <th className="px-4 py-3 text-xs uppercase tracking-wider text-teal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-silver">
                    Loading customers...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-red-300">
                    {error}
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-silver-dark">
                    No users match your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-4 text-white font-medium">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-teal" />
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-silver">{user.email}</td>
                    <td className="px-4 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => void updateRole(user._id, e.target.value as AdminUser['role'])}
                        disabled={savingId === user._id}
                        className="bg-midnight/70 border border-glass-border rounded-lg px-3 py-2 text-white text-sm disabled:opacity-60"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-silver-dark text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-silver-dark text-sm">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => void setAccountActive(user, !user.isActive)} disabled={savingId === user._id} className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm disabled:opacity-60 ${user.isActive ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'}`}>
                          {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}{user.isActive ? 'Ban' : 'Unban'}
                        </button>
                        <button onClick={() => void permanentlyDeleteUser(user)} disabled={removingId === user._id} className="inline-flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-300 hover:bg-red-500/30 disabled:opacity-60">
                          <Trash2 size={14} />{removingId === user._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
