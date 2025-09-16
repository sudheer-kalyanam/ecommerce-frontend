'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, Package, Truck, CheckCircle, User, MapPin, CreditCard, Calendar, Search, Filter, X, Phone, Mail } from 'lucide-react'
import { adminOrdersApi } from '@/lib/api'
import { toast } from 'sonner'
import { ProductImage } from '@/components/ui/product-image'

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

export default function AdminOrders() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)

  useEffect(() => {
    if (authLoading) return
    
    if (!user || user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
    
    loadOrders()
  }, [user, authLoading])

  const loadOrders = async () => {
    try {
      const response = await adminOrdersApi.getAllOrders()
      setOrders(response)
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await adminOrdersApi.updateOrderStatus(orderId, newStatus)
      toast.success('Order status updated successfully')
      loadOrders() // Reload orders to get updated data
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const closeOrderModal = () => {
    setSelectedOrder(null)
    setShowOrderModal(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800'
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800'
      case 'PROCESSING':
        return 'bg-indigo-100 text-indigo-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'IN_TRANSIT':
        return 'bg-cyan-100 text-cyan-800'
      case 'OUT_FOR_DELIVERY':
        return 'bg-orange-100 text-orange-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'ALL' || order.status === filter
    const matchesSearch = searchQuery === '' || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesFilter && matchesSearch
  })

  if (loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Order Management
              </h1>
              <p className="mt-2 text-gray-600">Monitor and manage all customer orders efficiently</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                <div className="text-xs text-blue-500">Total Orders</div>
              </div>
              <div className="bg-green-50 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold text-green-600">{orders.filter(o => o.status === 'DELIVERED').length}</div>
                <div className="text-xs text-green-500">Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search orders, customers, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500">Showing</span>
              <span className="font-semibold text-blue-600">{filteredOrders.length}</span>
              <span className="text-sm text-gray-500">of {orders.length} orders</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {(['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  filter === status
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {status.replace('_', ' ')} ({orders.filter(o => status === 'ALL' ? true : o.status === status).length})
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="text-gray-300 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search criteria' : 'No orders match the selected filter'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">#{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{order.paymentMethod.toUpperCase()}</div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6 space-y-6">
                  {/* Customer & Delivery Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer Details */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Customer Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <span className="font-medium text-gray-900">{order.customer.firstName} {order.customer.lastName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span>📧 {order.customer.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span>📞 {order.customer.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Delivery Address
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="font-medium text-gray-900">{order.deliveryAddress.fullName}</div>
                        <div>{order.deliveryAddress.address}</div>
                        <div>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</div>
                        <div>📱 {order.deliveryAddress.phone}</div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center">
                      <Package className="h-4 w-4 mr-2" />
                      Order Items ({order.items.length})
                    </h4>
                    <div className="grid gap-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200">
                              <ProductImage
                                src={item.product.images}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                                fallbackIcon={
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                }
                                fallbackText=""
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                  {item.product.category.name}
                                </span>
                                <span className="text-xs text-gray-500">by {item.seller.businessName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {order.estimatedDelivery && (
                        <span>Expected delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => viewOrderDetails(order)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="IN_TRANSIT">In Transit</option>
                        <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Order Details</h2>
                    <p className="text-blue-100">Order #{selectedOrder.orderNumber}</p>
                  </div>
                  <button
                    onClick={closeOrderModal}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                {/* Order Status Banner */}
                <div className={`rounded-xl p-4 mb-6 ${
                  selectedOrder.status === 'DELIVERED' ? 'bg-green-50 border border-green-200' :
                  selectedOrder.status === 'SHIPPED' ? 'bg-blue-50 border border-blue-200' :
                  selectedOrder.status === 'CANCELLED' ? 'bg-red-50 border border-red-200' :
                  'bg-amber-50 border border-amber-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedOrder.status === 'DELIVERED' ? 'bg-green-500' :
                        selectedOrder.status === 'SHIPPED' ? 'bg-blue-500' :
                        selectedOrder.status === 'CANCELLED' ? 'bg-red-500' :
                        'bg-amber-500'
                      }`}>
                        {selectedOrder.status === 'DELIVERED' ? <CheckCircle className="h-6 w-6 text-white" /> :
                         selectedOrder.status === 'SHIPPED' ? <Truck className="h-6 w-6 text-white" /> :
                         <Package className="h-6 w-6 text-white" />}
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          selectedOrder.status === 'DELIVERED' ? 'text-green-800' :
                          selectedOrder.status === 'SHIPPED' ? 'text-blue-800' :
                          selectedOrder.status === 'CANCELLED' ? 'text-red-800' :
                          'text-amber-800'
                        }`}>
                          {selectedOrder.status.replace('_', ' ')}
                        </h3>
                        <p className={`text-sm ${
                          selectedOrder.status === 'DELIVERED' ? 'text-green-600' :
                          selectedOrder.status === 'SHIPPED' ? 'text-blue-600' :
                          selectedOrder.status === 'CANCELLED' ? 'text-red-600' :
                          'text-amber-600'
                        }`}>
                          Order placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">₹{selectedOrder.totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{selectedOrder.paymentMethod.toUpperCase()}</div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Customer Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {selectedOrder.customer.firstName.charAt(0)}{selectedOrder.customer.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                          </div>
                          <div className="text-sm text-gray-500">Customer</div>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{selectedOrder.customer.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{selectedOrder.customer.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-green-600" />
                      Delivery Address
                    </h4>
                    <div className="space-y-2">
                      <div className="font-medium text-gray-900">{selectedOrder.deliveryAddress.fullName}</div>
                      <div className="text-gray-600">{selectedOrder.deliveryAddress.address}</div>
                      <div className="text-gray-600">
                        {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.pincode}
                      </div>
                      <div className="flex items-center text-gray-600 mt-3">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{selectedOrder.deliveryAddress.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-purple-600" />
                    Order Items ({selectedOrder.items.length} items)
                  </h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <ProductImage
                              src={item.product.images}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              fallbackIcon={
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <Package className="h-8 w-8 text-gray-400" />
                                </div>
                              }
                              fallbackText=""
                            />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 text-lg">{item.product.name}</h5>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {item.product.category.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                Sold by <span className="font-medium">{item.seller.businessName}</span>
                              </span>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Quantity:</span>
                                <span className="ml-2 font-medium text-gray-900">{item.quantity}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Unit Price:</span>
                                <span className="ml-2 font-medium text-gray-900">₹{item.price.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">Total</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900">Order Total</span>
                      <span className="text-2xl font-bold text-green-600">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">Payment Method</span>
                      <span className="text-sm font-medium text-gray-900">{selectedOrder.paymentMethod.toUpperCase()}</span>
                    </div>
                    {selectedOrder.estimatedDelivery && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">Expected Delivery</span>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
