export default function PressPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Press</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Welcome to our press center. Here you'll find the latest news, press releases, and media resources about our ecommerce platform.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Press Releases</h2>
            <div className="space-y-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900">Platform Launch Announcement</h3>
                <p className="text-gray-600">We're excited to announce the launch of our new ecommerce platform...</p>
                <p className="text-sm text-gray-500 mt-2">September 16, 2025</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900">New Features Update</h3>
                <p className="text-gray-600">Introducing advanced seller tools and enhanced customer experience...</p>
                <p className="text-sm text-gray-500 mt-2">September 15, 2025</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Media Kit</h2>
            <p className="text-gray-600 mb-4">
              Download our media kit for logos, images, and brand guidelines.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Logo</h3>
                <p className="text-gray-600 text-sm mb-3">High-resolution logo files in various formats</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                  Download
                </button>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Brand Guidelines</h3>
                <p className="text-gray-600 text-sm mb-3">Complete brand guidelines and usage rules</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                  Download
                </button>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-800 mb-2">
                <strong>Press Contact:</strong> press@ecommerce-app.com
              </p>
              <p className="text-gray-800 mb-2">
                <strong>Media Inquiries:</strong> media@ecommerce-app.com
              </p>
              <p className="text-gray-800">
                <strong>General Contact:</strong> info@ecommerce-app.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
