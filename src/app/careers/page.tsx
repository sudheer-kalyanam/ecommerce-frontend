export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Careers</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Join our team and help us build the future of ecommerce! We're always looking for talented individuals to join our growing company.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Work With Us?</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Competitive salary and benefits</li>
              <li>Flexible working arrangements</li>
              <li>Opportunities for growth and development</li>
              <li>Collaborative and inclusive work environment</li>
              <li>Cutting-edge technology stack</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Open Positions</h2>
            <div className="space-y-4 mb-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900">Frontend Developer</h3>
                <p className="text-gray-600">React, Next.js, TypeScript</p>
                <p className="text-sm text-gray-500 mt-2">Full-time • Remote</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900">Backend Developer</h3>
                <p className="text-gray-600">Node.js, NestJS, PostgreSQL</p>
                <p className="text-sm text-gray-500 mt-2">Full-time • Remote</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900">DevOps Engineer</h3>
                <p className="text-gray-600">AWS, Docker, CI/CD</p>
                <p className="text-sm text-gray-500 mt-2">Full-time • Remote</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How to Apply</h2>
            <p className="text-gray-600 mb-4">
              Interested in joining our team? Send your resume and cover letter to our HR department.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>Email:</strong> careers@ecommerce-app.com
              </p>
              <p className="text-blue-800 mt-2">
                <strong>Subject:</strong> Application for [Position Name]
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
