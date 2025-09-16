'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { productsApi, sellerOrdersApi } from '@/lib/api'

interface AnalyticsData {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
  }>
  monthlyRevenue: Array<{
    month: string
    revenue: number
  }>
}

export default function SellerAnalytics() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    topProducts: [],
    monthlyRevenue: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    
    if (!user || user.role !== 'SELLER') {
      router.push('/auth/login')
      return
    }
    
    loadAnalytics()
  }, [user, authLoading])

  const loadAnalytics = async () => {
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        productsApi.getMyProducts(),
        sellerOrdersApi.getMyOrders()
      ])

      const totalProducts = productsResponse.length
      const totalOrders = ordersResponse.length
      const totalRevenue = ordersResponse.reduce((sum: number, order: any) => {
        return sum + (order.status === 'DELIVERED' ? order.totalAmount : 0)
      }, 0)
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Calculate top products (simplified)
      const productSales: { [key: string]: { name: string; sales: number; revenue: number } } = {}
      ordersResponse.forEach((order: any) => {
        order.items.forEach((item: any) => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              name: item.product.name,
              sales: 0,
              revenue: 0
            }
          }
          productSales[item.productId].sales += item.quantity
          productSales[item.productId].revenue += item.price * item.quantity
        })
      })

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      // Calculate monthly revenue (simplified)
      const monthlyRevenue = ordersResponse.reduce((acc: { [key: string]: number }, order: any) => {
        if (order.status === 'DELIVERED') {
          const month = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          acc[month] = (acc[month] || 0) + order.totalAmount
        }
        return acc
      }, {})

      const monthlyRevenueArray = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
        month,
        revenue: revenue as number
      }))

      setAnalytics({
        totalProducts,
        totalOrders,
        totalRevenue,
        averageOrderValue,
        topProducts,
        monthlyRevenue: monthlyRevenueArray
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-12 px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track your store performance and sales metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">🛍️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.totalProducts}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">📦</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{analytics.totalOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">${analytics.totalRevenue.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                  <dd className="text-lg font-medium text-gray-900">${analytics.averageOrderValue.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top Selling Products</h3>
          {analytics.topProducts.length === 0 ? (
            <p className="text-gray-500">No sales data available yet</p>
          ) : (
            <div className="space-y-3">
              {analytics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">#{index + 1}</span>
                    <span className="text-sm text-gray-700">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">${product.revenue.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{product.sales} sold</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Monthly Revenue</h3>
          {analytics.monthlyRevenue.length === 0 ? (
            <p className="text-gray-500">No revenue data available yet</p>
          ) : (
            <div className="space-y-3">
              {analytics.monthlyRevenue.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{month.month}</span>
                  <span className="text-sm font-medium text-gray-900">${month.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
