'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Search, Sparkles, TrendingUp, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const heroSlides = [
  {
    id: 1,
    title: "Discover Amazing Products",
    subtitle: "From Trusted Sellers Worldwide",
    description: "Shop with confidence on our secure multi-vendor marketplace with over 10,000+ products",
    image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg",
    cta: "Start Shopping",
    badge: "New Arrivals",
    stats: "50K+ Happy Customers"
  },
  {
    id: 2,
    title: "Best Deals & Offers",
    subtitle: "Up to 70% Off on Electronics",
    description: "Limited time offers on smartphones, laptops, and gadgets from verified sellers",
    image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg",
    cta: "Shop Electronics",
    badge: "Limited Time",
    stats: "1000+ Products on Sale"
  },
  {
    id: 3,
    title: "Fashion & Lifestyle",
    subtitle: "Trending Styles for Everyone",
    description: "Discover the latest fashion trends and lifestyle products curated just for you",
    image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
    cta: "Explore Fashion",
    badge: "Trending",
    stats: "New Collections Weekly"
  }
]

const floatingElements = [
  { icon: Sparkles, delay: 0, x: 100, y: 50 },
  { icon: TrendingUp, delay: 0.5, x: -80, y: 100 },
  { icon: Shield, delay: 1, x: 120, y: -50 },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200 to-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Elements */}
      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.1, 
            scale: 1,
            x: [0, element.x, 0],
            y: [0, element.y, 0],
          }}
          transition={{ 
            delay: element.delay,
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute hidden lg:block"
          style={{ 
            left: `${20 + index * 30}%`, 
            top: `${30 + index * 20}%` 
          }}
        >
          <element.icon className="w-16 h-16 text-primary-300" />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Badge variant="gradient" className="mb-4 animate-bounce-in">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {heroSlides[currentSlide].badge}
                </Badge>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="gradient-text">
                    {heroSlides[currentSlide].title}
                  </span>
                  <br />
                  <span className="text-gray-700">
                    {heroSlides[currentSlide].subtitle}
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                  {heroSlides[currentSlide].description}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-primary-600 mb-8">
                  <TrendingUp className="w-4 h-4" />
                  <span>{heroSlides[currentSlide].stats}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative max-w-2xl mb-8"
            >
              <Input
                type="text"
                placeholder="Search for products, brands, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 text-lg pr-16 rounded-2xl border-2 border-gray-200 focus:border-primary-400 shadow-lg"
                icon={<Search className="w-6 h-6" />}
              />
              <Button
                type="submit"
                size="lg"
                className="absolute right-2 top-2 h-12 px-8 rounded-xl"
              >
                Search
              </Button>
            </motion.form>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="xl" variant="gradient" className="group">
                {heroSlides[currentSlide].cta}
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </Button>
              <Button size="xl" variant="outline" className="hover-lift">
                Browse Categories
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={heroSlides[currentSlide].image}
                  alt={heroSlides[currentSlide].title}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.7 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-6 gap-3">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-primary-500 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Floating Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">100% Secure</p>
                  <p className="text-sm text-gray-500">Trusted by millions</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">50K+</p>
                  <p className="text-sm text-gray-500">Happy customers</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}