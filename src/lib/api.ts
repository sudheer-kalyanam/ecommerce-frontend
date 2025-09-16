import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const API_BASE_URL = 'http://localhost:3000/api/v1'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Only redirect to login if it's not a login/register/otp endpoint
        const isAuthEndpoint = error.config?.url?.includes('/auth/')
        
        if (error.response?.status === 401 && !isAuthEndpoint) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_data')
            window.location.href = '/auth/login'
          }
        }
        
        // Don't show toast for auth endpoints to prevent duplicate error messages
        if (!isAuthEndpoint) {
          const message = error.response?.data?.message || 'An error occurred'
          toast.error(message)
        }
        
        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config)
    return response.data
  }

  async upload<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    })
    return response.data
  }
}

export const api = new ApiClient()

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: any) =>
    api.post('/auth/register', userData),
  
  verifyOtp: (data: { userId: string; otpCode: string; purpose: string }) =>
    api.post('/auth/verify-otp', data),
  
  resendOtp: (data: { userId: string; purpose: string }) =>
    api.post('/auth/resend-otp', data),
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
  },
}

// Products API
export const productsApi = {
  getAll: (params?: any) =>
    api.get('/products', { params }),
  
  getById: (id: string, params?: any) =>
    api.get(`/products/${id}`, { params }),
  
  search: (query: string) =>
    api.get(`/products/search?q=${encodeURIComponent(query)}`),
  
  getRecommendations: () =>
    api.get('/products/recommendations'),
  
  getDeliveryEstimate: (data: any) =>
    api.post('/products/delivery-estimate', data),
  
  getBySlug: (slug: string) =>
    api.get(`/products/slug/${slug}`),
  
  getMyProducts: () =>
    api.get('/products/seller/my-products'),
  
  create: (data: any) =>
    api.post('/products', data),
  
  update: (id: string, data: any) =>
    api.patch(`/products/${id}`, data),

  // Admin product approval endpoints
  getPendingProducts: () =>
    api.get('/products/admin/pending'),
  
  approveProduct: (data: { productId: string; action: 'APPROVED' | 'REJECTED'; rejectionReason?: string }) =>
    api.post('/products/admin/approve', data),

  getRejectedProducts: () =>
    api.get('/products/admin/rejected'),

  // Customer endpoints
  getApprovedProducts: () =>
    api.get('/products/customer/approved'),
  
  delete: (id: string) =>
    api.delete(`/products/${id}`),
}

// Categories API
export const categoriesApi = {
  getAll: () =>
    api.get('/categories'),
  
  getHierarchy: () =>
    api.get('/categories/hierarchy'),
  
  getById: (id: string) =>
    api.get(`/categories/${id}`),
}

// Cart API
export const cartApi = {
  getItems: () =>
    api.get('/customers/cart'),
  
  addItem: (data: { productId: string; quantity: number; sellerId?: string }) =>
    api.post('/customers/cart', data),
  
  updateItem: (id: string, data: { quantity: number }) =>
    api.patch(`/customers/cart/${id}`, data),
  
  removeItem: (id: string) =>
    api.delete(`/customers/cart/${id}`),
  
  clear: () =>
    api.delete('/customers/cart'),
}

// Wishlist API
export const wishlistApi = {
  getItems: () =>
    api.get('/customers/wishlist'),
  
  addItem: (data: { productId: string }) =>
    api.post('/customers/wishlist', data),
  
  removeItem: (productId: string) =>
    api.delete(`/customers/wishlist/${productId}`),
  
  clear: () =>
    api.delete('/customers/wishlist'),
}

// Orders API
export const ordersApi = {
  getOrders: () =>
    api.get('/customers/orders'),
  
  getById: (id: string) =>
    api.get(`/customers/orders/${id}`),
  
  createOrder: (data: {
    items: Array<{
      productId: string;
      sellerId: string;
      quantity: number;
      price: number;
    }>;
    deliveryAddress: any;
    paymentMethod: string;
    totalAmount: number;
  }) =>
    api.post('/customers/orders', data),
  
  cancelOrder: (id: string) =>
    api.patch(`/customers/orders/${id}/cancel`),
  
  processPayment: (orderId: string, paymentData: {
    paymentId: string;
    orderId: string;
    signature: string;
  }) =>
    api.post(`/customers/orders/${orderId}/process-payment`, paymentData),
}

// User API
export const userApi = {
  getProfile: () =>
    api.get('/users/profile'),
  
  updateProfile: (data: any) =>
    api.put('/users/profile', data),
  
  enable2FA: () =>
    api.post('/users/2fa/enable'),
  
  disable2FA: () =>
    api.delete('/users/2fa/disable'),
}

// Seller API
export const sellerApi = {
  register: (data: any) =>
    api.post('/sellers/register', data),
  
  getProfile: () =>
    api.get('/sellers/profile'),
  
  updateProfile: (data: any) =>
    api.patch('/sellers/profile', data),
  
  getStats: () =>
    api.get('/sellers/stats'),
  
  uploadDocument: (formData: FormData) =>
    api.upload('/sellers/documents/upload', formData),
}

// Admin API
export const adminApi = {
  getDashboardStats: () =>
    api.get('/admin/dashboard'),
  
  getAllUsers: () =>
    api.get('/admin/users'),
  
  getAllSellers: () =>
    api.get('/admin/sellers'),
  
  getAllProducts: () =>
    api.get('/admin/products'),
  
  getAllOrders: () =>
    api.get('/admin/orders'),
  
  getPendingSellers: () =>
    api.get('/admin/pending-sellers'),
  
  approveSeller: (id: string) =>
    api.patch(`/sellers/${id}/approve`),
  
  rejectSeller: (id: string, reason: string) =>
    api.patch(`/sellers/${id}/reject`, { reason }),
  
  getPendingProducts: () =>
    api.get('/admin/pending-products'),
  
  approveProduct: (id: string) =>
    api.patch(`/products/${id}/approve`),
  
  rejectProduct: (id: string, reason: string) =>
    api.patch(`/products/${id}/reject`, { reason }),
  
  // Admin Roles
  getAllRoles: () =>
    api.get('/admin/roles'),
  
  getRoleById: (id: string) =>
    api.get(`/admin/roles/${id}`),
  
  getUserRoles: (userId: string) =>
    api.get(`/admin/users/${userId}/roles`),
}

// Delivery API
export const deliveryApi = {
  trackOrder: (orderNumber: string) =>
    api.get(`/delivery/track/${orderNumber}`),
  
  getEstimate: (data: { pincode: string; sellerId: string }) =>
    api.post('/delivery/estimate', data),
  
  updateOrderStatus: (data: { orderNumber: string; status: string }) =>
    api.post('/delivery/update-status', data),
}

// Payments API
export const paymentsApi = {
  createStripePayment: (orderId: string, amount: number) =>
    api.post('/payments/stripe/create', { orderId, amount }),
  
  createRazorpayOrder: (orderId: string, amount: number) =>
    api.post('/payments/razorpay/create', { orderId, amount }),
  
  verifyStripePayment: (paymentIntentId: string) =>
    api.post('/payments/stripe/verify', { paymentIntentId }),
  
  verifyRazorpayPayment: (paymentData: any) =>
    api.post('/payments/razorpay/verify', paymentData),
  
  getPaymentHistory: () =>
    api.get('/payments/history'),
}

// Seller Registration API
export const sellerRegistrationApi = {
  register: (data: any) =>
    api.post('/seller-registration/register', data),
  
  registerWithFiles: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/seller-registration/register-with-files`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    return response.json();
  },
  
  verifyOTP: (data: { email: string; otp: string; registrationData: any }) =>
    api.post('/seller-registration/verify-otp', data),
  
  getStatus: (email: string) =>
    api.get(`/seller-registration/status/${email}`),
  
  getPendingRegistrations: () =>
    api.get('/seller-registration/pending'),
  
  getApprovedRegistrations: () =>
    api.get('/seller-registration/approved'),
  
  getRejectedRegistrations: () =>
    api.get('/seller-registration/rejected'),
  
  getRegistrationById: (id: string) =>
    api.get(`/seller-registration/${id}`),
  
  approveSeller: (data: { registrationId: string; action: 'APPROVE' | 'REJECT'; rejectionReason?: string }) =>
    api.post('/seller-registration/approve', data),
  
  createUserAccount: (data: { email: string }) =>
    api.post('/seller-registration/create-account', data),
  
  downloadDocument: (registrationId: string, fileType: 'businessLicense' | 'idProof') =>
    api.get(`/seller-registration/download/${registrationId}/${fileType}`, {
      responseType: 'blob'
    }),
}

// Seller Orders API
export const sellerOrdersApi = {
  getMyOrders: () =>
    api.get('/sellers/orders'),
  
  getOrderById: (id: string) =>
    api.get(`/sellers/orders/${id}`),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/sellers/orders/${id}/status`, { status }),
  
  getOrderStats: () =>
    api.get('/sellers/orders/stats'),
}

// Admin Orders API
export const adminOrdersApi = {
  getAllOrders: () =>
    api.get('/admin/orders'),
  
  getOrderById: (id: string) =>
    api.get(`/admin/orders/${id}`),
  
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/admin/orders/${id}/status`, { status }),
  
  getOrderStats: () =>
    api.get('/admin/orders/stats'),
  
  getDashboardStats: () =>
    api.get('/admin/orders/stats/dashboard'),
  
  getAnalyticsStats: () =>
    api.get('/admin/orders/stats/analytics'),
}