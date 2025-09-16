'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Smartphone, 
  Laptop, 
  Shirt, 
  Home, 
  Gamepad2, 
  Book, 
  Car, 
  Heart,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { categoriesApi } from '@/lib/api'

const defaultCategories = [
  {
    id: '1',
    name: 'Electronics',
    icon: Smartphone,
    image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg',
    productCount: '2.5K+',
    color: 'from-blue-500 to-purple-600',
    description: 'Latest gadgets & tech'
  },
  {
    id: '2',
    name: 'Computers',
    icon: Laptop,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
    productCount: '1.8K+',
    color: 'from-purple-500 to-pink-600',
    description: 'Laptops & accessories'
  },
  {
    id: '3',
    name: 'Fashion',
    icon: Shirt,
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
    productCount: '5.2K+',
    color: 'from-pink-500 to-rose-600',
    description: 'Trending styles'
  },
  {
    id: '4',
    name: 'Home & Garden',
    icon: Home,
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    productCount: '3.1K+',
    color: 'from-green-500 to-teal-600',
    description: 'Home essentials'
  },
  {
    id: '5',
    name: 'Gaming',
    icon: Gamepad2,
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
    productCount: '890+',
    color: 'from-orange-500 to-red-600',
    description: 'Gaming gear'
  },
  {
    id: '6',
    name: 'Books',
    icon: Book,
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
    productCount: '1.2K+',
    color: 'from-indigo-500 to-blue-600',
    description: 'Knowledge & stories'
  },
  {
    id: '7',
    name: 'Automotive',
    icon: Car,
    image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
    productCount: '650+',
    color: 'from-gray-500 to-gray-700',
    description: 'Car accessories'
  },
  {
    id: '8',
    name: 'Health & Beauty',
    icon: Heart,
    image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg',
    productCount: '2.1K+',
    color: 'from-rose-500 to-pink-600',
    description: 'Wellness products'
  },
]

export function FeaturedCategories() {
  const [categories, setCategories] = useState(defaultCategories)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoriesApi.getAll()
        if (data && data.length > 0) {
          // Map API data to our format, keeping default icons and colors
          const mappedCategories = data.slice(0, 8).map((cat: any, index: number) => ({
            ...defaultCategories[index % defaultCategories.length],
            id: cat.id,
            name: cat.name,
            description: cat.description || defaultCategories[index % defaultCategories.length].description,
            image: cat.imageUrl || defaultCategories[index % defaultCategories.length].image,
          }))
          setCategories(mappedCategories)
        }
      } catch (error) {
        console.error('Error loading categories:', error)
        // Keep default categories on error
      }
    }

    loadCategories()
  }, [])

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
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
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
            Shop by Category
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Explore</span> Our Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover thousands of products across various categories, 
            carefully curated from trusted sellers worldwide.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setHoveredCategory(category.id)}
                onHoverEnd={() => setHoveredCategory(null)}
                className="group"
              >
                <Link href={`/categories/${category.id}`}>
                  <Card className="relative overflow-hidden h-80 cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                      {/* Icon */}
                      <motion.div
                        animate={hoveredCategory === category.id ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4"
                      >
                        <IconComponent className="w-8 h-8" />
                      </motion.div>

                      {/* Category Info */}
                      <div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-white/90 mb-3 text-sm">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80 text-sm font-medium">
                            {category.productCount} Products
                          </span>
                          <motion.div
                            animate={hoveredCategory === category.id ? { x: 5 } : { x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={hoveredCategory === category.id ? { opacity: 1 } : { opacity: 0 }}
                      className="absolute inset-0 bg-white/10 backdrop-blur-sm"
                    />

                    {/* Floating Particles Effect */}
                    {hoveredCategory === category.id && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0, x: '50%', y: '50%' }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0, 1, 0],
                              x: `${50 + (Math.random() - 0.5) * 100}%`,
                              y: `${50 + (Math.random() - 0.5) * 100}%`,
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.2,
                              repeat: Infinity,
                            }}
                            className="absolute w-2 h-2 bg-white rounded-full"
                          />
                        ))}
                      </div>
                    )}
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* View All Categories Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/categories">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-400 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View All Categories
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}