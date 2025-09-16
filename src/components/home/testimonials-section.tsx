'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fashion Enthusiast',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    rating: 5,
    text: 'Amazing platform! I found exactly what I was looking for at great prices. The delivery was super fast and the quality exceeded my expectations.',
    product: 'Designer Handbag',
    verified: true
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Tech Professional',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    text: 'The electronics section is fantastic! Got my new laptop at an unbeatable price. Customer service was helpful throughout the process.',
    product: 'MacBook Pro',
    verified: true
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Home Decorator',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    rating: 5,
    text: 'Love the variety of home decor items available. The sellers are responsive and the quality is consistently good. Highly recommended!',
    product: 'Home Decor Set',
    verified: true
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Fitness Enthusiast',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    rating: 5,
    text: 'Great selection of fitness equipment and supplements. The comparison feature helped me find the best deals from different sellers.',
    product: 'Fitness Equipment',
    verified: true
  },
  {
    id: 5,
    name: 'Lisa Wang',
    role: 'Book Lover',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    rating: 5,
    text: 'The book collection is impressive! Found rare editions that I couldn\'t find elsewhere. The packaging was excellent and delivery was prompt.',
    product: 'Rare Books Collection',
    verified: true
  }
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-200 to-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="gradient" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Customer Reviews
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            What Our <span className="gradient-text">Customers</span> Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers 
            have to say about their shopping experience.
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-8 md:p-12 relative">
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center opacity-10">
                      <Quote className="w-8 h-8" />
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Avatar */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative"
                      >
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-xl">
                          <img
                            src={testimonials[currentIndex].avatar}
                            alt={testimonials[currentIndex].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {testimonials[currentIndex].verified && (
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 text-center md:text-left">
                        {/* Rating */}
                        <div className="flex justify-center md:justify-start items-center gap-1 mb-4">
                          {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ delay: i * 0.1, duration: 0.3 }}
                            >
                              <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            </motion.div>
                          ))}
                        </div>

                        {/* Testimonial Text */}
                        <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed italic">
                          "{testimonials[currentIndex].text}"
                        </blockquote>

                        {/* Customer Info */}
                        <div className="space-y-2">
                          <h4 className="text-xl font-bold text-gray-900">
                            {testimonials[currentIndex].name}
                          </h4>
                          <p className="text-gray-600">
                            {testimonials[currentIndex].role}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            Purchased: {testimonials[currentIndex].product}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center gap-3 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary-500 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Testimonial Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => goToTestimonial(index)}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="font-semibold">4.9/5 Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">50,000+ Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Verified Purchases</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}