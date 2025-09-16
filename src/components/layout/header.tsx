'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X,
  Bell,
  ChevronDown,
  Store,
  Shield,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { authApi, cartApi, wishlistApi } from '@/lib/api'
import { toast } from 'sonner'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Load cart and wishlist when user is available
    if (user) {
      loadCartAndWishlist()
    }
  }, [user])

  // Handle click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  // Close dropdown on route change
  useEffect(() => {
    setIsUserMenuOpen(false)
  }, [pathname])

  // Listen for cart and wishlist updates
  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      setCartCount(event.detail.count)
    }

    const handleWishlistUpdate = (event: CustomEvent) => {
      setWishlistCount(event.detail.count)
    }

    window.addEventListener('cartUpdated' as any, handleCartUpdate)
    window.addEventListener('wishlistUpdated' as any, handleWishlistUpdate)

    return () => {
      window.removeEventListener('cartUpdated' as any, handleCartUpdate)
      window.removeEventListener('wishlistUpdated' as any, handleWishlistUpdate)
    }
  }, [])

  const loadCartAndWishlist = async () => {
    try {
      const [cartData, wishlistData] = await Promise.all([
        cartApi.getItems(),
        wishlistApi.getItems()
      ])
      setCartCount(Array.isArray(cartData) ? cartData.length : 0)
      setWishlistCount(Array.isArray(wishlistData) ? wishlistData.length : 0)
    } catch (error) {
      console.error('Error loading cart/wishlist:', error)
    }
  }


  const handleLogout = () => {
    setIsUserMenuOpen(false) // Close dropdown before logout
    logout()
    toast.success('Logged out successfully')
  }

  const getDashboardLink = () => {
    if (!user) return '/auth/login'
    
    if (user.role === 'ADMIN') return '/admin'
    if (user.role === 'SELLER') return '/seller/dashboard'
    return '/customer'
  }

  const getUserRoleDisplay = () => {
    if (!user) return ''
    
    if (user.role === 'ADMIN') {
      // Show specific admin role based on email
      if (user.email?.includes('developer')) return 'Developer'
      if (user.email?.includes('accounts')) return 'Accounts'
      return 'Admin'
    }
    if (user.role === 'SELLER') return 'Seller'
    return 'Customer'
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg flex items-center justify-center"
            >
              <Store className="w-6 h-6 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">MarketPlace</h1>
              <p className="text-xs text-muted-foreground">Multi-Vendor Store</p>
            </div>
          </Link>


          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {user ? (
              <>
                {/* Wishlist */}
                <Link href="/wishlist">
                  <Button variant="ghost" size="icon" className="relative hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                    {wishlistCount > 0 && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium shadow-lg">
                        {wishlistCount > 99 ? '99+' : wishlistCount}
                      </div>
                    )}
                  </Button>
                </Link>

                {/* Cart */}
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative hover:bg-gray-50 transition-colors">
                    <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors" />
                    {cartCount > 0 && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium shadow-lg animate-pulse">
                        {cartCount > 99 ? '99+' : cartCount}
                      </div>
                    )}
                  </Button>
                </Link>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium">{user.firstName}</p>
                      <p className="text-xs text-muted-foreground">{getUserRoleDisplay()}</p>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b">
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        
                        <Link
                          href={getDashboardLink()}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {user.role === 'ADMIN' ? (
                            <Shield className="w-4 h-4" />
                          ) : user.role === 'SELLER' ? (
                            <Store className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                          <span>Dashboard</span>
                        </Link>

                        {user.role === 'ADMIN' && (
                          <>
                            {/* Developer role gets full access */}
                            {(user.email?.includes('developer') || !user.email?.includes('accounts')) && (
                              <>
                                <Link
                                  href="/admin/sellers"
                                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  <Shield className="w-4 h-4" />
                                  <span>Seller Approvals</span>
                                </Link>
                                <Link
                                  href="/admin/products"
                                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  <Shield className="w-4 h-4" />
                                  <span>Product Approvals</span>
                                </Link>
                                <Link
                                  href="/admin/analytics"
                                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  <Shield className="w-4 h-4" />
                                  <span>Analytics</span>
                                </Link>
                              </>
                            )}
                            
                            {/* Both Developer and Accounts roles get order management */}
                            <Link
                              href="/admin/orders"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Bell className="w-4 h-4" />
                              <span>Order Management</span>
                            </Link>
                            
                            {/* Both roles get profile settings */}
                            <Link
                              href="/admin/profile"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <User className="w-4 h-4" />
                              <span>Profile Settings</span>
                            </Link>
                          </>
                        )}

                        {user.role === 'SELLER' && (
                          <>
                            <Link
                              href="/seller/products"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Store className="w-4 h-4" />
                              <span>My Products</span>
                            </Link>
                            <Link
                              href="/seller/orders"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Bell className="w-4 h-4" />
                              <span>My Orders</span>
                            </Link>
                          </>
                        )}

                        {user.role === 'CUSTOMER' && (
                          <>
                            <Link
                              href="/customer/wishlist"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Heart className="w-4 h-4" />
                              <span>My Wishlist</span>
                            </Link>
                            <Link
                              href="/customer/cart"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>My Cart</span>
                            </Link>
                            <Link
                              href="/customer/orders"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Bell className="w-4 h-4" />
                              <span>My Orders</span>
                            </Link>
                          </>
                        )}

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl z-50 md:hidden"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 space-y-4">

              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  href="/categories"
                  className="block py-2 text-lg hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  href="/deals"
                  className="block py-2 text-lg hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Deals
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.header>
  )
}