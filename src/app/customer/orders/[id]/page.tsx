'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ordersApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
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
    businessPhone: string
    businessEmail: string
  }
  quantity: number
  price: number
}

interface DeliveryTracking {
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED'
  estimatedDelivery: string
  trackingNumber: string
  carrier: string
  updates: Array<{
    status: string
    timestamp: string
    location: string
    description: string
  }>
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
    landmark?: string
  }
  paymentMethod: 'cod' | 'card' | 'upi'
  totalAmount: number
  createdAt: string
  deliveryTracking?: DeliveryTracking
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

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadOrder()
    }
  }, [params.id])

  const loadOrder = async () => {
    try {
      const orderData = await ordersApi.getById(params.id as string)
      setOrder(orderData)
      
      // If order doesn't have tracking info, generate mock tracking
      if (!orderData.deliveryTracking) {
        const mockTracking = generateMockTracking(orderData)
        setOrder(prev => prev ? { ...prev, deliveryTracking: mockTracking } : null)
      }
    } catch (error) {
      console.error('Error loading order:', error)
      toast.error('Failed to load order details')
      router.push('/customer/orders')
    } finally {
      setLoading(false)
    }
  }

  const refreshTracking = async () => {
    if (!order) return
    
    setRefreshing(true)
    try {
      // Mock API call to refresh tracking
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedTracking = generateMockTracking(order)
      setOrder(prev => prev ? { ...prev, deliveryTracking: updatedTracking } : null)
      
      toast.success('Tracking information updated')
    } catch (error) {
      console.error('Error refreshing tracking:', error)
      toast.error('Failed to refresh tracking')
    } finally {
      setRefreshing(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!order) return
    
    // Check if order can be cancelled (before shipment)
    const cancellableStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING']
    if (!cancellableStatuses.includes(order.status)) {
      toast.error('Product has been shipped and cannot be cancelled')
      return
    }
    
    setCancelling(true)
    try {
      await ordersApi.cancelOrder(order.id)
      toast.success('Order cancelled and removed successfully')
      // Redirect to orders page immediately since order is deleted
      router.push('/customer/orders')
    } catch (error: any) {
      console.error('Error cancelling order:', error)
      toast.error(error.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  const generateMockTracking = (order: Order): DeliveryTracking => {
    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED']
    const currentStatusIndex = Math.min(statuses.indexOf(order.status), statuses.length - 1)
    const currentStatus = statuses[currentStatusIndex] as any

    const carriers = ['Blue Dart', 'DTDC', 'Delhivery', 'Ecom Express', 'XpressBees']
    const trackingNumber = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const updates = [
      {
        status: 'PENDING',
        timestamp: order.createdAt,
        location: 'Order Center',
        description: 'Order placed successfully'
      }
    ]

    if (currentStatusIndex >= 1) {
      updates.push({
        status: 'CONFIRMED',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Order Center',
        description: 'Order confirmed and payment verified'
      })
    }

    if (currentStatusIndex >= 2) {
      updates.push({
        status: 'PROCESSING',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Warehouse',
        description: 'Order is being prepared for shipment'
      })
    }

    if (currentStatusIndex >= 3) {
      updates.push({
        status: 'SHIPPED',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        location: 'Origin Hub',
        description: 'Package has been shipped'
      })
    }

    if (currentStatusIndex >= 4) {
      updates.push({
        status: 'IN_TRANSIT',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        location: 'Transit Hub',
        description: 'Package is in transit to destination'
      })
    }

    if (currentStatusIndex >= 5) {
      updates.push({
        status: 'OUT_FOR_DELIVERY',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: 'Local Hub',
        description: 'Package is out for delivery'
      })
    }

    if (currentStatusIndex >= 6) {
      updates.push({
        status: 'DELIVERED',
        timestamp: new Date().toISOString(),
        location: order.deliveryAddress.city,
        description: 'Package has been delivered successfully'
      })
    }

    return {
      status: currentStatus,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      trackingNumber,
      carrier: carriers[Math.floor(Math.random() * carriers.length)],
      updates: updates.reverse()
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
          <Button onClick={() => router.push('/customer/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  const statusConfig = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]

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
                  Order Tracking
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Order #{order.orderNumber || order.id.slice(-8)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${statusConfig.color} px-4 py-2 rounded-full font-semibold text-sm`}>
                {statusConfig.label}
              </Badge>
              <Button
                onClick={refreshTracking}
                disabled={refreshing}
                variant="outline"
                className="flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white rounded-full shadow-md">
                    {getStatusIcon(order.status)}
                  </div>
                  Order Status & Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Badge className={`${statusConfig.color} px-4 py-2 rounded-full font-semibold text-sm`}>
                      {statusConfig.label}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Placed on {formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
                    <p className="text-sm text-gray-500">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                  </div>
                </div>

                {order.deliveryTracking && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Package className="h-5 w-5 text-blue-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-600">Tracking Number</p>
                        </div>
                        <p className="font-mono font-bold text-lg text-gray-900">{order.deliveryTracking.trackingNumber}</p>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Truck className="h-5 w-5 text-green-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-600">Carrier</p>
                        </div>
                        <p className="font-bold text-lg text-gray-900">{order.deliveryTracking.carrier}</p>
                      </div>
                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <Calendar className="h-5 w-5 text-orange-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-600">Expected Delivery</p>
                        </div>
                        <p className="font-bold text-lg text-gray-900">{new Date(order.deliveryTracking.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>

                    {/* Enhanced Tracking Timeline */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <h4 className="text-lg font-semibold text-gray-900">Tracking Timeline</h4>
                      </div>
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500 to-gray-300"></div>
                        
                        <div className="space-y-6">
                          {order.deliveryTracking.updates.map((update, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="relative flex gap-6 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex-shrink-0 relative z-10">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                                  index === 0 
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
                                }`}>
                                  {getStatusIcon(update.status)}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <p className="font-semibold text-gray-900 text-lg">{update.description}</p>
                                  <Badge className={index === 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}>
                                    {new Date(update.timestamp).toLocaleDateString('en-IN', { 
                                      month: 'short', 
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  <p className="text-sm">{update.location}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Order Items */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white rounded-full shadow-md">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                        <Image
                          src={item.product.images[0] || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg leading-tight">{item.product.name}</h4>
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
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{order.deliveryAddress.fullName}</p>
                  <p className="text-gray-600">{order.deliveryAddress.address}</p>
                  <p className="text-gray-600">
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                  </p>
                  <p className="text-gray-600">Phone: {order.deliveryAddress.phone}</p>
                  {order.deliveryAddress.landmark && (
                    <p className="text-gray-600">Landmark: {order.deliveryAddress.landmark}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">
                      {order.paymentMethod === 'cod' && 'Cash on Delivery'}
                      {order.paymentMethod === 'card' && 'Credit/Debit Card'}
                      {order.paymentMethod === 'upi' && 'UPI Payment'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-lg">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Contact */}
            {order.items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Seller Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-sm">{item.seller.businessName}</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            <span>{item.seller.businessPhone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{item.seller.businessEmail}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Support & Actions */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-red-50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white rounded-full shadow-md">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  Order Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start gap-3 py-3 hover:bg-blue-50 transition-colors">
                    <Phone className="h-4 w-4" />
                    Contact Support
                  </Button>
                  
                  {order.status === 'DELIVERED' && (
                    <Button variant="outline" className="w-full justify-start gap-3 py-3 hover:bg-orange-50 transition-colors">
                      <Package className="h-4 w-4" />
                      Request Return
                    </Button>
                  )}
                  
                  {/* Cancel Order Button with Smart Logic */}
                  {['PENDING', 'CONFIRMED', 'PROCESSING'].includes(order.status) ? (
                    <Button 
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                      className="w-full justify-start gap-3 py-3 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {cancelling ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          Cancel Order
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                      <p className="text-gray-600 text-sm">Product has been shipped and cannot be cancelled</p>
                    </div>
                  )}
                  
                  {/* Order Status Info */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">Order Status Info</h5>
                    <p className="text-blue-700 text-sm">
                      {order.status === 'PENDING' && 'Your order is being processed. You can cancel it anytime.'}
                      {order.status === 'CONFIRMED' && 'Your order has been confirmed. You can still cancel it.'}
                      {order.status === 'PROCESSING' && 'Your order is being prepared for shipment. Last chance to cancel.'}
                      {['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(order.status) && 'Your order has been shipped and is on its way to you.'}
                      {order.status === 'DELIVERED' && 'Your order has been successfully delivered.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
