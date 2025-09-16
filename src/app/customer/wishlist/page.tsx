'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowLeft,
  Star,
  MapPin,
  Truck,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { wishlistApi, cartApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    description: string
    images: string[]
    price: number
    category: {
      name: string
    }
    seller: {
      businessName: string
      businessAddress: string
    }
    stock: number
    rating: number
    reviewCount: number
  }
  addedAt: string
}

export default function WishlistPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadWishlist()
    } else {
      router.push('/auth/login')
    }
  }, [user])

  const loadWishlist = async () => {
    try {
      const items = await wishlistApi.getItems()
      console.log('🔍 Wishlist API Response:', items)
      console.log('🔍 Items length:', items?.length)
      console.log('🔍 First item:', items?.[0])
      setWishlistItems(items)
    } catch (error) {
      console.error('Error loading wishlist:', error)
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    setRemoving(productId)
    try {
      await wishlistApi.removeItem(productId)
      setWishlistItems(prev => prev.filter(item => item.product.id !== productId))
      
      // Trigger a custom event to update header counts
      const updatedWishlist = await wishlistApi.getItems()
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
        detail: { count: updatedWishlist.length } 
      }))
      
      toast.success('Removed from wishlist')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    } finally {
      setRemoving(null)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      await cartApi.addItem({ productId, quantity: 1 })
      
      // Update cart count in header
      const updatedCart = await cartApi.getItems()
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { count: Array.isArray(updatedCart) ? updatedCart.length : 0 } 
      }))
      
      toast.success('Added to cart successfully!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    }
  }

  const moveAllToCart = async () => {
    try {
      const promises = wishlistItems.map(item => 
        cartApi.addItem({ productId: item.product.id, quantity: 1 })
      )
      await Promise.all(promises)
      
      // Update cart count in header
      const updatedCart = await cartApi.getItems()
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { count: Array.isArray(updatedCart) ? updatedCart.length : 0 } 
      }))
      
      toast.success('All items added to cart successfully!')
    } catch (error) {
      console.error('Error adding all to cart:', error)
      toast.error('Failed to add all items to cart')
    }
  }

  const clearWishlist = async () => {
    try {
      await wishlistApi.clear()
      setWishlistItems([])
      
      // Trigger a custom event to update header counts
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
        detail: { count: 0 } 
      }))
      
      toast.success('Wishlist cleared successfully')
    } catch (error) {
      console.error('Error clearing wishlist:', error)
      toast.error('Failed to clear wishlist')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  My Wishlist
                </h1>
                <p className="text-gray-600 mt-1">
                  {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>

            {wishlistItems.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={moveAllToCart}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Move All to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={clearWishlist}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save items you love to your wishlist</p>
            <Link href="/customer">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <Link href={`/customer/products/${item.product.id}`}>
                        <Image
                          src={item.product.images[0] || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      </Link>
                      
                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={() => removeFromWishlist(item.product.id)}
                        disabled={removing === item.product.id}
                        className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
                      >
                        <Heart className="h-5 w-5 text-red-500 fill-current" />
                      </button>

                      {/* Category Badge */}
                      <Badge className="absolute top-3 left-3 bg-primary-500 text-white">
                        {item.product.category.name}
                      </Badge>

                      {/* Stock Status */}
                      {item.product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge className="bg-red-500 text-white">Out of Stock</Badge>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link href={`/customer/products/${item.product.id}`}>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors cursor-pointer">
                          {item.product.name}
                        </h3>
                      </Link>

                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {item.product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                          {renderStars(item.product.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({item.product.reviewCount})
                        </span>
                      </div>

                      {/* Seller Info */}
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{item.product.seller.businessName}</span>
                      </div>

                      {/* Price and Actions */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-xl font-bold text-primary-600">
                              {formatPrice(item.product.price)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.product.stock > 0 ? `${item.product.stock} in stock` : 'Out of stock'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => addToCart(item.product.id)}
                            disabled={item.product.stock === 0}
                            className="flex-1 flex items-center gap-1"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromWishlist(item.product.id)}
                            disabled={removing === item.product.id}
                            className="text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Added Date */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
