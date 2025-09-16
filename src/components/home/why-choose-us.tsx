'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Truck, 
  CreditCard, 
  Headphones, 
  Award, 
  Users,
  Sparkles,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: Shield,
    title: '100% Secure Shopping',
    description: 'Your data and payments are protected with bank-level security encryption.',
    color: 'from-green-500 to-emerald-600',
    stats: '256-bit SSL',
    delay: 0.1
  },
  {
    icon: Truck,
    title: 'Fast & Free Delivery',
    description: 'Free shipping on orders over ₹499. Express delivery available.',
    color: 'from-blue-500 to-cyan-600',
    stats: '24-48 hours',
    delay: 0.2
  },
  {
    icon: CreditCard,
    title: 'Easy Returns',
    description: 'Hassle-free returns within 7 days. No questions asked policy.',
    color: 'from-purple-500 to-pink-600',
    stats: '7-day policy',
    delay: 0.3
  },
  {
    icon: Headphones,
    title: '24/7 Customer Support',
    description: 'Round-the-clock assistance from our dedicated support team.',
    color: 'from-orange-500 to-red-600',
    stats: 'Always available',
    delay: 0.4
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    description: 'All products are verified and come with quality assurance.',
    color: 'from-yellow-500 to-orange-600',
    stats: '100% verified',
    delay: 0.5
  },
  {
    icon: Users,
    title: 'Trusted by Millions',
    description: 'Join over 1 million satisfied customers who trust our platform.',
    color: 'from-indigo-500 to-purple-600',
    stats: '1M+ customers',
    delay: 0.6
  },
]

const stats = [
  { number: '1M+', label: 'Happy Customers', icon: Users },
  { number: '50K+', label: 'Products', icon: Award },
  { number: '1000+', label: 'Sellers', icon: Shield },
  { number: '99.9%', label: 'Uptime', icon: CheckCircle },
]

export function WhyChooseUs() {
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
    hidden: { opacity: 0, y: 30, scale: 0.9 },
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

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-primary-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200 to-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
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
            Why Choose Us
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Experience</span> the Difference
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to providing you with the best shopping experience 
            through our innovative features and exceptional service.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.label}
                variants={statsVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center"
              >
                <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <motion.h3
                      initial={{ scale: 1 }}
                      whileInView={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="text-3xl font-bold text-primary-600 mb-2"
                    >
                      {stat.number}
                    </motion.h3>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-8 relative">
                    {/* Background Gradient */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`} />
                    
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Stats Badge */}
                    <Badge variant="secondary" className="text-xs font-medium">
                      {feature.stats}
                    </Badge>

                    {/* Hover Effect */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 0.1 }}
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-lg`}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Shopping?
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join millions of satisfied customers and discover amazing products 
                from trusted sellers worldwide.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-600 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Shopping Now
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}