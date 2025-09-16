'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  MapPin,
  Truck,
  CreditCard,
  Shield,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cartApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

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

interface CartSummary {
  subtotal: number
  delivery: number
  tax: number
  total: number
}

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [summary, setSummary] = useState<CartSummary>({
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
      console.log('🔍 Cart API Response:', items)
      console.log('🔍 Items length:', items?.length)
      console.log('🔍 First item:', items?.[0])
      setCartItems(items)
      calculateSummary(items)
    } catch (error) {
      console.error('Error loading cart:', error)
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const calculateSummary = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const delivery = subtotal > 1000 ? 0 : 50 // Free delivery above ₹1000
    const tax = subtotal * 0.18 // 18% GST
    const total = subtotal + delivery + tax

    setSummary({ subtotal, delivery, tax, total })
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdating(itemId)
    try {
      await cartApi.updateItem(itemId, { quantity: newQuantity })
      
      setCartItems(prev => {
        const updated = prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
        calculateSummary(updated)
        return updated
      })
      
      toast.success('Cart updated')
    } catch (error) {
      console.error('Error updating cart:', error)
      toast.error('Failed to update cart')
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (itemId: string) => {
    setUpdating(itemId)
    try {
      await cartApi.removeItem(itemId)
      
      setCartItems(prev => {
        const updated = prev.filter(item => item.id !== itemId)
        calculateSummary(updated)
        return updated
      })
      
      toast.success('Item removed from cart')
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error('Failed to remove item')
    } finally {
      setUpdating(null)
    }
  }

  const clearCart = async () => {
    try {
      await cartApi.clear()
      setCartItems([])
      calculateSummary([])
      toast.success('Cart cleared')
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('Failed to clear cart')
    }
  }

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    router.push('/customer/checkout')
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
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <Link href="/customer">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.images[0] || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 line-clamp-2">
                                {item.product.name}
                              </h3>
                              <Badge className="mt-1 bg-primary-500 text-white">
                                {item.product.category.name}
                              </Badge>
                              
                              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{item.seller.businessName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Truck className="h-4 w-4" />
                                  <span>{item.estimatedDelivery}</span>
                                </div>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right ml-4">
                              <div className="text-lg font-bold text-primary-600">
                                {formatPrice(item.price)}
                              </div>
                              <div className="text-sm text-gray-500">
                                per item
                              </div>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={updating === item.id || item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-16 text-center border-0 focus:ring-0"
                                min="1"
                                disabled={updating === item.id}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={updating === item.id}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">
                                  {formatPrice(item.price * item.quantity)}
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                disabled={updating === item.id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Clear Cart Button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>{formatPrice(summary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery</span>
                      <span>
                        {summary.delivery === 0 ? (
                          <span className="text-green-600 font-medium">FREE</span>
                        ) : (
                          formatPrice(summary.delivery)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (GST 18%)</span>
                      <span>{formatPrice(summary.tax)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(summary.total)}</span>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {summary.delivery > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Add {formatPrice(1000 - summary.subtotal)} more for free delivery!
                      </p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <Button
                    onClick={proceedToCheckout}
                    className="w-full"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>

                  {/* Security Features */}
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Easy Returns</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="h-4 w-4 text-green-500" />
                      <span>Fast Delivery</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
