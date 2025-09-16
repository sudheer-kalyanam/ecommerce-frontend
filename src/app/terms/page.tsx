'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Scale, Users, Shield } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
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
            <FileText className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground">
            Please read these terms carefully before using our marketplace platform
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Key Points */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>User Agreement</CardTitle>
              <CardDescription>
                Terms that apply to all users of our platform
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Scale className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Legal Framework</CardTitle>
              <CardDescription>
                Your rights and responsibilities as a user
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Protection</CardTitle>
              <CardDescription>
                How we protect both buyers and sellers
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing and using our marketplace platform, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Creation</h4>
                <p className="text-muted-foreground">
                  You must provide accurate and complete information when creating an account. 
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Account Security</h4>
                <p className="text-muted-foreground">
                  You are responsible for all activities that occur under your account. 
                  Notify us immediately of any unauthorized use of your account.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Account Termination</h4>
                <p className="text-muted-foreground">
                  We reserve the right to suspend or terminate accounts that violate these terms 
                  or engage in fraudulent or illegal activities.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Marketplace Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Platform Role</h4>
                <p className="text-muted-foreground">
                  We provide a platform that connects buyers and sellers. We are not a party to transactions 
                  between users and do not guarantee the quality, safety, or legality of products sold.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Payment Processing</h4>
                <p className="text-muted-foreground">
                  We facilitate payment processing but are not responsible for payment disputes between buyers and sellers. 
                  All transactions are subject to our payment terms and conditions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Service Availability</h4>
                <p className="text-muted-foreground">
                  We strive to maintain service availability but do not guarantee uninterrupted access. 
                  We may perform maintenance or updates that temporarily affect service.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Buyer Responsibilities</h4>
                <p className="text-muted-foreground">
                  Buyers must provide accurate shipping information, make timely payments, 
                  and communicate honestly with sellers about their needs and expectations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Seller Responsibilities</h4>
                <p className="text-muted-foreground">
                  Sellers must provide accurate product descriptions, fulfill orders promptly, 
                  maintain appropriate inventory levels, and comply with all applicable laws and regulations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Prohibited Activities</h4>
                <p className="text-muted-foreground">
                  Users may not engage in fraudulent activities, sell prohibited items, 
                  violate intellectual property rights, or use the platform for illegal purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Platform Content</h4>
                <p className="text-muted-foreground">
                  All content on our platform, including text, graphics, logos, and software, 
                  is owned by us or our licensors and is protected by copyright and trademark laws.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">User Content</h4>
                <p className="text-muted-foreground">
                  You retain ownership of content you upload but grant us a license to use, 
                  display, and distribute it in connection with our services.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Respect for Rights</h4>
                <p className="text-muted-foreground">
                  Users must respect the intellectual property rights of others and may not 
                  upload content that infringes on third-party rights.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Dispute Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Internal Resolution</h4>
                <p className="text-muted-foreground">
                  We encourage users to resolve disputes directly. Our customer support team 
                  can assist with mediation when necessary.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Refund Policy</h4>
                <p className="text-muted-foreground">
                  Refunds are subject to our refund policy and the individual seller's return policy. 
                  We may facilitate refunds in cases of clear violations of our terms.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal Recourse</h4>
                <p className="text-muted-foreground">
                  For disputes that cannot be resolved internally, users may pursue legal action 
                  in accordance with applicable laws and jurisdiction.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                To the maximum extent permitted by law, we shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Loss of profits, data, or business opportunities</li>
                <li>• Damages resulting from transactions between users</li>
                <li>• Service interruptions or technical issues</li>
                <li>• Third-party actions or content</li>
                <li>• Force majeure events beyond our control</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your privacy is important to us. Our collection and use of personal information 
                is governed by our Privacy Policy, which is incorporated into these terms by reference. 
                By using our services, you consent to the collection and use of information as described in our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Modifications to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. We will notify users of 
                significant changes via email or through our platform. Continued use of our services 
                after changes constitutes acceptance of the modified terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> legal@marketplace.com</p>
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
