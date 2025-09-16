'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mockOtp, setMockOtp] = useState<string | null>(null);
  const [showMockOtp, setShowMockOtp] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        console.log('🔐 [LOGIN PAGE] User already logged in, redirecting based on role:', user.role);
        
        // Redirect based on user role
        if (user.role === 'ADMIN') {
          console.log('🎯 [LOGIN PAGE] Redirecting existing admin user to /admin');
          router.push('/admin');
        } else if (user.role === 'SELLER') {
          console.log('🎯 [LOGIN PAGE] Redirecting existing seller user to /seller');
          router.push('/seller');
        } else {
          console.log('🎯 [LOGIN PAGE] Redirecting existing customer user to /customer');
          router.push('/customer');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // If user data is corrupted, clear it and stay on login page
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔐 [LOGIN PAGE] Form submission started:', {
      email: formData.email,
      hasPassword: !!formData.password,
      timestamp: new Date().toISOString()
    });

    try {
      const response:any = await authApi.login(formData);
      console.log('📥 [LOGIN PAGE] Login response received:', response);
      
      // Handle OTP requirement
      if (response.requiresOTP) {
        console.log('📧 [LOGIN PAGE] OTP required, showing mock OTP');
        
        // Generate a mock OTP for display
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setMockOtp(generatedOtp);
        setShowMockOtp(true);
        
        toast.success('OTP generated! Check the mock OTP below for testing.');
        
        // Start countdown timer
        setRedirectCountdown(5);
        const countdownInterval = setInterval(() => {
          setRedirectCountdown(prev => {
            if (prev === null || prev <= 1) {
              clearInterval(countdownInterval);
              router.push(`/auth/verify-otp?userId=${response.userId}&purpose=login&email=${formData.email}`);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
        
        return;
      }
      
      // Handle successful login with token
      if (response.access_token && response.user) {
        console.log('✅ [LOGIN PAGE] Login successful, storing token and user data');
        console.log('👤 [LOGIN PAGE] User data received:', {
          id: response.user.id,
          email: response.user.email,
          role: response.user.role,
          firstName: response.user.firstName,
          lastName: response.user.lastName
        });
        
        localStorage.setItem('auth_token', response.access_token);
        localStorage.setItem('user_data', JSON.stringify(response.user));
        
        toast.success('Login successful!');
        
        // Redirect based on user role
        console.log('🔄 [LOGIN PAGE] Redirecting based on user role:', response.user.role);
        console.log('🔍 [LOGIN PAGE] Role comparison:', {
          'response.user.role': response.user.role,
          'typeof role': typeof response.user.role,
          'role === "ADMIN"': response.user.role === 'ADMIN',
          'role === "SELLER"': response.user.role === 'SELLER'
        });
        
        if (response.user.role === 'ADMIN') {
          console.log('🎯 [LOGIN PAGE] Redirecting to /admin');
          router.push('/admin');
        } else if (response.user.role === 'SELLER') {
          console.log('🎯 [LOGIN PAGE] Redirecting to /seller');
          router.push('/seller');
        } else {
          console.log('🎯 [LOGIN PAGE] Redirecting to /customer (default)');
          router.push('/customer');
        }
      } else {
        console.log('❌ [LOGIN PAGE] Invalid response format:', response);
        setError('Invalid response from server');
      }
    } catch (error: any) {
      console.error('❌ [LOGIN PAGE] Login error:', {
        error: error.response?.data || error.message,
        status: error.response?.status,
        code: error.code,
        timestamp: new Date().toISOString()
      });
      
      // Handle specific error types
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        setError('Connection timeout. Please check your internet connection and try again.');
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else if (error.response?.status === 401) {
        setError(error.response?.data?.message || 'Invalid email or password');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(error.response?.data?.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <button
              onClick={() => router.push('/auth/register')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </button>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your email and password to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Mock OTP Display for Testing */}
            {showMockOtp && mockOtp && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertDescription>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      🔐 Mock OTP for Testing
                    </h3>
                    <div className="bg-white border-2 border-green-300 rounded-lg p-4 mb-2">
                      <div className="text-3xl font-bold text-green-600 tracking-wider">
                        {mockOtp}
                      </div>
                    </div>
                    <p className="text-sm text-green-700">
                      Use this OTP code on the verification page
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Valid for 10 minutes • Generated at {new Date().toLocaleTimeString()}
                    </p>
                    {redirectCountdown !== null && (
                      <p className="text-sm text-orange-600 mt-2 font-medium">
                        ⏰ Redirecting to verification page in {redirectCountdown} seconds...
                      </p>
                    )}
                    <div className="mt-3 flex gap-2 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMockOtp(false)}
                        className="text-green-600 border-green-300 hover:bg-green-50"
                      >
                        Hide OTP
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                          setMockOtp(newOtp);
                        }}
                        className="text-green-600 border-green-300 hover:bg-green-50"
                      >
                        Generate New
                      </Button>
                    </div>
                    {redirectCountdown !== null && (
                      <div className="mt-3">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            setRedirectCountdown(null);
                            router.push(`/auth/verify-otp?userId=${searchParams.get('userId')}&purpose=login&email=${formData.email}`);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Go to Verification Now
                        </Button>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/auth/register')}
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </button>
              </p>
            </div>

            {/* Testing Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">For Testing Purposes</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const testOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    setMockOtp(testOtp);
                    setShowMockOtp(true);
                    toast.success('Mock OTP generated for testing!');
                  }}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  🔐 Generate Test OTP
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Loading...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we load the login page.
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}