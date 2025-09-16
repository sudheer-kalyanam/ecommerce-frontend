'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  MapPin, 
  Truck, 
  Shield, 
  ArrowLeft,
  Minus,
  Plus,
  CheckCircle,
  Clock,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { productsApi, wishlistApi, cartApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: {
    id: string
    name: string
  }
  seller: {
    id: string
    businessName: string
    businessAddress: string
    businessPhone: string
    businessEmail: string
  }
  stock: number
  rating?: number
  reviewCount?: number
  approvalStatus: string
  createdAt: string
  specifications?: Record<string, string>
}

interface SellerOffer {
  sellerId: string
  sellerName: string
  price: number
  stock: number
  estimatedDelivery: string
  sellerRating: number
  location: string
  pincode: string
  deliveryDate?: string
  deliveryFee: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [sellerOffers, setSellerOffers] = useState<SellerOffer[]>([])
  const [selectedSeller, setSelectedSeller] = useState<string>('')

  useEffect(() => {
    if (params.id) {
      loadProduct()
    }
  }, [params.id])

  useEffect(() => {
    if (user && product) {
      checkWishlistStatus()
    }
  }, [user, product])

  const loadProduct = async () => {
    try {
      const productData = await productsApi.getById(params.id as string)
      setProduct(productData)
      
      // Mock seller offers - in real app, this would come from API
      setSellerOffers([
        {
          sellerId: productData.seller.id,
          sellerName: productData.seller.businessName || 'Original Seller',
          price: productData.price,
          stock: productData.stock,
          estimatedDelivery: '2-3 days',
          sellerRating: 4.5,
          location: productData.seller.businessAddress || 'Delhi, India',
          pincode: '110001',
          deliveryFee: 0
        },
        {
          sellerId: 'seller-2',
          sellerName: 'TechStore Plus',
          price: productData.price * 0.95,
          stock: 15,
          estimatedDelivery: '1-2 days',
          sellerRating: 4.8,
          location: 'Mumbai, Maharashtra',
          pincode: '400001',
          deliveryFee: 0
        },
        {
          sellerId: 'seller-3',
          sellerName: 'ElectroHub',
          price: productData.price * 1.05,
          stock: 8,
          estimatedDelivery: '3-4 days',
          sellerRating: 4.2,
          location: 'Bangalore, Karnataka',
          pincode: '560001',
          deliveryFee: 0
        }
      ])
      
      setSelectedSeller(productData.seller.id)
    } catch (error) {
      console.error('Error loading product:', error)
      toast.error('Failed to load product')
      router.push('/customer')
    } finally {
      setLoading(false)
    }
  }

  const checkWishlistStatus = async () => {
    try {
      const wishlistItems = await wishlistApi.getItems()
      setIsInWishlist(wishlistItems.some((item: any) => item.productId === product?.id))
    } catch (error) {
      console.error('Error checking wishlist:', error)
    }
  }

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist')
      return
    }

    try {
      if (isInWishlist) {
        await wishlistApi.removeItem(product!.id)
        setIsInWishlist(false)
        toast.success('Removed from wishlist')
      } else {
        await wishlistApi.addItem({ productId: product!.id })
        setIsInWishlist(true)
        toast.success('Added to wishlist')
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
      toast.error('Failed to update wishlist')
    }
  }

  const addToCart = async () => {
    if (!user) {
      toast.error('Please login to add to cart')
      return
    }

    try {
      await cartApi.addItem({ 
        productId: product!.id, 
        quantity,
        sellerId: selectedSeller
      })
      toast.success('Added to cart')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    }
  }

  const buyNow = async () => {
    if (!user) {
      toast.error('Please login to continue')
      return
    }

    try {
      await cartApi.addItem({ 
        productId: product!.id, 
        quantity,
        sellerId: selectedSeller
      })
      router.push('/customer/cart')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    }
  }


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price)
  }

  const renderStars = (rating: number) => {
    const safeRating = rating || 0
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(safeRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link href="/customer">
            <Button>Back to Store</Button>
          </Link>
        </div>
      </div>
    )
  }

  const selectedOffer = sellerOffers.find(offer => offer.sellerId === selectedSeller)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 hover:bg-blue-50 transition-all duration-300 rounded-full px-4 py-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Store</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {product.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Product Images */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-2xl border border-white/50 group">
              <Image
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  {selectedImage + 1} / {product.images.length}
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                      selectedImage === index 
                        ? 'border-blue-500 shadow-blue-200 shadow-lg scale-105' 
                        : 'border-white/80 hover:border-blue-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Enhanced Basic Info */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {product.name}
                </h1>
                <button
                  onClick={toggleWishlist}
                  className="group p-3 hover:bg-red-50 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Heart
                    className={`h-6 w-6 transition-all duration-300 ${
                      isInWishlist 
                        ? 'text-red-500 fill-current animate-pulse' 
                        : 'text-gray-400 group-hover:text-red-400 group-hover:scale-110'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full shadow-lg">
                  {product.category.name}
                </Badge>
                <div className="flex items-center gap-1">
                  {renderStars(product.rating || 0)}
                  <span className="text-sm text-gray-600 ml-2 font-medium">
                    {(product.rating || 0).toFixed(1)} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-4 font-light">
                {product.description}
              </p>
              
              <div className="text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                <p>Sold by <span className="font-semibold text-blue-600">{product.seller.businessName}</span></p>
              </div>
            </div>

            {/* Enhanced Price */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6 shadow-lg">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  {selectedOffer ? formatPrice(selectedOffer.price) : formatPrice(product.price)}
                </span>
                {selectedOffer && selectedOffer.price < product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through opacity-70">
                      {formatPrice(product.price)}
                    </span>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full shadow-lg animate-pulse">
                      Save ₹{(product.price - selectedOffer.price).toFixed(2)}
                    </Badge>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className={`w-3 h-3 rounded-full shadow-lg ${
                  (selectedOffer?.stock || product.stock) > 0 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse' 
                    : 'bg-gradient-to-r from-red-400 to-red-500'
                }`}></div>
                <p className="text-sm font-medium text-gray-700">
                  {selectedOffer ? `${selectedOffer.stock} in stock` : `${product.stock} in stock`}
                </p>
                <Badge className="bg-white/80 text-green-700 text-xs">
                  ✓ Best Price Guaranteed
                </Badge>
              </div>
            </div>

            {/* Enhanced Quantity Selector */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">Quantity:</span>
                <div className="flex items-center bg-gradient-to-r from-gray-50 to-white border-2 border-blue-200 rounded-xl overflow-hidden shadow-inner">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 hover:bg-blue-50 transition-all duration-200 disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 text-center border-0 focus:ring-0 bg-transparent font-bold text-lg"
                    min="1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= (selectedOffer?.stock || product.stock)}
                    className="h-10 w-10 hover:bg-blue-50 transition-all duration-200 disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-right mt-2">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Total: {formatPrice((selectedOffer?.price || product.price) * quantity)}
                </span>
              </div>
            </div>


            {/* Enhanced Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={addToCart}
                className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-blue-300/50"
                disabled={!selectedOffer || selectedOffer.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                onClick={buyNow}
                className="flex-1 h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-orange-300/50"
                disabled={!selectedOffer || selectedOffer.stock === 0}
              >
                <Package className="h-5 w-5 mr-2" />
                Buy Now
              </Button>
            </div>

            {/* Enhanced Features */}
            
          </div>
        </div>

        {/* Multiple Sellers */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Seller</h2>
          
          <div className="space-y-3">
            {sellerOffers.map((offer) => (
              <div 
                key={offer.sellerId} 
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-blue-300 ${
                  selectedSeller === offer.sellerId 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`} 
                onClick={() => setSelectedSeller(offer.sellerId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {offer.sellerName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{offer.sellerName}</h3>
                        <div className="flex items-center gap-1">
                          {renderStars(offer.sellerRating)}
                          <span className="text-xs text-gray-500">({offer.sellerRating})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{offer.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        <span>{offer.estimatedDelivery}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        <span>{offer.stock} available</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-gray-900">
                      {formatPrice(offer.price)}
                    </div>
                    {selectedSeller === offer.sellerId && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-blue-600 font-medium">Selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
