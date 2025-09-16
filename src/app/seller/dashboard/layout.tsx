'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main content */}
      <div className="relative z-20">
        {/* Page content */}
        <main className="py-6 pt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="min-h-screen">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
