'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    _id: string
    firstName: string
    lastName: string
    email: string
    role: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (token: string, user: User) => void
    logout: () => void
    isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => { },
    logout: () => { },
    isAdmin: false
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = () => {
        try {
            const token = localStorage.getItem('token')
            const userData = localStorage.getItem('user')

            if (token && userData) {
                setUser(JSON.parse(userData))
            } else {
                setUser(null)
            }
        } catch (error) {
            console.error('Auth check error:', error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)

        // Redirect based on role
        if (userData.role === 'admin') {
            router.push('/admin')
        } else {
            router.push('/shop')
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            isAdmin: user?.role === 'admin'
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
