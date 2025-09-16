'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OtpInput } from '@/components/ui/otp-input'
import { authApi, sellerRegistrationApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

function VerifyOtpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')

  const userId = searchParams.get('userId')
  const purpose = searchParams.get('purpose') || 'login'
  const email = searchParams.get('email') || ''
  const registrationDataParam = searchParams.get('registrationData')

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Clear error when OTP changes
  useEffect(() => {
    if (error) {
      setError('')
    }
  }, [otp])

  const validateOtp = (otpValue: string) => {
    if (!otpValue) {
      setError('OTP is required')
      return false
    }
    if (!/^\d{6}$/.test(otpValue)) {
      setError('OTP must be 6 digits')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateOtp(otp)) return

    setLoading(true)
    try {
      if (purpose === 'seller-registration') {
        // Handle seller registration OTP verification
        if (!email || !registrationDataParam) {
          toast.error('Invalid verification link')
          router.push('/auth/register')
          return
        }

        const registrationData = JSON.parse(decodeURIComponent(registrationDataParam))
        const response = await sellerRegistrationApi.verifyOTP({
          email,
          otp,
          registrationData
        }) as { message: string }
        
        toast.success(response.message)
        router.push('/auth/login?message=seller-registration-submitted')
      } else {
        // Handle regular auth OTP verification
        if (!userId) {
          toast.error('Invalid verification link')
          router.push('/auth/login')
          return
        }

        const response = await authApi.verifyOtp({
          userId,
          otpCode: otp,
          purpose
        }) as { access_token: string; user: any }
        
        if (response.access_token) {
          // Use the global auth context to login
          login(response.user, response.access_token)
          
          toast.success(purpose === 'registration' ? 'Account verified successfully!' : 'Login successful!')
          
          // Redirect based on user role
          const user = response.user
          if (user.role === 'ADMIN') {
            router.push('/admin')
          } else if (user.role === 'SELLER') {
            router.push('/seller')
          } else {
            router.push('/customer')
          }
        }
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid OTP. Please try again.'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setResendLoading(true)
    try {
      if (purpose === 'seller-registration') {
        // For seller registration, we need to resend the registration request
        if (!email || !registrationDataParam) {
          toast.error('Invalid verification link')
          router.push('/auth/register')
          return
        }

        const registrationData = JSON.parse(decodeURIComponent(registrationDataParam))
        await sellerRegistrationApi.register(registrationData)
        toast.success('New OTP sent to your email')
      } else {
        // For regular auth OTP
        if (!userId) return
        
        await authApi.resendOtp({
          userId,
          purpose
        })
        toast.success('New OTP sent to your email')
      }
      setCountdown(60) // 60 second cooldown
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to resend OTP. Please try again.'
      toast.error(message)
    } finally {
      setResendLoading(false)
    }
  }


  const getPageTitle = () => {
    switch (purpose) {
      case 'registration':
        return 'Verify Your Email'
      case 'seller-registration':
        return 'Verify Your Email for Seller Registration'
      case 'login':
        return 'Enter Verification Code'
      default:
        return 'Verify OTP'
    }
  }

  const getPageDescription = () => {
    switch (purpose) {
      case 'registration':
        return 'We\'ve sent a 6-digit code to your email. Please enter it below to activate your account.'
      case 'seller-registration':
        return 'We\'ve sent a 6-digit code to your email. Please enter it below to complete your seller registration.'
      case 'login':
        return 'We\'ve sent a 6-digit verification code to your email. Please enter it below to continue.'
      default:
        return 'Please enter the 6-digit code sent to your email.'
    }
  }

  if (!userId && purpose !== 'seller-registration') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Invalid Link</h2>
              <p className="text-muted-foreground mb-4">This verification link is invalid or expired.</p>
              <Link href="/auth/login">
                <Button>Go to Login</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back to Login Button */}
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {getPageTitle()}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {getPageDescription()}
            </CardDescription>
            {email && (
              <div className="text-sm text-primary-600 font-medium">
                {email}
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground text-center block">
                  Enter 6-digit code
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  length={6}
                  disabled={loading}
                  className="mb-2"
                />
                {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </form>

            {/* Resend OTP */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Didn't receive the code?
              </p>
              <Button
                variant="outline"
                onClick={handleResendOtp}
                disabled={resendLoading || countdown > 0}
                className="w-full"
              >
                {resendLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  'Resend Code'
                )}
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Need help?</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• The code expires in 10 minutes</li>
                <li>• Contact support if you continue having issues</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Loading component for Suspense fallback
function VerifyOtpLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Loading...</h2>
            <p className="text-muted-foreground">Please wait while we load the verification page.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<VerifyOtpLoading />}>
      <VerifyOtpContent />
    </Suspense>
  )
}