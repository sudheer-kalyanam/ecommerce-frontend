'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { productsApi } from '@/lib/api'
import { ProductImage } from '@/components/ui/product-image'

interface Product {
  status: string
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: {
    id: string
    name: string
  }
  seller: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectionReason?: string
  reviewedBy?: string
  reviewedAt?: string
  images: string[]
  createdAt: string
}

export default function ProductApprovals() {
  const [pendingProducts, setPendingProducts] = useState<Product[]>([])
  const [approvedProducts, setApprovedProducts] = useState<Product[]>([])
  const [rejectedProducts, setRejectedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING')
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; productId: string; productName: string }>({
    isOpen: false,
    productId: '',
    productName: ''
  })
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejectLoading, setRejectLoading] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      // Load pending products
      const pendingResponse = await productsApi.getPendingProducts()
      if (Array.isArray(pendingResponse)) {
        setPendingProducts(pendingResponse)
      } else {
        setPendingProducts([])
      }

      // Load approved products
      const approvedResponse = await productsApi.getApprovedProducts()
      if (Array.isArray(approvedResponse)) {
        setApprovedProducts(approvedResponse)
      } else {
        setApprovedProducts([])
      }

      // Load rejected products
      const rejectedResponse = await productsApi.getRejectedProducts()
      if (Array.isArray(rejectedResponse)) {
        setRejectedProducts(rejectedResponse)
      } else {
        setRejectedProducts([])
      }

    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (productId: string) => {
    try {
      await productsApi.approveProduct({
        productId,
        action: 'APPROVED'
      })
      toast.success('Product approved successfully')
      loadProducts()
    } catch (error) {
      console.error('Error approving product:', error)
      toast.error('Failed to approve product')
    }
  }

  const handleReject = (productId: string, productName: string) => {
    setRejectModal({
      isOpen: true,
      productId,
      productName
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
      await productsApi.approveProduct({
        productId: rejectModal.productId,
        action: 'REJECTED',
        rejectionReason: rejectionReason.trim()
      })
      toast.success('Product rejected')
      setRejectModal({ isOpen: false, productId: '', productName: '' })
      setRejectionReason('')
      loadProducts()
    } catch (error) {
      console.error('Error rejecting product:', error)
      toast.error('Failed to reject product')
    } finally {
      setRejectLoading(false)
    }
  }

  const getCurrentProducts = () => {
    switch (activeTab) {
      case 'PENDING':
        return pendingProducts
      case 'APPROVED':
        return approvedProducts
      case 'REJECTED':
        return rejectedProducts
      default:
        return pendingProducts
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Product Approvals</h1>
        <p className="mt-2 text-gray-600">Review and manage seller products</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'PENDING'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending ({pendingProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'APPROVED'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Approved ({approvedProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'REJECTED'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Rejected ({rejectedProducts.length})
          </button>
        </nav>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getCurrentProducts().map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Product Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <ProductImage
                src={product.images}
                alt={product.name}
                className="h-full w-full object-cover"
                fallbackIcon={
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl">📦</span>
                  </div>
                }
                fallbackText="No Image"
              />
              
              <div className="absolute top-3 right-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                  product.approvalStatus === 'APPROVED' 
                    ? 'bg-green-100 text-green-800' 
                    : product.approvalStatus === 'REJECTED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {product.approvalStatus}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold">${product.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-semibold">{product.stock}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold">{product.category?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Seller:</span>
                  <span className="font-semibold">{product.seller?.firstName} {product.seller?.lastName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Seller Email:</span>
                  <span className="font-semibold">{product.seller?.email}</span>
                </div>
              </div>

              {/* Actions */}
              {product.approvalStatus === 'PENDING' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(product.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(product.id, product.name)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </div>
              )}

              {/* Status Information for Approved/Rejected Products */}
              {product.approvalStatus === 'APPROVED' && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Product Approved</p>
                      <p className="text-xs text-green-600">
                        Approved on {product.reviewedAt ? new Date(product.reviewedAt).toLocaleDateString() : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {product.approvalStatus === 'REJECTED' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start">
                    <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Product Rejected</p>
                      <p className="text-xs text-red-600">
                        Rejected on {product.reviewedAt ? new Date(product.reviewedAt).toLocaleDateString() : 'Unknown date'}
                      </p>
                      {product.rejectionReason && (
                        <p className="text-xs text-red-700 mt-1">
                          Reason: {product.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {getCurrentProducts().length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">
            {activeTab === 'PENDING' && '⏳'}
            {activeTab === 'APPROVED' && '✅'}
            {activeTab === 'REJECTED' && '❌'}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === 'PENDING' && 'No Pending Products'}
            {activeTab === 'APPROVED' && 'No Approved Products'}
            {activeTab === 'REJECTED' && 'No Rejected Products'}
          </h3>
          <p className="text-gray-500">
            {activeTab === 'PENDING' && 'All products have been reviewed'}
            {activeTab === 'APPROVED' && 'No products have been approved yet'}
            {activeTab === 'REJECTED' && 'No products have been rejected yet'}
          </p>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Reject Product
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Rejecting product: <strong>{rejectModal.productName}</strong>
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
                onClick={() => setRejectModal({ isOpen: false, productId: '', productName: '' })}
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
                {rejectLoading ? 'Rejecting...' : 'Reject Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
