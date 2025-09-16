export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Welcome to our ecommerce platform! We are dedicated to providing you with the best shopping experience.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To connect customers with quality products and provide sellers with a platform to grow their business.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Wide selection of products from verified sellers</li>
              <li>Secure payment processing</li>
              <li>Fast and reliable delivery</li>
              <li>24/7 customer support</li>
              <li>Easy seller registration and management</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-600">
              For any questions or support, please contact us through our support channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
