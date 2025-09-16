'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Phone, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Help & Support
          </h1>
          <p className="text-xl text-muted-foreground">
            We're here to help you with any questions or issues
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary-600" />
              </div>
              <CardTitle>Email Support</CardTitle>
              <CardDescription>
                Get help via email within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                support@marketplace.com
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-primary-600" />
              </div>
              <CardTitle>Phone Support</CardTitle>
              <CardDescription>
                Call us for immediate assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                +1 (555) 123-4567
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary-600" />
              </div>
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>
                Chat with our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How do I create an account?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Click on "Sign Up" in the top right corner, fill in your details, and verify your email address. 
                  You'll receive a verification code to complete the registration process.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How do I become a seller?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  During registration, select "Seller" as your role and provide the required business information 
                  and documents. Your application will be reviewed by our admin team.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How do I place an order?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Browse products, add items to your cart, and proceed to checkout. You can pay using various 
                  payment methods including credit cards, debit cards, and digital wallets.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What is your return policy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer a 30-day return policy for most items. Items must be in original condition with tags attached. 
                  Contact the seller directly for return requests.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How do I track my order?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Once your order is shipped, you'll receive a tracking number via email. You can also check your 
                  order status in your account dashboard under "My Orders".
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Business Hours */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Support Hours</CardTitle>
            <CardDescription>
              Our support team is available to help you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Monday - Friday</p>
                <p className="text-muted-foreground">9:00 AM - 6:00 PM EST</p>
              </div>
              <div>
                <p className="font-medium">Saturday - Sunday</p>
                <p className="text-muted-foreground">10:00 AM - 4:00 PM EST</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
