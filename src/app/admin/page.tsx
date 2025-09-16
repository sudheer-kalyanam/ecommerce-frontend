'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Users, ShoppingBag, Package, DollarSign, UserCheck, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { adminOrdersApi } from '@/lib/api'

interface DashboardStats {
  totalSellers: number
  pendingSellers: number
  approvedSellers: number
  totalProducts: number
  pendingProducts: number
  totalCustomers: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  recentOrders: Array<{
    id: string
    customer: string
    amount: number
    status: string
    date: string
  }>
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalSellers: 0,
    pendingSellers: 0,
    approvedSellers: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      // Fetch real data from API
      const dashboardData = await adminOrdersApi.getDashboardStats()
      setStats(dashboardData)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      // Set empty stats if API fails
      setStats({
        totalSellers: 0,
        pendingSellers: 0,
        approvedSellers: 0,
        totalProducts: 0,
        pendingProducts: 0,
        totalCustomers: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        recentOrders: []
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Welcome back, <span className="font-semibold text-blue-600">{user?.firstName}</span>! Here's your marketplace overview.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Sellers Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sellers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSellers}</p>
              <div className="flex items-center mt-2 space-x-4 text-sm">
                <span className="text-green-600">✓ {stats.approvedSellers} approved</span>
                <span className="text-amber-600">⏳ {stats.pendingSellers} pending</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Products Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              <div className="flex items-center mt-2">
                <span className="text-amber-600 text-sm">⏳ {stats.pendingProducts} pending approval</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Customers Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
              <div className="flex items-center mt-2">
                <span className="text-green-600 text-sm">📈 Active users</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-green-600 text-sm">📈 +12.5% this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                  </div>
                </div>
              </div>
              <Link
                href="/admin/orders"
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                View All Orders
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <Link 
                  href="/admin/orders"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  View All →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {stats.recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div 
                      key={order.id} 
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
                    >
                      {/* Left side - Order info */}
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-semibold text-gray-900">#{order.id.slice(-8)}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'DELIVERED' 
                                ? 'bg-green-100 text-green-700' 
                                : order.status === 'SHIPPED'
                                ? 'bg-blue-100 text-blue-700'
                                : order.status === 'OUT_FOR_DELIVERY'
                                ? 'bg-orange-100 text-orange-700'
                                : order.status === 'CONFIRMED'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {order.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                        </div>
                      </div>

                      {/* Right side - Amount and date */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{order.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/sellers"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Review Sellers</p>
              <p className="text-xs text-gray-500">{stats.pendingSellers} pending approvals</p>
            </div>
          </Link>
          
          <Link
            href="/admin/products"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
              <Package className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Review Products</p>
              <p className="text-xs text-gray-500">{stats.pendingProducts} pending approvals</p>
            </div>
          </Link>
          
          <Link
            href="/admin/analytics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">View Analytics</p>
              <p className="text-xs text-gray-500">Performance insights</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}