/**
 * Authentication utility functions
 */

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('auth_token', token)
}

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth_token')
}

export const getUserData = (): any | null => {
  if (typeof window === 'undefined') return null
  const userData = localStorage.getItem('user_data')
  if (!userData) return null
  
  try {
    return JSON.parse(userData)
  } catch (error) {
    console.error('Error parsing user data:', error)
    return null
  }
}

export const setUserData = (userData: any): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('user_data', JSON.stringify(userData))
}

export const removeUserData = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('user_data')
}

export const isAuthenticated = (): boolean => {
  const token = getAuthToken()
  const userData = getUserData()
  return !!(token && userData)
}

export const clearAuth = (): void => {
  removeAuthToken()
  removeUserData()
}
