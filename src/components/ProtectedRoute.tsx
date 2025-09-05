'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  /** The content to render when access is granted */
  children: React.ReactNode
  /** Whether admin privileges are required to access this route */
  requireAdmin?: boolean
  /** Custom redirect path for unauthorized users (defaults to '/login') */
  unauthorizedRedirectPath?: string
  /** Custom redirect path for non-admin users (defaults to '/dashboard') */
  forbiddenRedirectPath?: string
}

/**
 * A higher-order component that protects routes based on authentication status and user roles.
 * 
 * @param children - The components to render when access is granted
 * @param requireAdmin - Whether admin privileges are required
 * @param unauthorizedRedirectPath - Where to redirect unauthenticated users
 * @param forbiddenRedirectPath - Where to redirect users without sufficient privileges
 */
export function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  unauthorizedRedirectPath = '/login',
  forbiddenRedirectPath = '/dashboard'
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  /**
   * Handles the authentication and authorization logic
   */
  const handleRouteProtection = useCallback(() => {
    if (loading) return

    // Check if user is authenticated
    if (!user) {
      router.push(unauthorizedRedirectPath)
      return
    }

    // Check if admin access is required and user has admin role
    if (requireAdmin && user.role !== 'ADMIN') {
      router.push(forbiddenRedirectPath)
      return
    }
  }, [user, loading, router, requireAdmin, unauthorizedRedirectPath, forbiddenRedirectPath])

  useEffect(() => {
    handleRouteProtection()
  }, [handleRouteProtection])

  // Show loading state while authentication is being verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-gray-600">Verifying access permissions...</p>
        </div>
      </div>
    )
  }

  // Prevent flash of content while redirecting unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Prevent flash of content while redirecting users without sufficient privileges
  if (requireAdmin && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  // Render the protected content
  return <>{children}</>
}

/**
 * Type guard to check if a user has admin privileges
 */
export const isAdmin = (user: { role: string } | null): boolean => {
  return user?.role === 'ADMIN'
}

/**
 * Higher-order component specifically for admin-only routes
 */
export function AdminRoute({ children, ...props }: Omit<ProtectedRouteProps, 'requireAdmin'>) {
  return (
    <ProtectedRoute requireAdmin={true} {...props}>
      {children}
    </ProtectedRoute>
  )
}
