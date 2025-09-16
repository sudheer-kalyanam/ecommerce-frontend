'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowLeft,
  Eye,
  Calendar,
  MapPin,
  CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ordersApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

interface OrderItem {
  id: string
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
  }
  quantity: number
  price: number
}

interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED'
  items: OrderItem[]
  deliveryAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  paymentMethod: 'cod' | 'card' | 'upi'
  totalAmount: number
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

const ORDER_STATUSES = {
  PENDING: { label: 'Order Placed', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  PROCESSING: { label: 'Processing', color: 'bg-purple-100 text-purple-800', icon: Package },
  SHIPPED: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  IN_TRANSIT: { label: 'In Transit', color: 'bg-orange-100 text-orange-800', icon: Truck },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: 'bg-green-100 text-green-800', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle }
}

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadOrders()
    } else {
      router.push('/auth/login')
    }
  }, [user])

  const loadOrders = async () => {
    try {
      const ordersData = await ordersApi.getOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusIcon = (status: string) => {
    const statusConfig = ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]
    const Icon = statusConfig?.icon || Clock
    return <Icon className="h-5 w-5" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2 hover:bg-gray-100 transition-colors px-4 py-2 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="h-7 w-7 text-blue-600" />
                  </div>
                  My Orders
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
                </p>
              </div>
            </div>
            {orders.length > 0 && (
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Active Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span>Completed</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="mb-8">
              <div className="text-8xl mb-6 filter drop-shadow-lg">📦</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">
              Start shopping to see your orders here
            </p>
            <Link href="/customer">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Package className="h-5 w-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, index) => {
              const statusConfig = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-2xl shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-white rounded-full shadow-md">
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900">
                              Order #{order.orderNumber || order.id.slice(-8)}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Placed on {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${statusConfig.color} px-4 py-2 rounded-full font-semibold text-sm`}>
                            {statusConfig.label}
                          </Badge>
                          <p className="text-2xl font-bold text-gray-900 mt-2">
                            {formatPrice(order.totalAmount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-8">
                      {/* Order Items */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-blue-600" />
                          <h4 className="text-lg font-semibold text-gray-900">Order Items</h4>
                        </div>
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                              <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                                <Image
                                  src={item.product.images[0] || '/placeholder-product.jpg'}
                                  alt={item.product.name}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 text-lg leading-tight">{item.product.name}</h5>
                                <Badge className="mt-2 bg-blue-100 text-blue-800 font-medium">
                                  {item.product.category.name}
                                </Badge>
                                <div className="mt-3 flex items-center gap-6 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    <span className="font-medium">Qty: {item.quantity}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>Seller: {item.seller.businessName}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {formatPrice(item.price)} each
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 pt-8 border-t border-gray-200">
                        {/* Delivery Address */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                          <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <MapPin className="h-5 w-5 text-green-600" />
                            </div>
                            Delivery Address
                          </h5>
                          <div className="space-y-2 text-gray-600">
                            <p className="font-semibold text-gray-900">{order.deliveryAddress.fullName}</p>
                            <p className="text-sm">{order.deliveryAddress.address}</p>
                            <p className="text-sm">{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
                            <p className="text-sm font-medium text-blue-600">📞 {order.deliveryAddress.phone}</p>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                          <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <CreditCard className="h-5 w-5 text-purple-600" />
                            </div>
                            Payment Method
                          </h5>
                          <div className="text-gray-600">
                            <div className="flex items-center gap-2">
                              {order.paymentMethod === 'cod' && (
                                <>
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <span className="font-medium">Cash on Delivery</span>
                                </>
                              )}
                              {order.paymentMethod === 'card' && (
                                <>
                                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                  <span className="font-medium">Credit/Debit Card</span>
                                </>
                              )}
                              {order.paymentMethod === 'upi' && (
                                <>
                                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                  <span className="font-medium">UPI Payment</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                          <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Truck className="h-5 w-5 text-orange-600" />
                            </div>
                            Delivery Info
                          </h5>
                          <div className="space-y-2 text-gray-600">
                            {order.estimatedDelivery && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-green-600" />
                                <p className="text-sm font-medium">Expected: {formatDate(order.estimatedDelivery)}</p>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <p className="text-sm">Updated: {formatDate(order.updatedAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-gray-200">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Order ID: {order.id.slice(-12)}</span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Link href={`/customer/orders/${order.id}`}>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Track Order
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
