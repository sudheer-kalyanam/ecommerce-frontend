'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { sellerOrdersApi } from '@/lib/api'
import { toast } from 'sonner'

interface OrderItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    images: string[]
    price: number
    category: {
      name: string
    }
  }
  seller: {
    id: string
    businessName: string
    businessAddress: string
    businessPhone: string
    businessEmail: string
  }
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'
  totalAmount: number
  deliveryAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod: 'cod' | 'card' | 'upi'
  estimatedDelivery?: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export default function SellerOrders() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    if (authLoading) return
    
    if (!user || user.role !== 'SELLER') {
      router.push('/auth/login')
      return
    }
    
    loadOrders()
  }, [user, authLoading])

  const loadOrders = async () => {
    try {
      const response = await sellerOrdersApi.getMyOrders()
      setOrders(response)
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await sellerOrdersApi.updateStatus(orderId, newStatus)
      toast.success('Order status updated successfully')
      loadOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = statusFilter === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === statusFilter)

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Order Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Monitor, process, and fulfill customer orders with ease
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📦</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{orders.filter(o => o.status === 'PENDING').length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⏳</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'DELIVERED').length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{orders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + o.totalAmount, 0).toFixed(0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Filter Orders</h3>
              <p className="text-sm text-gray-600">Find orders by status or search criteria</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
              >
                <option value="ALL">🔍 All Orders</option>
                <option value="PENDING">⏳ Pending</option>
                <option value="CONFIRMED">✅ Confirmed</option>
                <option value="PROCESSING">⚙️ Processing</option>
                <option value="SHIPPED">🚚 Shipped</option>
                <option value="IN_TRANSIT">🛣️ In Transit</option>
                <option value="OUT_FOR_DELIVERY">🏠 Out for Delivery</option>
                <option value="DELIVERED">✅ Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-white/50 shadow-xl text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No Orders Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {statusFilter === 'ALL' 
                ? 'Orders will appear here when customers purchase your products. Start promoting your products to get your first order!'
                : `No ${statusFilter.toLowerCase()} orders found. Try adjusting your filter criteria.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2">
                            <span className="text-gray-500">👤 Customer:</span>
                            <span className="font-medium text-gray-900">{order.customer.firstName} {order.customer.lastName}</span>
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="text-gray-500">📧 Email:</span>
                            <span className="text-gray-700">{order.customer.email}</span>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="flex items-center gap-2">
                            <span className="text-gray-500">📅 Placed:</span>
                            <span className="text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </p>
                          {order.estimatedDelivery && (
                            <p className="flex items-center gap-2">
                              <span className="text-gray-500">🚚 Expected:</span>
                              <span className="text-blue-600 font-medium">{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:text-right">
                      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">via {order.paymentMethod.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="px-8 py-6 space-y-6">

                  {/* Order Items */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📦</span> Order Items
                    </h4>
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg">🛍️</span>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                  {item.product.category.name}
                                </span>
                                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">₹{item.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">per item</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🏠</span> Delivery Address
                    </h4>
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">📍</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-2">{order.deliveryAddress.fullName}</h5>
                          <div className="space-y-1 text-gray-600">
                            <p>{order.deliveryAddress.address}</p>
                            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
                            <p className="flex items-center gap-2">
                              <span>📞</span>
                              <span className="font-medium">{order.deliveryAddress.phone}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Update Actions */}
                  {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span>⚡</span> Update Order Status
                      </h4>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">
                            Keep customers informed by updating the order status as you process it.
                          </p>
                          <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">Current Status:</label>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-medium text-gray-700">Update to:</label>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-medium"
                          >
                            <option value="PENDING">⏳ Pending</option>
                            <option value="CONFIRMED">✅ Confirmed</option>
                            <option value="PROCESSING">⚙️ Processing</option>
                            <option value="SHIPPED">🚚 Shipped</option>
                            <option value="IN_TRANSIT">🛣️ In Transit</option>
                            <option value="OUT_FOR_DELIVERY">🏠 Out for Delivery</option>
                            <option value="DELIVERED">✅ Delivered</option>
                            <option value="CANCELLED">❌ Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
