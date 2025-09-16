'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  MapPin, 
  Clock, 
  Truck, 
  Shield, 
  ArrowLeft,
  Minus,
  Plus,
  Check,
  X
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils'
import { productsApi, cartApi, wishlistApi, deliveryApi } from '@/lib/api'
import { toast } from 'sonner'

interface ProductSeller {
  id: string
  price: number
  discountedPrice?: number
  stock: number
  sku: string
  seller: {
    id: string
    businessName: string
    user: {
      firstName: string
      lastName: string
    }
  }
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  brand: string
  images: string[]
  category: {
    id: string
    name: string
    slug: string
  }
  productSellers: ProductSeller[]
  _count: {
    reviews: number
  }
}

interface DeliveryEstimate {
  pincode: string
  estimatedDays: number
  estimatedDate: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSeller, setSelectedSeller] = useState<ProductSeller | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [pincode, setPincode] = useState('')
  const [deliveryEstimate, setDeliveryEstimate] = useState<DeliveryEstimate | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showPincodeInput, setShowPincodeInput] = useState(false)

  useEffect(() => {
    if (slug) {
      loadProduct()
    }
  }, [slug])

  useEffect(() => {
    if (product && product.productSellers.length > 0) {
      setSelectedSeller(product.productSellers[0])
    }
  }, [product])

  useEffect(() => {
    if (product) {
      checkWishlistStatus()
    }
  }, [product])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const data = await productsApi.getBySlug(slug)
      setProduct(data)
    } catch (error) {
      console.error('Error loading product:', error)
      toast.error('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const checkWishlistStatus = async () => {
    if (!product) return
    
    try {
      const wishlistItems = await wishlistApi.getItems()
      const isInWishlist = wishlistItems?.some((item: any) => item.productId === product.id)
      setIsWishlisted(isInWishlist)
    } catch (error) {
      console.error('Error checking wishlist:', error)
    }
  }

  const toggleWishlist = async () => {
    if (!product) return

    try {
      if (isWishlisted) {
        await wishlistApi.removeItem(product.id)
        setIsWishlisted(false)
        toast.success('Removed from wishlist')
      } else {
        await wishlistApi.addItem(product.id)
        setIsWishlisted(true)
        toast.success('Added to wishlist')
      }
    } catch (error) {
      toast.error('Failed to update wishlist')
    }
  }

  const addToCart = async () => {
    if (!selectedSeller) return

    try {
      await cartApi.addItem(selectedSeller.id, quantity)
      toast.success('Added to cart')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const getDeliveryEstimate = async () => {
    if (!pincode || !selectedSeller) return

    try {
      const estimate = await deliveryApi.getEstimate({
        pincode,
        sellerId: selectedSeller.seller.id
      })
      setDeliveryEstimate(estimate)
    } catch (error) {
      console.error('Error getting delivery estimate:', error)
      toast.error('Failed to get delivery estimate')
    }
  }

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    getDeliveryEstimate()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const discountPercentage = selectedSeller 
    ? calculateDiscountPercentage(selectedSeller.price, selectedSeller.discountedPrice)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/categories/${product.category.slug}`} className="text-gray-500 hover:text-gray-700">
              {product.category.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-white">
              <Image
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative overflow-hidden rounded-lg border-2 ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category.name}</Badge>
                <Badge variant="outline">{product.brand}</Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">4.5</span>
                </div>
                <span className="text-gray-500">({product._count.reviews} reviews)</span>
              </div>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Sellers Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Available Sellers</h3>
              <div className="space-y-3">
                {product.productSellers.map((seller) => (
                  <Card 
                    key={seller.id} 
                    className={`cursor-pointer transition-all ${
                      selectedSeller?.id === seller.id 
                        ? 'ring-2 ring-primary-600 border-primary-600' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedSeller(seller)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{seller.seller.businessName}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div>
                              <span className="text-lg font-bold text-primary-600">
                                {formatPrice(seller.discountedPrice || seller.price)}
                              </span>
                              {seller.discountedPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  {formatPrice(seller.price)}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              Stock: {seller.stock}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {selectedSeller?.id === seller.id && (
                            <Check className="w-5 h-5 text-primary-600" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Delivery Estimate */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
              <div className="space-y-4">
                <form onSubmit={handlePincodeSubmit} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="flex-1"
                    maxLength={6}
                  />
                  <Button type="submit" disabled={!pincode || pincode.length !== 6}>
                    Check
                  </Button>
                </form>
                
                {deliveryEstimate && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <Truck className="w-5 h-5" />
                      <span className="font-medium">Delivery Available</span>
                    </div>
                    <p className="text-green-600 mt-1">
                      Estimated delivery: {deliveryEstimate.estimatedDays} days
                    </p>
                    <p className="text-sm text-green-600">
                      Expected by: {new Date(deliveryEstimate.estimatedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and Actions */}
            {selectedSeller && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(selectedSeller.stock, quantity + 1))}
                      disabled={quantity >= selectedSeller.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={addToCart}
                    className="flex-1"
                    disabled={selectedSeller.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={toggleWishlist}
                    className="px-4"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>

                {selectedSeller.stock === 0 && (
                  <p className="text-red-600 text-sm">Out of stock</p>
                )}
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm">Quality Assured</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
