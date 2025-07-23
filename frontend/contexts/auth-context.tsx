"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { apiClient } from "@/lib/api"

interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

interface AuthContextType {
  user: User | null
  userProfile: User | null
  loading: boolean
  initialized: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, username: string) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (updates: any) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  const validateToken = useCallback(async () => {
    try {
      console.log('🔍 Starting token validation...')
      
      // First, check if backend is reachable
      try {
        const healthCheck = await apiClient.healthCheck()
        console.log('🔧 Backend health check:', healthCheck)
        if (healthCheck.error) {
          console.warn('⚠️ Backend health check failed:', healthCheck.error)
          return false
        }
      } catch (error) {
        console.warn('⚠️ Backend health check failed:', error)
        return false
      }
      
      // Try to get profile with a shorter timeout
    try {
      const profileResult = await apiClient.getProfile()
        console.log('🔍 Profile result:', profileResult)
        
      if (!profileResult.error && profileResult.data) {
        const userData = profileResult.data as User
          console.log('✅ User authenticated:', userData)
        setUser(userData)
        setUserProfile(userData)
          return true
        }
      } catch (error) {
        console.log('❌ Profile fetch failed:', error)
      }
      
      // If profile fetch failed, try token refresh
      console.log('🔄 Attempting token refresh...')
      try {
      const refreshResult = await apiClient.refreshToken()
        console.log('🔍 Refresh result:', refreshResult)
        
      if (!refreshResult.error) {
          // Try profile fetch again after refresh
        const retryResult = await apiClient.getProfile()
          console.log('🔍 Retry profile result:', retryResult)
          
        if (!retryResult.error && retryResult.data) {
          const userData = retryResult.data as User
            console.log('✅ User authenticated after refresh:', userData)
          setUser(userData)
          setUserProfile(userData)
            return true
          }
        }
      } catch (error) {
        console.log('❌ Token refresh failed:', error)
      }
      
      console.log('❌ Authentication failed - user not authenticated')
      setUser(null)
      setUserProfile(null)
      return false
    } catch (error) {
      console.error('❌ Token validation error:', error)
      setUser(null)
      setUserProfile(null)
      return false
    }
  }, [])

  const refreshUser = useCallback(async () => {
    await validateToken()
  }, [validateToken])

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        setLoading(true)
        console.log('🚀 Initializing authentication...')
        
        // Use a shorter timeout for the entire initialization
        const initTimeout = setTimeout(() => {
          if (isMounted) {
            console.warn('⚠️ Authentication initialization timeout, forcing completion')
            setUser(null)
            setUserProfile(null)
            setLoading(false)
            setInitialized(true)
          }
        }, 8000) // 8 second timeout
        
        await validateToken()
        
        if (isMounted) {
          clearTimeout(initTimeout)
          console.log('✅ Authentication initialization complete')
          setLoading(false)
          setInitialized(true)
        }
      } catch (error) {
        console.error('❌ Authentication initialization error:', error)
        if (isMounted) {
      setUser(null)
      setUserProfile(null)
      setLoading(false)
      setInitialized(true)
    }
  }
    }

    initializeAuth()

    return () => {
      isMounted = false
    }
  }, [validateToken])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('signIn called with', email);
      const { data, error } = await apiClient.login(email, password);
      console.log('apiClient.login result:', { data, error });
      if (error) return { data: null, error: typeof error === 'string' ? error : (error && typeof error === 'object' && 'message' in error ? (error as any).message : 'Error en el inicio de sesión') };
      // After successful login, get the user profile directly
      const profileResult = await apiClient.getProfile();
      console.log('apiClient.getProfile result:', profileResult);
      if (!profileResult.error && profileResult.data) {
        const userData = profileResult.data as User;
        setUser(userData);
        setUserProfile(userData);
        return { data: userData, error: null };
      }
      return { data: null, error: 'Error al obtener el perfil del usuario después del inicio de sesión' };
    } catch (error) {
      console.error('signIn error:', error);
      return { data: null, error: error instanceof Error ? error.message : 'Error en el inicio de sesión' };
    }
  }

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await apiClient.register(email, password, username)
      if (error) return { data: null, error: { message: error } }
      
      // After successful registration, get the user profile directly
      const profileResult = await apiClient.getProfile()
      if (!profileResult.error && profileResult.data) {
        const userData = profileResult.data as User
        setUser(userData)
        setUserProfile(userData)
        return { data: userData, error: null }
      }
      
      return { data: null, error: { message: 'Error al obtener el perfil del usuario después del registro' } }
    } catch (error) {
      return { data: null, error: { message: error instanceof Error ? error.message : 'Error en el registro' } }
    }
  }

  const signOut = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      setUser(null)
      setUserProfile(null)
    }
  }

  const updateProfile = async (updates: any) => {
    try {
      const { data, error } = await apiClient.updateUser(user?.id || 0, updates)
      if (error) throw new Error(error)
      
      if (data) {
        setUser(data as User)
        setUserProfile(data as User)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
