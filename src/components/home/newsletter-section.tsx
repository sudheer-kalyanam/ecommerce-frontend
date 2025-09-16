'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Gift, Bell, Sparkles, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

const benefits = [
  {
    icon: Gift,
    title: 'Exclusive Deals',
    description: 'Get access to subscriber-only discounts and flash sales'
  },
  {
    icon: Bell,
    title: 'Early Access',
    description: 'Be the first to know about new products and collections'
  },
  {
    icon: Sparkles,
    title: 'Special Offers',
    description: 'Receive personalized offers based on your preferences'
  }
]

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true)
      setIsLoading(false)
      toast.success('Successfully subscribed to our newsletter!')
    }, 1500)
  }

  if (isSubscribed) {
    return (
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-400 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome to the Family! 🎉
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Thank you for subscribing! You'll receive exclusive deals and updates 
              straight to your inbox.
            </p>
            <Button
              onClick={() => setIsSubscribed(false)}
              variant="outline"
              className="bg-white text-primary-600 hover:bg-gray-100"
            >
              Subscribe Another Email
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-400 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-white/5 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              <Mail className="w-3 h-3 mr-1" />
              Newsletter
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Stay in the Loop with 
              <span className="block text-yellow-300">Exclusive Deals!</span>
            </h2>
            
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join over 100,000 subscribers and never miss out on amazing deals, 
              new arrivals, and exclusive offers from your favorite sellers.
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{benefit.title}</h3>
                      <p className="text-white/80">{benefit.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-white/80">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">100% Spam Free</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Unsubscribe Anytime</span>
              </div>
            </div>
          </motion.div>

          {/* Newsletter Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Get Exclusive Access
                  </h3>
                  <p className="text-gray-600">
                    Subscribe now and get 10% off your first order!
                  </p>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 text-lg pr-4 rounded-xl border-2 focus:border-primary-400"
                      icon={<Mail className="w-5 h-5" />}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    loading={isLoading}
                    className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-primary-600 to-primary-400 hover:from-primary-700 hover:to-primary-500 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe & Get 10% Off'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    By subscribing, you agree to our{' '}
                    <a href="/privacy" className="text-primary-600 hover:underline">
                      Privacy Policy
                    </a>{' '}
                    and{' '}
                    <a href="/terms" className="text-primary-600 hover:underline">
                      Terms of Service
                    </a>
                  </p>
                </div>

                {/* Social Proof */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-2">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                      </div>
                      <span className="ml-2">100K+ subscribers</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}