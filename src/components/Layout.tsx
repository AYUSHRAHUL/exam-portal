'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { 
  BookOpen, 
  User, 
  LogOut, 
  Settings, 
  BarChart3,
  Home
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, loggingOut } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Exams', href: '/exams', icon: BookOpen },
    ...(user?.role === 'ADMIN' ? [
      { name: 'Admin Panel', href: '/admin', icon: Settings },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 }
    ] : [
      { name: 'My Results', href: '/results', icon: BarChart3 }
    ])
  ]

  return (
    <div className="min-h-screen bg-[rgb(var(--background))]">
      <nav className="bg-[rgb(var(--card))] border-b border-[rgb(var(--border))] backdrop-blur supports-[backdrop-filter]:bg-white/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-xl font-bold text-[rgb(var(--foreground))]">
                  ExamPortal
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="inline-flex items-center px-2 pt-1 border-b-2 border-transparent text-sm font-medium text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] hover:border-[rgb(var(--border))] transition-colors"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-[rgb(var(--muted))]" />
                <span className="text-sm text-[rgb(var(--foreground))]">{user?.name}</span>
                <span className="text-xs text-[rgb(var(--muted))] bg-[rgb(var(--brand-50))] px-2 py-1 rounded-full">
                  {user?.role}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                loading={loggingOut}
                disabled={loggingOut}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {loggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
