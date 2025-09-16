'use client'

import { motion } from 'framer-motion'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedCategories } from '@/components/home/featured-categories'
import { FeaturedProducts } from '@/components/home/featured-products'
import { WhyChooseUs } from '@/components/home/why-choose-us'
import { NewsletterSection } from '@/components/home/newsletter-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <WhyChooseUs />
      <TestimonialsSection />
      <NewsletterSection />
    </motion.div>
  )
}