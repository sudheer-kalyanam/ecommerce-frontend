'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { productsApi, categoriesApi } from '@/lib/api'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    status: 'ACTIVE'
  })
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string[]>([])

  useEffect(() => {
    if (authLoading) return
    
    if (!user || user.role !== 'SELLER') {
      router.push('/auth/login')
      return
    }
    
    loadCategories()
  }, [user, authLoading])

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getAll()
      // Ensure response is an array of Category
      if (Array.isArray(response)) {
        setCategories(response as Category[])
      } else {
        setCategories([])
        toast.error('Invalid categories data received')
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    setSelectedImages(files)
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreview(previews)
  }

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    const newPreviews = imagePreview.filter((_, i) => i !== index)
    
    setSelectedImages(newImages)
    setImagePreview(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Please enter a product name')
      return
    }
    
    if (!formData.description.trim()) {
      toast.error('Please enter a product description')
      return
    }
    
    if (!formData.price || formData.price.trim() === '') {
      toast.error('Please enter a price')
      return
    }
    
    if (!formData.stock || formData.stock.trim() === '') {
      toast.error('Please enter a stock quantity')
      return
    }
    
    if (!formData.categoryId) {
      toast.error('Please select a category')
      return
    }
    
    setLoading(true)

    try {
      // Validate and convert price and stock to numbers
      const price = parseFloat(formData.price)
      const stock = parseInt(formData.stock)
      
      if (isNaN(price) || price < 0) {
        toast.error('Please enter a valid price (must be a number >= 0)')
        return
      }
      
      if (isNaN(stock) || stock < 0) {
        toast.error('Please enter a valid stock quantity (must be a number >= 0)')
        return
      }

      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('price', price.toString())
      submitData.append('stock', stock.toString())
      submitData.append('categoryId', formData.categoryId)
      submitData.append('status', formData.status)
      
      // Add images
      selectedImages.forEach((image, index) => {
        submitData.append('images', image)
      })

      console.log('Submitting product data with images:', selectedImages.length)
      
      // Use the new endpoint for image uploads
      const response = await fetch('http://localhost:3000/api/v1/products/with-images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: submitData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create product')
      }

      const result = await response.json()
      toast.success('Product created successfully')
      
      // Clear form
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        status: 'ACTIVE'
      })
      setSelectedImages([])
      setImagePreview([])
      
      router.push('/seller/products')
    } catch (error: any) {
      console.error('Error creating product:', error)
      const errorMessage = error.message || 'Please try again'
      toast.error(`Failed to create product: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-300 font-medium"
          >
            ← Back to Products
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Add New Product
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create a stunning product listing that will attract customers and boost your sales
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                placeholder="Enter an amazing product name..."
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-800">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500 resize-none"
                placeholder="Describe your product in detail to attract customers..."
              />
            </div>

            {/* Enhanced Image Uploader */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-800">
                Product Images
              </label>
              
              {/* Upload Area */}
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-2xl p-8 text-center hover:from-blue-100 hover:to-purple-100 hover:border-blue-400 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📸</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Drag & Drop Images Here
                  </h3>
                  <p className="text-gray-600 mb-4">
                    or click to browse your computer
                  </p>
                  <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Choose Images
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    Upload up to 5 images • JPEG, PNG, WebP • Max 5MB each
                  </p>
                </div>
              </div>
              
              {/* Enhanced Image Preview */}
              {imagePreview.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Selected Images ({imagePreview.length}/5)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="group relative">
                        <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-lg border-2 border-gray-100 group-hover:border-blue-300 transition-all duration-300">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Price (₹) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg">₹</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="99.99"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Stock Quantity *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg">📦</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Category *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg">🏷️</span>
                  </div>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="">Choose a category...</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-gray-400">▼</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Status
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg">⚡</span>
                  </div>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="ACTIVE">🟢 Active</option>
                    <option value="INACTIVE">🔴 Inactive</option>
                    <option value="OUT_OF_STOCK">📦 Out of Stock</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-gray-400">▼</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500/20 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Product...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>✨</span>
                    Create Product
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
