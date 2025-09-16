'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  is2FAEnabled: boolean
  profile: any
  adminRoles?: string[]
  phone?: string
  createdAt?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (userData: User, token: string) => void
  logout: () => void
  updateUser: (userData: User) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log('🔄 [AUTH CONTEXT] Loading user data from localStorage...');
    
    // Load user data from localStorage on mount
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user_data')

    console.log('🔍 [AUTH CONTEXT] Found data:', {
      hasToken: !!token,
      hasUserData: !!userData,
      tokenLength: token?.length || 0,
      userDataLength: userData?.length || 0
    });

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        console.log('✅ [AUTH CONTEXT] Successfully parsed user:', {
          id: parsedUser.id,
          email: parsedUser.email,
          role: parsedUser.role,
          firstName: parsedUser.firstName
        });
        setUser(parsedUser)
      } catch (error) {
        console.error('❌ [AUTH CONTEXT] Error parsing user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    } else {
      console.log('⚠️ [AUTH CONTEXT] No token or user data found');
    }
    
    console.log('🏁 [AUTH CONTEXT] Setting loading to false');
    setLoading(false)
  }, [])

  const login = (userData: User, token: string) => {
    console.log('🔐 [AUTH CONTEXT] Login called with:', {
      userData: { id: userData.id, email: userData.email, role: userData.role },
      tokenLength: token.length
    });
    
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_data', JSON.stringify(userData))
    setUser(userData)
    
    console.log('✅ [AUTH CONTEXT] User data stored and state updated');
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUser(null)
    router.push('/')
  }

  const updateUser = (userData: User) => {
    localStorage.setItem('user_data', JSON.stringify(userData))
    setUser(userData)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
