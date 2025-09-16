'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Eye, 
  Zap,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductImage } from '@/components/ui/product-image'
import { formatPrice, calculateDiscountPercentage } from '@/lib/utils'
import { productsApi, cartApi, wishlistApi } from '@/lib/api'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  images: string[]
  category: {
    name: string
  }
  seller: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

const defaultProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'Latest iPhone with advanced camera system and A17 Pro chip',
    price: 1299,
    stock: 10,
    images: ['https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg'],
    category: { name: 'Electronics' },
    seller: {
      id: '1',
      firstName: 'Tech',
      lastName: 'Store',
      email: 'tech@store.com'
    }
  },
  {
    id: '2',
    name: 'MacBook Pro 16"',
    description: 'Powerful laptop for professionals with M3 chip',
    price: 2499,
    stock: 5,
    images: ['https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg'],
    category: { name: 'Computers' },
    seller: {
      id: '2',
      firstName: 'Tech',
      lastName: 'Store',
      email: 'tech@store.com'
    }
  },
  {
    id: '3',
    name: 'Designer Jacket',
    description: 'Premium quality jacket for all seasons',
    price: 199,
    stock: 15,
    images: ['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'],
    category: { name: 'Fashion' },
    seller: {
      id: '3',
      firstName: 'Fashion',
      lastName: 'Hub',
      email: 'fashion@hub.com'
    }
  },
  {
    id: '4',
    name: 'Gaming Headset',
    description: 'High-quality gaming headset with surround sound',
    price: 89,
    stock: 20,
    images: ['https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg'],
    category: { name: 'Gaming' },
    seller: {
      id: '4',
      firstName: 'Game',
      lastName: 'Store',
      email: 'game@store.com'
    }
  }
]

const tabs = [
  { id: 'featured', label: 'Featured', icon: Sparkles },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'new', label: 'New Arrivals', icon: Clock },
  { id: 'deals', label: 'Best Deals', icon: Zap },
]

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('featured')
  const [products, setProducts] = useState<Product[]>(defaultProducts)
  const [loading, setLoading] = useState(false)
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadProducts()
  }, [activeTab])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await productsApi.getAll({ limit: 8 })
      if (data && data.length > 0) {
        setProducts(data)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToWishlist = async (productId: string) => {
    try {
      if (wishlistItems.has(productId)) {
        await wishlistApi.removeItem(productId)
        setWishlistItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(productId)
          return newSet
        })
        toast.success('Removed from wishlist')
      } else {
        await wishlistApi.addItem(productId)
        setWishlistItems(prev => new Set(prev).add(productId))
        toast.success('Added to wishlist')
      }
    } catch (error) {
      toast.error('Please login to add to wishlist')
    }
  }

  const handleAddToCart = async (product: Product) => {
    try {
      const seller = product.sellers[0]
      await cartApi.addItem({
        productId: product.id,
        productSellerId: seller.id,
        quantity: 1
      })
      toast.success('Added to cart')
    } catch (error) {
      toast.error('Please login to add to cart')
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="gradient" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Handpicked for You
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Featured</span> Products
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully selected products from trusted sellers, 
            featuring the latest trends and best deals.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-600 to-primary-400 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.map((product, index) => {
              const seller = product.seller
              const hasDiscount = false // No discount functionality in current API
              const discountPercentage = 0
              const isInWishlist = wishlistItems.has(product.id)

              return (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                      <Link href={`/products/${product.id}`}>
                        <ProductImage
                          src={product.images}
                          alt={product.name}
                          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                          fallbackText="Product Image"
                        />
                      </Link>
                      
                      {/* Discount Badge */}
                      {hasDiscount && (
                        <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                          -{discountPercentage}%
                        </Badge>
                      )}

                      {/* Category Badge */}
                      <Badge variant="secondary" className="absolute top-4 right-4">
                        {product.category.name}
                      </Badge>

                      {/* Quick Actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddToWishlist(product.id)}
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                            isInWishlist 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                        </motion.button>
                        
                        <Link href={`/products/${product.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-12 bg-white text-gray-700 rounded-full flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>
                        </Link>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddToCart(product)}
                          className="w-12 h-12 bg-white text-gray-700 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Brand */}
                      <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                      
                      {/* Product Name */}
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-lg mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">(4.0)</span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-primary-600">
                          {formatPrice(product.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-lg text-gray-400 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      
                      {/* Seller */}
                      <p className="text-sm text-gray-500 mb-4">
                        by {seller?.firstName} {seller?.lastName}
                      </p>
                      
                      {/* Add to Cart Button */}
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full group"
                        variant="gradient"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                        <motion.div
                          className="ml-2"
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.div>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* View All Products Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-400 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View All Products
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}