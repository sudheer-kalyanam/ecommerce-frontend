'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { sellerRegistrationApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

interface SellerRegistration {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  businessName: string
  businessType: string
  businessAddress: string
  businessPhone: string
  businessEmail: string
  taxId?: string
  bankAccountNumber?: string
  bankName?: string
  businessLicense?: string
  idProof?: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectionReason?: string
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export default function SellerApprovalsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [registrations, setRegistrations] = useState<SellerRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRegistration, setSelectedRegistration] = useState<SellerRegistration | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    
    if (!user || user.role !== 'ADMIN') {
      router.push('/auth/login')
      return
    }
    
    loadPendingRegistrations()
  }, [user, authLoading])

  const loadPendingRegistrations = async () => {
    try {
      const response = await sellerRegistrationApi.getPendingRegistrations()
      setRegistrations(response)
    } catch (error: any) {
      toast.error('Failed to load pending registrations')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (registrationId: string) => {
    setActionLoading(registrationId)
    try {
      await sellerRegistrationApi.approveSeller({
        registrationId,
        action: 'APPROVE'
      })
      toast.success('Seller approved successfully')
      loadPendingRegistrations()
      setSelectedRegistration(null)
    } catch (error: any) {
      toast.error('Failed to approve seller')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (registrationId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    setActionLoading(registrationId)
    try {
      await sellerRegistrationApi.approveSeller({
        registrationId,
        action: 'REJECT',
        rejectionReason
      })
      toast.success('Seller registration rejected')
      loadPendingRegistrations()
      setSelectedRegistration(null)
      setRejectionReason('')
    } catch (error: any) {
      toast.error('Failed to reject seller')
    } finally {
      setActionLoading(null)
    }
  }

  const downloadDocument = async (registrationId: string, fileType: 'businessLicense' | 'idProof') => {
    try {
      const response = await sellerRegistrationApi.downloadDocument(registrationId, fileType)
      
      // Create a blob from the response
      const blob = new Blob([response], { type: 'application/pdf' })
      
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${fileType}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('Document downloaded successfully')
    } catch (error: any) {
      console.error('Download error:', error)
      toast.error('Failed to download document')
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Approvals</h1>
          <p className="text-gray-600 mt-2">Review and approve seller registrations</p>
        </div>

        {registrations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No pending seller registrations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registration List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Pending Registrations</h2>
              {registrations.map((registration) => (
                <div
                  key={registration.id}
                  className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedRegistration(registration)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{registration.businessName}</h3>
                      <p className="text-gray-600">{registration.firstName} {registration.lastName}</p>
                      <p className="text-sm text-gray-500">{registration.email}</p>
                      <p className="text-sm text-gray-500">{registration.businessType}</p>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      {registration.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Submitted: {new Date(registration.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Registration Details */}
            {selectedRegistration && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Registration Details</h2>
                
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <p className="font-medium">{selectedRegistration.firstName} {selectedRegistration.lastName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{selectedRegistration.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <p className="font-medium">{selectedRegistration.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Business Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Business Name:</span>
                        <p className="font-medium">{selectedRegistration.businessName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Business Type:</span>
                        <p className="font-medium">{selectedRegistration.businessType}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Business Email:</span>
                        <p className="font-medium">{selectedRegistration.businessEmail}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Business Phone:</span>
                        <p className="font-medium">{selectedRegistration.businessPhone}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Business Address:</span>
                        <p className="font-medium">{selectedRegistration.businessAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  {(selectedRegistration.taxId || selectedRegistration.bankName || selectedRegistration.bankAccountNumber) && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Financial Information</h3>
                      <div className="space-y-2 text-sm">
                        {selectedRegistration.taxId && (
                          <div>
                            <span className="text-gray-500">Tax ID:</span>
                            <p className="font-medium">{selectedRegistration.taxId}</p>
                          </div>
                        )}
                        {selectedRegistration.bankName && (
                          <div>
                            <span className="text-gray-500">Bank Name:</span>
                            <p className="font-medium">{selectedRegistration.bankName}</p>
                          </div>
                        )}
                        {selectedRegistration.bankAccountNumber && (
                          <div>
                            <span className="text-gray-500">Bank Account:</span>
                            <p className="font-medium">{selectedRegistration.bankAccountNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {(selectedRegistration.businessLicense || selectedRegistration.idProof) && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
                      <div className="space-y-2 text-sm">
                        {selectedRegistration.businessLicense && (
                          <div>
                            <span className="text-gray-500">Business License:</span>
                            <button 
                              onClick={() => downloadDocument(selectedRegistration.id, 'businessLicense')}
                              className="text-blue-600 hover:text-blue-700 ml-2 underline"
                            >
                              View Document
                            </button>
                          </div>
                        )}
                        {selectedRegistration.idProof && (
                          <div>
                            <span className="text-gray-500">ID Proof:</span>
                            <button 
                              onClick={() => downloadDocument(selectedRegistration.id, 'idProof')}
                              className="text-blue-600 hover:text-blue-700 ml-2 underline"
                            >
                              View Document
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-6 border-t">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleApprove(selectedRegistration.id)}
                        disabled={actionLoading === selectedRegistration.id}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === selectedRegistration.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Please provide a reason for rejection:')
                          if (reason) {
                            setRejectionReason(reason)
                            handleReject(selectedRegistration.id)
                          }
                        }}
                        disabled={actionLoading === selectedRegistration.id}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === selectedRegistration.id ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
