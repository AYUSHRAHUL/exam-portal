import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple JWT verification for Edge Runtime
function verifyTokenEdge(token: string): { id: string; email: string; role: string } | null {
  try {
    // Split the JWT token
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Decode the payload (middle part)
    const payload = parts[1]
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4)
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'))
    const parsedPayload = JSON.parse(decodedPayload)

    // Check if token is expired
    if (parsedPayload.exp && Date.now() >= parsedPayload.exp * 1000) {
      return null
    }

    return {
      id: parsedPayload.id,
      email: parsedPayload.email,
      role: parsedPayload.role
    }
  } catch (error) {
    return null
  }
}

export function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  const { pathname } = request.nextUrl

  // Only protect API routes in middleware to avoid interfering with client navigation
  const isApiRoute = pathname.startsWith('/api')
  if (!isApiRoute) {
    return NextResponse.next()
  }

  // Skip authentication for auth routes (login, register)
  const isAuthRoute = pathname.startsWith('/api/auth/')
  if (isAuthRoute) {
    return NextResponse.next()
  }

  // Check for token on protected API routes
  if (!token) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  const user = verifyTokenEdge(token)
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }

  // Check admin-only API routes
  const isAdminApi = pathname.startsWith('/api/admin')
  if (isAdminApi && user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    )
  }

  // Add user to headers for API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', user.id)
  requestHeaders.set('x-user-role', user.role)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/api/:path*'
  ]
}
