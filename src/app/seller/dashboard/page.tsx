'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { productsApi, sellerOrdersApi } from '@/lib/api'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
}

export default function SellerDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    
    if (!user || user.role !== 'SELLER') {
      router.push('/auth/login')
      return
    }
    
    loadDashboardStats()
  }, [user, authLoading])

  const loadDashboardStats = async () => {
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        productsApi.getMyProducts(),
        sellerOrdersApi.getMyOrders()
      ])

      const totalProducts = productsResponse.length
      const totalOrders = ordersResponse.length
      const pendingOrders = ordersResponse.filter((order: any) => order.status === 'PENDING').length
      const totalRevenue = ordersResponse.reduce((sum: number, order: any) => {
        return sum + (order.status === 'DELIVERED' ? order.totalAmount : 0)
      }, 0)

      setStats({
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue
      })
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">
          Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Welcome back, <span className="font-semibold text-indigo-600">{user?.firstName}</span>! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🛍️</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-16 h-16 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-xl"></div>
        </div>

        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">📦</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-16 h-16 bg-gradient-to-br from-emerald-200/30 to-green-200/30 rounded-full blur-xl"></div>
        </div>

        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">⏳</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-16 h-16 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-xl"></div>
        </div>

        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">💰</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    ₹{stats.totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-16 h-16 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => router.push('/seller/products/new')}
              className="group relative inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2 text-lg">✨</span>
              Add New Product
            </button>
            <button
              onClick={() => router.push('/seller/orders')}
              className="group relative inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2 text-lg">📦</span>
              View Orders
            </button>
            <button
              onClick={() => router.push('/seller/products')}
              className="group relative inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-base font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2 text-lg">🛍️</span>
              Manage Products
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
