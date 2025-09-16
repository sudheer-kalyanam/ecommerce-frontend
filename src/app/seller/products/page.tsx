'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { productsApi, categoriesApi } from '@/lib/api'
import { toast } from 'sonner'
import { ProductImage } from '@/components/ui/product-image'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  images: string[]
  categoryId: string
  category?: {
    name: string
  }
  status: string
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectionReason?: string
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
}

export default function SellerProducts() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (authLoading) return
    
    if (!user || user.role !== 'SELLER') {
      router.push('/auth/login')
      return
    }
    
    loadProducts()
    loadCategories()
  }, [user, authLoading])

  const loadProducts = async () => {
    try {
      const response = await productsApi.getMyProducts()
      setProducts(response)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll()
      console.log('Categories loaded:', response)
      setCategories(response)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await productsApi.delete(productId)
      toast.success('Product deleted successfully')
      loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleToggleStatus = async (product: Product) => {
    try {
      const newStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
      await productsApi.update(product.id, { status: newStatus })
      toast.success(`Product ${newStatus.toLowerCase()}`)
      loadProducts()
    } catch (error) {
      console.error('Error updating product status:', error)
      toast.error('Failed to update product status')
    }
  }

  if (authLoading || loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Product Catalog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Create, manage, and optimize your product listings to maximize sales
          </p>
          <button
            onClick={() => router.push('/seller/products/new')}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="text-xl">✨</span>
            Add New Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">📦</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{products.filter(p => p.approvalStatus === 'APPROVED').length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{products.filter(p => p.approvalStatus === 'PENDING').length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⏳</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-purple-600">{products.filter(p => p.status === 'ACTIVE').length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🟢</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-16 border border-white/50 shadow-xl text-center">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl">🛍️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No Products Yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Start building your product catalog! Add your first product to begin selling and reach more customers.
            </p>
            <button
              onClick={() => router.push('/seller/products/new')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>✨</span>
              Create Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="relative h-40 bg-gray-50 group">
                  <ProductImage
                    src={product.images}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    fallbackIcon={
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg text-gray-400">📦</span>
                      </div>
                    }
                    fallbackText="No Image"
                  />
                  
                  {/* Status Badges - Show on Hover */}
                  {/* Approval Status - Top Left */}
                  <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    product.approvalStatus === 'APPROVED' 
                      ? 'bg-green-500 text-white' 
                      : product.approvalStatus === 'REJECTED'
                      ? 'bg-red-500 text-white'
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {product.approvalStatus === 'APPROVED' ? 'Approved' : 
                     product.approvalStatus === 'REJECTED' ? 'Rejected' : 'Pending'}
                  </span>
                  
                  {/* Active Status - Top Right */}
                  <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                    product.status === 'ACTIVE' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {product.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                    {product.description}
                  </p>
                  
                  {/* Price and Stock */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    <span className="text-sm text-gray-600">{product.stock} in stock</span>
                  </div>
                  
                  {/* Category */}
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </div>

                  {/* Rejection Reason */}
                  {product.approvalStatus === 'REJECTED' && product.rejectionReason && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
                      <p className="text-red-700">{product.rejectionReason}</p>
                    </div>
                  )}

                  {/* Simple Action Buttons */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`flex-1 px-3 py-2 text-white text-sm rounded transition-colors ${
                          product.status === 'ACTIVE'
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {product.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Product Modal */}
      {console.log('Modal state:', { showCreateModal, editingProduct })}
      {(showCreateModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setShowCreateModal(false)
            setEditingProduct(null)
          }}
          onSave={() => {
            setShowCreateModal(false)
            setEditingProduct(null)
            loadProducts()
          }}
        />
      )}
    </div>
  )
}

// Product Modal Component
function ProductModal({ 
  product, 
  categories, 
  onClose, 
  onSave 
}: { 
  product: Product | null
  categories: Category[]
  onClose: () => void
  onSave: () => void
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    categoryId: product?.categoryId || '',
    status: product?.status || 'ACTIVE'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Ensure all required fields are present
      const submitData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price.toString()),
        stock: parseInt(formData.stock.toString()),
        categoryId: formData.categoryId || null,
        status: formData.status
      }

      console.log('Submitting product data:', submitData)
      console.log('Original form data:', formData)

      if (product) {
        await productsApi.update(product.id, submitData)
        toast.success('Product updated successfully')
      } else {
        await productsApi.create(submitData)
        toast.success('Product created successfully')
      }
      onSave()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error(`Failed to save product: ${error.message || 'Please try again'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 sm:top-20 mx-auto p-5 border w-full max-w-md sm:w-96 shadow-lg rounded-md bg-white m-4">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => {
                  console.log('Category selected:', e.target.value)
                  setFormData({ ...formData, categoryId: e.target.value })
                }}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (product ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
