'use client'

import { useEffect, useState } from 'react'

export default function RazorpayScript() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if Razorpay is already loaded
    if (typeof (window as any).Razorpay !== 'undefined') {
      setIsLoaded(true)
      return
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
    if (existingScript) {
      setIsLoaded(true)
      return
    }

    console.log('🔄 Loading Razorpay SDK...')
    
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    
    script.onload = () => {
      console.log('✅ Razorpay SDK loaded successfully')
      setIsLoaded(true)
    }
    
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay SDK')
    }
    
    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const scriptToRemove = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove)
      }
    }
  }, [])

  return null
}
