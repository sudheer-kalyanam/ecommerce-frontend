'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function SellerRedirect() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    
    if (!user || user.role !== 'SELLER') {
      router.push('/auth/login')
      return
    }
    
    // Redirect to seller dashboard
    router.push('/seller/dashboard')
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to seller dashboard...</p>
      </div>
    </div>
  )
}