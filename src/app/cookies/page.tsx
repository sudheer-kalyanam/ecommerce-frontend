export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              This Cookie Policy explains how our ecommerce platform uses cookies and similar technologies when you visit our website.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-600 mb-6">
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain functionality.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Essential Cookies</h3>
                <p className="text-gray-600 mb-3">
                  These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and authentication.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>Examples:</strong> Login sessions, shopping cart contents, security tokens
                  </p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Cookies</h3>
                <p className="text-gray-600 mb-3">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Examples:</strong> Google Analytics, page views, user behavior tracking
                  </p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Functional Cookies</h3>
                <p className="text-gray-600 mb-3">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-800 text-sm">
                    <strong>Examples:</strong> Language preferences, theme settings, user preferences
                  </p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Marketing Cookies</h3>
                <p className="text-gray-600 mb-3">
                  These cookies are used to track visitors across websites to display relevant and engaging advertisements.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800 text-sm">
                    <strong>Examples:</strong> Ad targeting, remarketing, conversion tracking
                  </p>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>To remember your login status and preferences</li>
              <li>To keep items in your shopping cart</li>
              <li>To analyze website traffic and user behavior</li>
              <li>To improve website performance and user experience</li>
              <li>To provide personalized content and recommendations</li>
              <li>To ensure website security and prevent fraud</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
            <p className="text-gray-600 mb-4">
              You can control and manage cookies in several ways:
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Browser Settings</h3>
                <p className="text-gray-600 text-sm">
                  Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or delete certain cookies.
                </p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cookie Consent</h3>
                <p className="text-gray-600 text-sm">
                  When you first visit our website, you'll see a cookie consent banner where you can choose which types of cookies to accept.
                </p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Opt-Out Links</h3>
                <p className="text-gray-600 text-sm">
                  For third-party cookies, you can often opt out directly through the service provider's website.
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Note</h3>
              <p className="text-yellow-800 text-sm">
                Please note that disabling certain cookies may affect the functionality of our website and your user experience. Some features may not work properly if you disable essential cookies.
              </p>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-600 mb-4">
              Our website may contain cookies from third-party services such as:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
              <li>Google Analytics for website analytics</li>
              <li>Payment processors for secure transactions</li>
              <li>Social media platforms for sharing features</li>
              <li>Advertising networks for targeted ads</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
            <p className="text-gray-600 mb-6">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Contact Us</h3>
              <p className="text-blue-800 mb-3">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="space-y-1 text-blue-800 text-sm">
                <p>Email: privacy@ecommerce-app.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Commerce Street, Business City, BC 12345</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
