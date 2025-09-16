'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, XCircle, Eye, Download } from 'lucide-react'
import { toast } from 'sonner'
import { sellerRegistrationApi } from '@/lib/api'

interface SellerRegistration {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  businessName: string
  businessType: string
  businessAddress: string
  businessPhone: string
  businessEmail: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectionReason?: string
  businessLicense?: string
  idProof?: string
  createdAt: string
  reviewedBy?: string
  reviewedAt?: string
}

export default function SellerApprovals() {
  const { user } = useAuth()
  const [pendingSellers, setPendingSellers] = useState<SellerRegistration[]>([])
  const [approvedSellers, setApprovedSellers] = useState<SellerRegistration[]>([])
  const [rejectedSellers, setRejectedSellers] = useState<SellerRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING')
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; sellerId: string; sellerName: string }>({
    isOpen: false,
    sellerId: '',
    sellerName: ''
  })
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectLoading, setRejectLoading] = useState(false)
  const [documentModal, setDocumentModal] = useState<{ isOpen: boolean; title: string; url: string }>({
    isOpen: false,
    title: '',
    url: ''
  })

  useEffect(() => {
    loadSellers()
  }, [])

  const loadSellers = async () => {
    try {
      // Load pending sellers
      const pendingResponse = await sellerRegistrationApi.getPendingRegistrations()
      if (Array.isArray(pendingResponse)) {
        setPendingSellers(pendingResponse)
      } else {
        setPendingSellers([])
      }

      // Load approved sellers
      const approvedResponse = await sellerRegistrationApi.getApprovedRegistrations()
      if (Array.isArray(approvedResponse)) {
        setApprovedSellers(approvedResponse)
      } else {
        setApprovedSellers([])
      }

      // Load rejected sellers
      const rejectedResponse = await sellerRegistrationApi.getRejectedRegistrations()
      if (Array.isArray(rejectedResponse)) {
        setRejectedSellers(rejectedResponse)
      } else {
        setRejectedSellers([])
      }

    } catch (error) {
      console.error('Error loading sellers:', error)
      toast.error('Failed to load seller registrations')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentSellers = () => {
    switch (activeTab) {
      case 'PENDING':
        return pendingSellers
      case 'APPROVED':
        return approvedSellers
      case 'REJECTED':
        return rejectedSellers
      default:
        return pendingSellers
    }
  }

  const openDocumentModal = (title: string, url: string) => {
    if (!url) {
      toast.error('Document URL is not available')
      return
    }
    
    // Convert relative path to full URL - use API route for uploads
    let backendUrl: string
    if (url.startsWith('http')) {
      backendUrl = url
    } else if (url.startsWith('/uploads/')) {
      // Remove /uploads/ prefix and use API route
      const filename = url.replace('/uploads/', '')
      backendUrl = `http://localhost:3000/api/v1/uploads/${filename}`
    } else {
      backendUrl = `http://localhost:3000${url}`
    }
    
    setDocumentModal({
      isOpen: true,
      title,
      url: backendUrl
    })
  }

  const handleApprove = async (sellerId: string) => {
    try {
      await sellerRegistrationApi.approveSeller({
        registrationId: sellerId,
        action: 'APPROVE'
      })
      toast.success('Seller approved successfully')
      loadSellers()
    } catch (error) {
      console.error('Error approving seller:', error)
      toast.error('Failed to approve seller')
    }
  }

  const handleReject = (sellerId: string, sellerName: string) => {
    setRejectModal({
      isOpen: true,
      sellerId,
      sellerName
    })
    setRejectionReason('')
  }

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    setRejectLoading(true)
    try {
      await sellerRegistrationApi.approveSeller({
        registrationId: rejectModal.sellerId,
        action: 'REJECT',
        rejectionReason: rejectionReason.trim()
      })
      toast.success('Seller rejected')
      setRejectModal({ isOpen: false, sellerId: '', sellerName: '' })
      setRejectionReason('')
      loadSellers()
    } catch (error) {
      console.error('Error rejecting seller:', error)
      toast.error('Failed to reject seller')
    } finally {
      setRejectLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sellers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Seller Approvals</h1>
        <p className="mt-2 text-gray-600">Review and approve seller registrations</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'PENDING'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">⏳</span>
            Pending ({pendingSellers.length})
          </button>
          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'APPROVED'
                ? 'bg-green-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">✅</span>
            Approved ({approvedSellers.length})
          </button>
          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'REJECTED'
                ? 'bg-red-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">❌</span>
            Rejected ({rejectedSellers.length})
          </button>
        </nav>
      </div>

      {/* Sellers List */}
      <div className="space-y-6">
        {getCurrentSellers().length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="text-gray-300 text-6xl mb-4">
              {activeTab === 'PENDING' && '⏳'}
              {activeTab === 'APPROVED' && '✅'}
              {activeTab === 'REJECTED' && '❌'}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'PENDING' && 'No Pending Sellers'}
              {activeTab === 'APPROVED' && 'No Approved Sellers'}
              {activeTab === 'REJECTED' && 'No Rejected Sellers'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'PENDING' && 'All seller registrations have been reviewed'}
              {activeTab === 'APPROVED' && 'No sellers have been approved yet'}
              {activeTab === 'REJECTED' && 'No sellers have been rejected yet'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {getCurrentSellers().map((seller) => (
              <div 
                key={seller.id} 
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                {/* Card Header */}
                <div className={`p-6 border-b border-gray-100 ${
                  seller.status === 'APPROVED' 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50' 
                    : seller.status === 'REJECTED'
                    ? 'bg-gradient-to-r from-red-50 to-pink-50'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        seller.status === 'APPROVED' 
                          ? 'bg-green-500' 
                          : seller.status === 'REJECTED'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}>
                        <span className="text-white text-lg font-semibold">
                          {seller.firstName.charAt(0)}{seller.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {seller.firstName} {seller.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{seller.email}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      seller.status === 'APPROVED' 
                        ? 'bg-green-100 text-green-800' 
                        : seller.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {seller.status}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-6">
                  {/* Business Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Personal Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 w-20">📞 Phone:</span>
                          <span className="text-gray-900">{seller.phone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 w-20">📧 Email:</span>
                          <span className="text-gray-900">{seller.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Business Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 w-20">🏢 Name:</span>
                          <span className="text-gray-900 font-medium">{seller.businessName}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 w-20">🏷️ Type:</span>
                          <span className="text-gray-900">{seller.businessType}</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <span className="text-gray-500 w-20">📍 Address:</span>
                          <span className="text-gray-900">{seller.businessAddress}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 w-20">📱 Phone:</span>
                          <span className="text-gray-900">{seller.businessPhone}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 w-20">✉️ Email:</span>
                          <span className="text-gray-900">{seller.businessEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  {(seller.businessLicense || seller.idProof) && (
                    <div className="border-t border-gray-100 pt-6">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">📋 Documents</h4>
                      <div className="flex flex-wrap gap-3">
                        {seller.businessLicense && (
                          <button 
                            onClick={() => openDocumentModal('Business License', seller.businessLicense!)}
                            className="inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Business License
                          </button>
                        )}
                        {seller.idProof && (
                          <button 
                            onClick={() => openDocumentModal('ID Proof', seller.idProof!)}
                            className="inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            ID Proof
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status-specific actions and information */}
                  {seller.status === 'PENDING' && (
                    <div className="border-t border-gray-100 pt-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">Review the documents and seller information above</p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleApprove(seller.id)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(seller.id, `${seller.firstName} ${seller.lastName}`)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {seller.status === 'APPROVED' && seller.reviewedAt && (
                    <div className="border-t border-gray-100 pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Approved on {new Date(seller.reviewedAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          ✓ Active Seller
                        </span>
                      </div>
                    </div>
                  )}

                  {seller.status === 'REJECTED' && (
                    <div className="border-t border-gray-100 pt-6">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-red-800">Registration Rejected</p>
                              {seller.reviewedAt && (
                                <span className="text-xs text-red-600">
                                  {new Date(seller.reviewedAt).toLocaleDateString('en-IN')}
                                </span>
                              )}
                            </div>
                            {seller.rejectionReason && (
                              <p className="text-sm text-red-700">
                                <span className="font-medium">Reason:</span> {seller.rejectionReason}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject Seller Registration
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Rejecting registration for <strong>{rejectModal.sellerName}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Please provide a clear reason for rejection..."
                disabled={rejectLoading}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRejectModal({ isOpen: false, sellerId: '', sellerName: '' })}
                disabled={rejectLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={rejectLoading || !rejectionReason.trim()}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {rejectLoading ? 'Rejecting...' : 'Reject Registration'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {documentModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {documentModal.title}
              </h3>
              <button
                onClick={() => setDocumentModal({ isOpen: false, title: '', url: '' })}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 h-[calc(90vh-80px)] overflow-auto">
              {documentModal.url.endsWith('.pdf') ? (
                <iframe
                  src={documentModal.url}
                  className="w-full h-full border-0"
                  title={documentModal.title}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📄</div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Document Preview</h4>
                    <p className="text-gray-600 mb-4">This document cannot be previewed inline.</p>
                    <a
                      href={documentModal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Document
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
