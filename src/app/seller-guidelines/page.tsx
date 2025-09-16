export default function SellerGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Seller Guidelines</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Welcome to our seller community! These guidelines will help you succeed on our platform and provide the best experience for your customers.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Getting Started</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Registration Process</h3>
              <ol className="list-decimal list-inside text-blue-800 space-y-2">
                <li>Complete the seller registration form</li>
                <li>Upload required business documents</li>
                <li>Verify your email address</li>
                <li>Wait for admin approval (usually within 24-48 hours)</li>
                <li>Start listing your products!</li>
              </ol>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Listing Guidelines</h2>
            <div className="space-y-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">✅ Do's</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Use high-quality, clear product images</li>
                  <li>Write detailed, accurate product descriptions</li>
                  <li>Set competitive and fair pricing</li>
                  <li>Include all relevant product specifications</li>
                  <li>Update inventory levels regularly</li>
                  <li>Respond to customer inquiries promptly</li>
                </ul>
              </div>
              
              <div className="border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-900 mb-2">❌ Don'ts</h3>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  <li>List counterfeit or fake products</li>
                  <li>Use misleading product descriptions</li>
                  <li>Set unreasonably high prices</li>
                  <li>Upload low-quality or irrelevant images</li>
                  <li>Ignore customer messages or complaints</li>
                  <li>List prohibited or restricted items</li>
                </ul>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Order Processing</h3>
                <ul className="list-disc list-inside text-green-800 space-y-1">
                  <li>Process orders within 24 hours</li>
                  <li>Update order status promptly</li>
                  <li>Provide tracking information</li>
                  <li>Handle returns professionally</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Customer Service</h3>
                <ul className="list-disc list-inside text-yellow-800 space-y-1">
                  <li>Respond to messages within 12 hours</li>
                  <li>Be polite and professional</li>
                  <li>Resolve issues quickly</li>
                  <li>Maintain high customer satisfaction</li>
                </ul>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Items</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <p className="text-red-800 mb-3">The following items are strictly prohibited:</p>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                <li>Counterfeit or replica products</li>
                <li>Weapons and ammunition</li>
                <li>Drugs and controlled substances</li>
                <li>Adult content and explicit materials</li>
                <li>Hazardous materials</li>
                <li>Stolen goods</li>
                <li>Items that violate intellectual property rights</li>
              </ul>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Performance Standards</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Order Processing Time</span>
                <span className="text-green-600 font-semibold">≤ 24 hours</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Response Time</span>
                <span className="text-green-600 font-semibold">≤ 12 hours</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Customer Rating</span>
                <span className="text-green-600 font-semibold">≥ 4.0/5.0</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">Return Rate</span>
                <span className="text-green-600 font-semibold">≤ 5%</span>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-800 mb-3">
                If you have any questions about these guidelines or need assistance, please contact our seller support team.
              </p>
              <div className="flex space-x-4">
                <a href="mailto:seller-support@ecommerce-app.com" className="text-blue-600 hover:text-blue-800">
                  seller-support@ecommerce-app.com
                </a>
                <span className="text-blue-400">|</span>
                <a href="tel:+15551234567" className="text-blue-600 hover:text-blue-800">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
