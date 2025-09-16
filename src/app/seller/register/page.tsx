'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Store, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function SellerRegisterPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
            <Store className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Become a Seller
          </h1>
          <p className="text-xl text-muted-foreground">
            Join our marketplace and start selling your products to customers worldwide
          </p>
        </div>

        {/* Registration Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-primary-200 hover:border-primary-300 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-primary-600" />
              </div>
              <CardTitle>New Seller Registration</CardTitle>
              <CardDescription>
                Create a new account and register as a seller
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/auth/register')}
                className="w-full"
              >
                Register as Seller
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary-200 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Store className="w-6 h-6 text-gray-600" />
              </div>
              <CardTitle>Already Have an Account?</CardTitle>
              <CardDescription>
                Sign in to your existing account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                onClick={() => router.push('/auth/login')}
                className="w-full"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Why Sell With Us?</CardTitle>
            <CardDescription className="text-center">
              Join thousands of successful sellers on our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">0%</span>
                </div>
                <h3 className="font-semibold mb-2">No Setup Fees</h3>
                <p className="text-sm text-muted-foreground">
                  Start selling immediately with no upfront costs
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">5%</span>
                </div>
                <h3 className="font-semibold mb-2">Low Commission</h3>
                <p className="text-sm text-muted-foreground">
                  Keep more of your profits with our competitive rates
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">24/7</span>
                </div>
                <h3 className="font-semibold mb-2">Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get help whenever you need it from our support team
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Seller Requirements</CardTitle>
            <CardDescription>
              What you need to get started as a seller
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-medium">Valid Business License</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload a copy of your business registration or license
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-medium">Government ID</h4>
                  <p className="text-sm text-muted-foreground">
                    Provide a valid government-issued identification document
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-medium">Bank Account Details</h4>
                  <p className="text-sm text-muted-foreground">
                    For receiving payments from your sales
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-600 text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-medium">Business Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete business details including address and contact information
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
