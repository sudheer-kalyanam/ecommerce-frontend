'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authApi, sellerRegistrationApi } from '@/lib/api'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER' as 'CUSTOMER' | 'SELLER',
    // Seller-specific fields
    businessName: '',
    businessType: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    taxId: '',
    bankAccountNumber: '',
    bankName: '',
    businessLicense: '',
    idProof: ''
  })
  const [files, setFiles] = useState<{
    businessLicense: File | null;
    idProof: File | null;
  }>({
    businessLicense: null,
    idProof: null
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Seller-specific validation
    if (formData.role === 'SELLER') {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required'
      }
      if (!formData.businessType.trim()) {
        newErrors.businessType = 'Business type is required'
      }
      if (!formData.businessAddress.trim()) {
        newErrors.businessAddress = 'Business address is required'
      }
      if (!formData.businessPhone.trim()) {
        newErrors.businessPhone = 'Business phone is required'
      }
      if (!formData.businessEmail.trim()) {
        newErrors.businessEmail = 'Business email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.businessEmail)) {
        newErrors.businessEmail = 'Business email is invalid'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...registerData } = formData
      
      if (formData.role === 'SELLER') {
        // Use seller registration API for sellers - remove role field
        const { role, ...sellerData } = registerData
        
        // Check if files are uploaded
        if (files.businessLicense || files.idProof) {
          // Use file upload endpoint
          const formDataWithFiles = new FormData()
          
          // Add form data
          Object.entries(sellerData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formDataWithFiles.append(key, value.toString())
            }
          })
          
          // Add files
          if (files.businessLicense) {
            formDataWithFiles.append('businessLicense', files.businessLicense)
          }
          if (files.idProof) {
            formDataWithFiles.append('idProof', files.idProof)
          }
          
          try {
            const result = await sellerRegistrationApi.registerWithFiles(formDataWithFiles)
            console.log('File upload result:', result)
            
            if (result.requiresOTP) {
              toast.info('Please verify your email with the OTP sent')
              router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}&purpose=seller-registration&registrationData=${encodeURIComponent(JSON.stringify(sellerData))}`)
              return
            }
            
            if (result.message) {
              toast.success(result.message)
              router.push('/auth/login?message=seller-registration-submitted')
            }
          } catch (error: any) {
            console.error('File upload error:', error)
            console.error('Error details:', error.message)
            toast.error(`Registration failed: ${error.message || 'Please try again.'}`)
            return
          }
        } else {
          // Use regular registration without files
          console.log('Using regular registration (no files)')
          const response = await sellerRegistrationApi.register(sellerData)
          console.log('Regular registration response:', response)
          
          if (response && (response as any).requiresOTP) {
            // Handle OTP verification for seller registration
            console.log('Redirecting to OTP verification')
            toast.info('Please verify your email with the OTP sent')
            router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}&purpose=seller-registration&registrationData=${encodeURIComponent(JSON.stringify(sellerData))}`)
            return
          }
          
          if (response && (response as any).message) {
            toast.success((response as any).message)
            router.push('/auth/login?message=seller-registration-submitted')
          }
        }
      } else {
        // Use regular auth API for customers - filter out business fields
        const { businessName, businessType, businessAddress, businessPhone, businessEmail, taxId, bankAccountNumber, bankName, businessLicense, idProof, ...customerData } = registerData
        const response = await authApi.register(customerData)

        if (response && (response as any).requiresOTP) {
          // Handle OTP verification for registration
          toast.info('Please verify your email with the OTP sent')
          router.push(`/auth/verify-otp?userId=${(response as any).userId ?? ''}&purpose=registration&email=${encodeURIComponent(formData.email)}`)
          return
        }
        
        if (response && (response as any).message) {
          toast.success((response as any).message)
          router.push('/auth/login')
        }
      }
    } catch (error: any) {
      const message =
        (error?.response?.data?.message as string) ||
        (error?.message as string) ||
        'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'businessLicense' | 'idProof') => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed')
        return
      }
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB')
        return
      }
      setFiles(prev => ({ ...prev, [field]: file }))
    }
  }

  const handleRoleChange = (role: 'CUSTOMER' | 'SELLER') => {
    setFormData(prev => ({ ...prev, role }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back to Home Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Join us and start your journey
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Role Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-3 block">
                I want to:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange('CUSTOMER')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.role === 'CUSTOMER'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">Shop</div>
                  <div className="text-xs text-muted-foreground">As a customer</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('SELLER')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.role === 'SELLER'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">Sell</div>
                  <div className="text-xs text-muted-foreground">As a seller</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    icon={<User className="w-4 h-4" />}
                    error={errors.firstName}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    icon={<User className="w-4 h-4" />}
                    error={errors.lastName}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon={<Mail className="w-4 h-4" />}
                  error={errors.email}
                  disabled={loading}
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number (optional)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  icon={<Phone className="w-4 h-4" />}
                  error={errors.phone}
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    icon={<Lock className="w-4 h-4" />}
                    error={errors.password}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    icon={<Lock className="w-4 h-4" />}
                    error={errors.confirmPassword}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Seller Business Information */}
              {formData.role === 'SELLER' && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-foreground">Business Information</h3>
                  
                  {/* Business Name */}
                  <div className="space-y-2">
                    <Input
                      type="text"
                      name="businessName"
                      placeholder="Business name"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      icon={<User className="w-4 h-4" />}
                      error={errors.businessName}
                      disabled={loading}
                    />
                  </div>

                  {/* Business Type */}
                  <div className="space-y-2">
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      disabled={loading}
                    >
                      <option value="">Select Business Type</option>
                      <option value="retail">Retail</option>
                      <option value="wholesale">Wholesale</option>
                      <option value="manufacturer">Manufacturer</option>
                      <option value="distributor">Distributor</option>
                      <option value="service">Service Provider</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.businessType && (
                      <p className="text-sm text-red-600">{errors.businessType}</p>
                    )}
                  </div>

                  {/* Business Email */}
                  <div className="space-y-2">
                    <Input
                      type="email"
                      name="businessEmail"
                      placeholder="Business email"
                      value={formData.businessEmail}
                      onChange={handleInputChange}
                      icon={<Mail className="w-4 h-4" />}
                      error={errors.businessEmail}
                      disabled={loading}
                    />
                  </div>

                  {/* Business Phone */}
                  <div className="space-y-2">
                    <Input
                      type="tel"
                      name="businessPhone"
                      placeholder="Business phone"
                      value={formData.businessPhone}
                      onChange={handleInputChange}
                      icon={<Phone className="w-4 h-4" />}
                      error={errors.businessPhone}
                      disabled={loading}
                    />
                  </div>

                  {/* Business Address */}
                  <div className="space-y-2">
                    <textarea
                      name="businessAddress"
                      placeholder="Business address"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      disabled={loading}
                    />
                    {errors.businessAddress && (
                      <p className="text-sm text-red-600">{errors.businessAddress}</p>
                    )}
                  </div>

                  {/* Optional Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Input
                        type="text"
                        name="taxId"
                        placeholder="Tax ID (optional)"
                        value={formData.taxId}
                        onChange={handleInputChange}
                        icon={<User className="w-4 h-4" />}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        type="text"
                        name="bankName"
                        placeholder="Bank name (optional)"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        icon={<User className="w-4 h-4" />}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Input
                      type="text"
                      name="bankAccountNumber"
                      placeholder="Bank account number (optional)"
                      value={formData.bankAccountNumber}
                      onChange={handleInputChange}
                      icon={<User className="w-4 h-4" />}
                      disabled={loading}
                    />
                  </div>

                  {/* File Upload Fields */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Verification Documents (Optional)</h3>
                    <p className="text-sm text-gray-600">Upload PDF documents to speed up the approval process. Maximum file size: 2MB</p>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Business License (PDF)
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, 'businessLicense')}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        disabled={loading}
                      />
                      {files.businessLicense && (
                        <p className="text-sm text-green-600">✓ {files.businessLicense.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        ID Proof (PDF)
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, 'idProof')}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        disabled={loading}
                      />
                      {files.idProof && (
                        <p className="text-sm text-green-600">✓ {files.idProof.name}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-blue-800">Seller Registration Notice:</p>
                    <p className="text-blue-700">Your seller account will be reviewed by our admin team. You'll receive an email notification once your account is approved and you can start selling.</p>
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="text-sm text-muted-foreground">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full" disabled>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              
              <Button variant="outline" className="w-full" disabled>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </Button>
            </div>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <span className="text-muted-foreground text-sm">
                Already have an account?{' '}
              </span>
              <Link 
                href="/auth/login" 
                className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

