'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  User,
  Phone,
  Mail,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cartApi, ordersApi, api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import Image from 'next/image'
import RazorpayScript from '@/components/RazorpayScript'
import { getAuthToken } from '@/lib/auth'

interface CartItem {
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
  estimatedDelivery: string
}

interface DeliveryAddress {
  fullName: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  landmark?: string
}

interface PaymentMethod {
  type: 'cod' | 'card' | 'upi'
  details?: {
    cardNumber?: string
    expiryDate?: string
    cvv?: string
    upiId?: string
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [step, setStep] = useState<'address' | 'payment' | 'review'>('address')
  
  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'cod'
  })

  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    delivery: 0,
    tax: 0,
    total: 0
  })

  useEffect(() => {
    if (user) {
      loadCart()
    } else {
      router.push('/auth/login')
    }
  }, [user])

  const loadCart = async () => {
    try {
      const items = await cartApi.getItems()
      if (items.length === 0) {
        toast.error('Your cart is empty')
        router.push('/customer/cart')
        return
      }
      
      setCartItems(items)
      calculateOrderSummary(items)
    } catch (error) {
      console.error('Error loading cart:', error)
      toast.error('Failed to load cart')
      router.push('/customer/cart')
    } finally {
      setLoading(false)
    }
  }

  const calculateOrderSummary = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const delivery = subtotal > 1000 ? 0 : 50
    const tax = subtotal * 0.18
    const total = subtotal + delivery + tax

    setOrderSummary({ subtotal, delivery, tax, total })
  }

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'address', 'city', 'state', 'pincode']
    return required.every(field => address[field as keyof DeliveryAddress].trim() !== '')
  }

  const validatePayment = () => {
    if (paymentMethod.type === 'card') {
      return paymentMethod.details?.cardNumber && 
             paymentMethod.details?.expiryDate && 
             paymentMethod.details?.cvv
    }
    if (paymentMethod.type === 'upi') {
      return paymentMethod.details?.upiId
    }
    return true // COD doesn't need validation
  }

  const handleNext = () => {
    if (step === 'address' && validateAddress()) {
      setStep('payment')
    } else if (step === 'payment' && validatePayment()) {
      setStep('review')
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const handlePlaceOrder = async () => {
    setProcessing(true)
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          sellerId: item.seller.id,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: address,
        paymentMethod: paymentMethod.type,
        totalAmount: orderSummary.total
      }

      const order = await ordersApi.createOrder(orderData)
      
      // Process payment if not COD
      if (paymentMethod.type !== 'cod') {
        await processPayment(order.id)
      }
      
      // Clear cart after successful order
      await cartApi.clear()
      
      toast.success('Order placed successfully!')
      router.push(`/customer/orders/${order.id}`)
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const processPayment = async (orderId: string) => {
    setPaymentLoading(true)
    try {
      console.log('🔄 Starting payment process for order:', orderId)
      
      // Check if user is authenticated
      if (!user) {
        console.error('❌ User not authenticated')
        toast.error('Please login to continue with payment')
        router.push('/auth/login')
        return
      }
      
      // Create Razorpay order using API client
      const orderResponse = await api.post('/payment/create-order', {
        amount: orderSummary.total,
        currency: 'INR',
        receipt: `receipt_${orderId}`
      })
      console.log('📋 Razorpay order response:', orderResponse)
      
      if (!orderResponse.success) {
        throw new Error(orderResponse.error || 'Failed to create payment order')
      }

      const order = orderResponse.order

      // Check if using dummy Razorpay key for development
      if (order.id.startsWith('order_')) {
        console.log('🔧 Using mock payment flow for development')
        
        // Simulate payment success after a short delay
        setTimeout(async () => {
          try {
            // Mock payment response
            const mockPaymentResponse = {
              razorpay_payment_id: `pay_${Date.now()}`,
              razorpay_order_id: order.id,
              razorpay_signature: `sig_${Date.now()}`
            }
            
            console.log('💳 Mock payment response:', mockPaymentResponse)
            
            // Verify payment on backend using API client
            const verification = await api.post('/payment/verify', {
              paymentId: mockPaymentResponse.razorpay_payment_id,
              orderId: mockPaymentResponse.razorpay_order_id,
              signature: mockPaymentResponse.razorpay_signature
            })
            console.log('✅ Payment verification:', verification)
            
            if (verification.success && verification.verification.verified) {
              // Process payment in orders
              await ordersApi.processPayment(orderId, {
                paymentId: mockPaymentResponse.razorpay_payment_id,
                orderId: mockPaymentResponse.razorpay_order_id,
                signature: mockPaymentResponse.razorpay_signature
              })
              
              toast.success('Payment processed successfully!')
              console.log('🎉 Payment completed successfully')
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('❌ Payment verification error:', error)
            toast.error('Payment verification failed')
            throw error
          }
        }, 2000) // 2 second delay to simulate payment processing
        
        toast.info('Processing payment... (Development Mode)')
        return
      }

      // Check if Razorpay is loaded
      if (typeof (window as any).Razorpay === 'undefined') {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.')
      }

      // Configure Razorpay options
      const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag', // Razorpay test key
        amount: order.amount,
        currency: order.currency,
        name: 'E-commerce Store',
        description: `Order Payment - ${orderId.slice(-8)}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            console.log('💳 Payment response received:', response)
            
            // Verify payment on backend using API client
            const verification = await api.post('/payment/verify', {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            })
            console.log('✅ Payment verification:', verification)
            
            if (verification.success && verification.verification.verified) {
              // Process payment in orders
              await ordersApi.processPayment(orderId, {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              })
              
              toast.success('Payment processed successfully!')
              console.log('🎉 Payment completed successfully')
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (error) {
            console.error('❌ Payment verification error:', error)
            toast.error('Payment verification failed')
            throw error
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email || '',
          contact: address.phone
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            console.log('❌ Payment cancelled by user')
            toast.error('Payment cancelled by user')
          }
        },
        notes: {
          order_id: orderId,
          customer_name: address.fullName,
          customer_phone: address.phone
        }
      }

      console.log('🚀 Opening Razorpay checkout with options:', options)
      
      // Open Razorpay checkout
      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('❌ Payment processing error:', error)
      toast.error(`Payment processing failed: ${error.message}`)
      throw error
    } finally {
      setPaymentLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RazorpayScript />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-1">Complete your purchase</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-8">
              {[
                { key: 'address', label: 'Address', icon: MapPin },
                { key: 'payment', label: 'Payment', icon: CreditCard },
                { key: 'review', label: 'Review', icon: CheckCircle }
              ].map((stepItem, index) => {
                const Icon = stepItem.icon
                const isActive = step === stepItem.key
                const isCompleted = ['address', 'payment', 'review'].indexOf(step) > index
                
                return (
                  <div key={stepItem.key} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive || isCompleted
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {stepItem.label}
                    </span>
                    {index < 2 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        isCompleted ? 'bg-primary-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Address Form */}
            {step === 'address' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <Input
                          value={address.fullName}
                          onChange={(e) => setAddress(prev => ({ ...prev, fullName: e.target.value }))}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <Input
                          value={address.phone}
                          onChange={(e) => setAddress(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <Input
                        value={address.address}
                        onChange={(e) => setAddress(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter your complete address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <Input
                          value={address.city}
                          onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <Input
                          value={address.state}
                          onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))}
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode *
                        </label>
                        <Input
                          value={address.pincode}
                          onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value }))}
                          placeholder="Pincode"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Landmark (Optional)
                      </label>
                      <Input
                        value={address.landmark}
                        onChange={(e) => setAddress(prev => ({ ...prev, landmark: e.target.value }))}
                        placeholder="Nearby landmark"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Payment Method */}
            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { type: 'cod', label: 'Cash on Delivery', description: 'Pay when your order is delivered' },
                        { type: 'card', label: 'Credit/Debit Card', description: 'Pay securely with your card' },
                        { type: 'upi', label: 'UPI Payment', description: 'Pay using UPI apps like GPay, PhonePe' }
                      ].map((method) => (
                        <div
                          key={method.type}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            paymentMethod.type === method.type
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setPaymentMethod({ type: method.type as any })}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900">{method.label}</h3>
                              <p className="text-sm text-gray-600">{method.description}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              paymentMethod.type === method.type
                                ? 'border-primary-500 bg-primary-500'
                                : 'border-gray-300'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment Details */}
                    {paymentMethod.type === 'card' && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900">Card Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Card Number
                            </label>
                            <Input
                              placeholder="1234 5678 9012 3456"
                              onChange={(e) => setPaymentMethod(prev => ({
                                ...prev,
                                details: { ...prev.details, cardNumber: e.target.value }
                              }))}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Expiry Date
                            </label>
                            <Input
                              placeholder="MM/YY"
                              onChange={(e) => setPaymentMethod(prev => ({
                                ...prev,
                                details: { ...prev.details, expiryDate: e.target.value }
                              }))}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              CVV
                            </label>
                            <Input
                              placeholder="123"
                              onChange={(e) => setPaymentMethod(prev => ({
                                ...prev,
                                details: { ...prev.details, cvv: e.target.value }
                              }))}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod.type === 'upi' && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-gray-900">UPI Details</h4>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            UPI ID
                          </label>
                          <Input
                            placeholder="yourname@paytm"
                            onChange={(e) => setPaymentMethod(prev => ({
                              ...prev,
                              details: { ...prev.details, upiId: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Review Order */}
            {step === 'review' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Review Your Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Delivery Address */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">{address.fullName}</p>
                        <p className="text-gray-600">{address.address}</p>
                        <p className="text-gray-600">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-gray-600">Phone: {address.phone}</p>
                        {address.landmark && (
                          <p className="text-gray-600">Landmark: {address.landmark}</p>
                        )}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">
                          {paymentMethod.type === 'cod' && 'Cash on Delivery'}
                          {paymentMethod.type === 'card' && 'Credit/Debit Card'}
                          {paymentMethod.type === 'upi' && 'UPI Payment'}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.product.images[0] || '/placeholder-product.jpg'}
                                alt={item.product.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              <p className="text-sm text-gray-600">Seller: {item.seller.businessName}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (step === 'payment') setStep('address')
                  if (step === 'review') setStep('payment')
                }}
                disabled={step === 'address'}
              >
                Previous
              </Button>
              
              {step === 'review' ? (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={processing || paymentLoading}
                  className="flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing Order...
                    </>
                  ) : paymentLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Opening Payment...
                    </>
                  ) : (
                    <>
                      Place Order
                      <Shield className="h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>{formatPrice(orderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span>
                      {orderSummary.delivery === 0 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        formatPrice(orderSummary.delivery)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST 18%)</span>
                    <span>{formatPrice(orderSummary.tax)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(orderSummary.total)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-green-500" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Easy Returns</span>
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
