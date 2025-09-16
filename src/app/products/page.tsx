'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal,
  X,
  Star,
  Heart,
  ShoppingCart,
  MapPin,
  Clock
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils'
import { productsApi, categoriesApi, cartApi, wishlistApi } from '@/lib/api'
import { toast } from 'sonner'
import Link from 'next/link'

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
  }
  productSellers: Array<{
    id: string
    price: number
    discountedPrice?: number
    stock: number
    seller: {
      businessName: string
    }
  }>
  _count: {
    reviews: number
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [wishlistItems, setWishlistItems] = useState<string[]>([])

  useEffect(() => {
    loadProducts()
    loadCategories()
    loadWishlist()
  }, [selectedCategory, priceRange, sortBy])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      if (searchQuery) queryParams.append('q', searchQuery)
      if (selectedCategory) queryParams.append('category', selectedCategory)
      if (priceRange[0] > 0) queryParams.append('minPrice', priceRange[0].toString())
      if (priceRange[1] < 10000) queryParams.append('maxPrice', priceRange[1].toString())
      queryParams.append('sortBy', sortBy)

      const data = await productsApi.getAll(queryParams.toString())
      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll()
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadWishlist = async () => {
    try {
      const data = await wishlistApi.getItems()
      setWishlistItems(data?.map((item: any) => item.productId) || [])
    } catch (error) {
      console.error('Error loading wishlist:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadProducts()
  }

  const toggleWishlist = async (productId: string) => {
    try {
      if (wishlistItems.includes(productId)) {
        await wishlistApi.removeItem(productId)
        setWishlistItems(prev => prev.filter(id => id !== productId))
        toast.success('Removed from wishlist')
      } else {
        await wishlistApi.addItem(productId)
        setWishlistItems(prev => [...prev, productId])
        toast.success('Added to wishlist')
      }
    } catch (error) {
      toast.error('Failed to update wishlist')
    }
  }

  const addToCart = async (productSellerId: string) => {
    try {
      await cartApi.addItem(productSellerId, 1)
      toast.success('Added to cart')
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const getBestPrice = (productSellers: any[]) => {
    if (!productSellers.length) return null
    return productSellers.reduce((best, current) => {
      const currentPrice = current.discountedPrice || current.price
      const bestPrice = best.discountedPrice || best.price
      return currentPrice < bestPrice ? current : best
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setPriceRange([0, 10000])
    setSortBy('newest')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-1">Discover amazing products from trusted sellers</p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </form>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-sm"
                >
                  Clear All
                </Button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="text-sm"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h4 className="font-medium mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => {
                  const bestSeller = getBestPrice(product.productSellers)
                  if (!bestSeller) return null

                  const isWishlisted = wishlistItems.includes(product.id)
                  const discountPercentage = calculateDiscountPercentage(
                    bestSeller.price, 
                    bestSeller.discountedPrice
                  )

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="group hover:shadow-lg transition-all duration-300">
                        <Link href={`/products/${product.slug}`}>
                          <div className="relative overflow-hidden">
                            <img
                              src={product.images[0] || '/placeholder-product.jpg'}
                              alt={product.name}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {discountPercentage > 0 && (
                              <Badge className="absolute top-2 left-2 bg-red-500">
                                -{discountPercentage}%
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.preventDefault()
                                toggleWishlist(product.id)
                              }}
                            >
                              <Heart 
                                className={`w-4 h-4 ${
                                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
                                }`} 
                              />
                            </Button>
                          </div>
                        </Link>

                        <CardContent className="p-4">
                          <div className="mb-2">
                            <Badge variant="outline" className="text-xs">
                              {product.category.name}
                            </Badge>
                          </div>
                          
                          <Link href={`/products/${product.slug}`}>
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm ml-1">4.5</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              ({product._count.reviews} reviews)
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {bestSeller.seller.businessName}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-primary-600">
                                  {formatPrice(bestSeller.discountedPrice || bestSeller.price)}
                                </span>
                                {bestSeller.discountedPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(bestSeller.price)}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>2-3 days delivery</span>
                              </div>
                            </div>
                            
                            <Button
                              size="sm"
                              onClick={() => addToCart(bestSeller.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Add
                            </Button>
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
      </div>
    </div>
  )
}
