'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Eye, Lock, Database } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
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
          <div className="mx-auto w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Privacy Principles */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Transparency</CardTitle>
              <CardDescription>
                We're clear about what data we collect and why
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Your data is protected with industry-standard security
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Control</CardTitle>
              <CardDescription>
                You have control over your personal information
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Privacy Policy Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <p className="text-muted-foreground">
                  When you create an account, we collect your name, email address, phone number, and shipping address. 
                  For sellers, we also collect business information and verification documents.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Payment Information</h4>
                <p className="text-muted-foreground">
                  We collect payment information to process transactions. This includes credit card details, 
                  billing addresses, and transaction history. All payment data is encrypted and securely processed.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage Data</h4>
                <p className="text-muted-foreground">
                  We automatically collect information about how you use our platform, including pages visited, 
                  products viewed, and interactions with our services to improve your experience.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Service Provision</h4>
                <p className="text-muted-foreground">
                  We use your information to provide, maintain, and improve our marketplace services, 
                  process transactions, and communicate with you about your account.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Personalization</h4>
                <p className="text-muted-foreground">
                  Your data helps us personalize your experience by showing relevant products, 
                  recommendations, and content based on your preferences and behavior.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Communication</h4>
                <p className="text-muted-foreground">
                  We use your contact information to send you important updates about your orders, 
                  account security, and promotional offers (with your consent).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">With Sellers</h4>
                <p className="text-muted-foreground">
                  When you make a purchase, we share necessary information (name, shipping address, 
                  contact details) with the seller to fulfill your order.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Service Providers</h4>
                <p className="text-muted-foreground">
                  We may share information with trusted third-party service providers who help us 
                  operate our platform, process payments, or provide customer support.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                <p className="text-muted-foreground">
                  We may disclose information when required by law, to protect our rights, 
                  or to ensure the safety of our users and the public.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• SSL encryption for all data transmission</li>
                <li>• Secure servers with regular security updates</li>
                <li>• Access controls and authentication systems</li>
                <li>• Regular security audits and monitoring</li>
                <li>• Employee training on data protection practices</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Access:</strong> Request a copy of your personal data</li>
                <li>• <strong>Correction:</strong> Update or correct inaccurate information</li>
                <li>• <strong>Deletion:</strong> Request deletion of your personal data</li>
                <li>• <strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li>• <strong>Objection:</strong> Opt out of certain data processing activities</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                <li>• <strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
                <li>• <strong>Marketing Cookies:</strong> Used to show relevant advertisements</li>
                <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                You can control cookie settings through your browser preferences.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> privacy@marketplace.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Marketplace Street, City, State 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
