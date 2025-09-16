'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    console.log('🔍 [ADMIN LAYOUT] Auth check:', {
      authLoading,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      hasToken: !!localStorage.getItem('auth_token'),
      hasUserData: !!localStorage.getItem('user_data')
    });

    if (authLoading) {
      console.log('⏳ [ADMIN LAYOUT] Still loading auth...');
      return;
    }
    
    if (!user) {
      console.log('❌ [ADMIN LAYOUT] No user found, redirecting to login');
      router.push('/auth/login');
      return;
    }
    
    if (user.role !== 'ADMIN') {
      console.log('❌ [ADMIN LAYOUT] User is not admin, role:', user.role, 'redirecting to login');
      router.push('/auth/login');
      return;
    }
    
    console.log('✅ [ADMIN LAYOUT] User is admin, allowing access');
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
