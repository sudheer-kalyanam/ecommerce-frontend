'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { User, Mail, Phone, Shield, Calendar, Edit, Save, X, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminProfile() {
  const { user } = useAuth()
  const [userRoles, setUserRoles] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      })
    }
    
    // Mock user roles based on email for testing
    if (user?.email?.includes('developer')) {
      setUserRoles(['DEVELOPER'])
    } else if (user?.email?.includes('accounts')) {
      setUserRoles(['ACCOUNTS'])
    } else {
      // Default to developer for other admin users
      setUserRoles(['DEVELOPER'])
    }
  }, [user])

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'DEVELOPER':
        return 'Full administrative access including seller approvals, product management, and analytics'
      case 'ACCOUNTS':
        return 'Access to orders management and financial reports'
      default:
        return 'Standard access'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'DEVELOPER':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600'
      case 'ACCOUNTS':
        return 'bg-gradient-to-r from-emerald-500 to-green-600'
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
          Admin Profile
        </h1>
        <p className="text-lg text-gray-600">
          Manage your admin account and view role permissions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isEditing ? (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 mr-3 text-gray-400" />
                      {user?.firstName || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 mr-3 text-gray-400" />
                      {user?.lastName || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center text-gray-900 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 mr-3 text-gray-400" />
                    {user?.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <div className="flex items-center text-gray-900 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      {user?.phone || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Role
                  </label>
                  <div className="flex items-center text-gray-900 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-5 w-5 mr-3 text-gray-400" />
                    Administrator
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center text-gray-900 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'January 2024'}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Role Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <h2 className="text-xl font-semibold text-gray-900">Admin Roles</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {userRoles.map((role) => (
                  <div key={role} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className={`w-4 h-4 rounded-full ${getRoleColor(role)} mr-3`}></div>
                      <span className="font-semibold text-gray-900">{role}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {getRoleDescription(role)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Access Summary
                </h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  {userRoles.includes('DEVELOPER') && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Seller Approvals
                    </li>
                  )}
                  {userRoles.includes('DEVELOPER') && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Product Approvals
                    </li>
                  )}
                  {(userRoles.includes('DEVELOPER') || userRoles.includes('ACCOUNTS')) && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Orders Management
                    </li>
                  )}
                  {userRoles.includes('DEVELOPER') && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Analytics Dashboard
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
