'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Heart, ShoppingCart, Star, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { productsApi, categoriesApi, wishlistApi, cartApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import Link from 'next/link'

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
  }
  stock: number
  rating?: number
  reviewCount?: number
  approvalStatus: string
  createdAt: string
}

interface Category {
  id: string
  name: string
  parentId?: string
}

interface FilterState {
  category: string
  minPrice: number
  maxPrice: number
  sortBy: 'price_asc' | 'price_desc' | 'rating' | 'newest'
}

export default function CustomerStorefront() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [cartCount, setCartCount] = useState(0)
  
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'newest'
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (user) {
      loadWishlistAndCart()
    }
  }, [user])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        productsApi.getApprovedProducts(),
        categoriesApi.getAll()
      ])
      
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const loadWishlistAndCart = async () => {
    try {
      const [wishlistData, cartData] = await Promise.all([
        wishlistApi.getItems(),
        cartApi.getItems()
      ])
      
      setWishlist(wishlistData.map((item: any) => item.productId))
      setCartCount(cartData.length)
    } catch (error) {
      console.error('Error loading wishlist/cart:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search functionality will be implemented
    console.log('Searching for:', searchQuery)
  }

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please login to add to wishlist')
      return
    }

    try {
      const isInWishlist = wishlist.includes(productId)
      
      if (isInWishlist) {
        await wishlistApi.removeItem(productId)
        setWishlist(prev => prev.filter(id => id !== productId))
        toast.success('Removed from wishlist')
      } else {
        await wishlistApi.addItem({ productId })
        setWishlist(prev => [...prev, productId])
        toast.success('Added to wishlist')
      }

      // Refresh wishlist data to update header count
      const updatedWishlist = await wishlistApi.getItems()
      setWishlist(updatedWishlist.map((item: any) => item.productId))
      
      // Trigger a custom event to update header counts
      window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
        detail: { count: updatedWishlist.length } 
      }))
      
    } catch (error) {
      console.error('Error updating wishlist:', error)
      toast.error('Failed to update wishlist')
    }
  }

  const addToCart = async (productId: string) => {
    if (!user) {
      toast.error('Please login to add to cart')
      return
    }

    try {
      await cartApi.addItem({ productId, quantity: 1 })
      
      // Update local cart count immediately
      setCartCount(prev => prev + 1)
      
      // Refresh cart data to ensure accuracy
      const updatedCart = await cartApi.getItems()
      setCartCount(Array.isArray(updatedCart) ? updatedCart.length : 0)
      
      // Trigger a custom event to update header counts
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { count: Array.isArray(updatedCart) ? updatedCart.length : 0 } 
      }))
      
      toast.success('Added to cart successfully!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filters.category || product.category.id === filters.category
    const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_asc':
        return a.price - b.price
      case 'price_desc':
        return b.price - a.price
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

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
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Centered Search Section */}
          <div className="text-center mb-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg bg-white shadow-sm"
                />
              </div>
            </form>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant={!filters.category ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                className="h-9 px-4 text-sm rounded-full"
              >
                All
              </Button>
              {categories.slice(0, 6).map((category) => (
                <Button
                  key={category.id}
                  variant={filters.category === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    category: prev.category === category.id ? '' : category.id 
                  }))}
                  className="h-9 px-4 text-sm rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Results Info */}
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-medium text-gray-900">
                {searchQuery ? `Search: "${searchQuery}"` : 'All Products'}
              </h2>
              <span className="text-sm text-gray-500">
                ({sortedProducts.length} products)
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Filters Button */}
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {(filters.category || filters.minPrice > 0 || filters.maxPrice < 10000) && (
                  <div className="w-2 h-2 bg-red-500 rounded-full ml-1"></div>
                )}
              </Button>
            </div>
          </div>

          {/* Clean Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 p-4 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-gray-900">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, category: '', minPrice: 0, maxPrice: 10000 }))}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Clear all
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) || 0 }))}
                        className="flex-1 text-sm"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice === 10000 ? '' : filters.maxPrice}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) || 10000 }))}
                        className="flex-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setFilters(prev => ({ ...prev, category: '', minPrice: 0, maxPrice: 10000 }))
              }}
              size="sm"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 bg-white overflow-hidden h-full rounded-xl shadow-sm">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Link href={`/customer/products/${product.id}`}>
                        <img
                          src={product.images[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </Link>
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                      >
                        <Heart
                          className={`h-4 w-4 transition-colors ${
                            wishlist.includes(product.id)
                              ? 'text-red-500 fill-current'
                              : 'text-gray-600 hover:text-red-400'
                          }`}
                        />
                      </button>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-white/90 text-gray-700 border-0 shadow-sm text-xs font-medium">
                          {product.category.name}
                        </Badge>
                      </div>

                      {/* Stock Indicator */}
                      {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="destructive" className="text-xs">
                            Only {product.stock} left
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <Link href={`/customer/products/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors mb-2 leading-tight">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {renderStars(product.rating || 0)}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">
                          {(product.rating || 0).toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({product.reviewCount || 0} reviews)
                        </span>
                      </div>

                      {/* Seller */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500">
                          Sold by <span className="font-medium text-gray-600">{product.seller.businessName}</span>
                        </p>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex-1">
                          <p className="text-xl font-bold text-gray-900 mb-1">
                            {formatPrice(product.price)}
                          </p>
                          <p className="text-xs text-green-600 font-medium">
                            {product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                          </p>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => addToCart(product.id)}
                          disabled={product.stock === 0}
                          className="ml-3 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-4 py-2"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add
                        </Button>
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