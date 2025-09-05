'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Clock, Users, BookOpen, Search } from 'lucide-react'
import Link from 'next/link'
import { formatTime, formatDate } from '@/lib/utils'

interface Exam {
  id: string
  title: string
  description: string | null
  duration: number
  createdAt: string
  createdBy: {
    name: string
  }
  _count: {
    submissions: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function ExamsPage() {
  const { token } = useAuth()
  const [exams, setExams] = useState<Exam[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchExams = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search })
      })

      const response = await fetch(`/api/exams?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setExams(data.exams)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching exams:', error)
    } finally {
      setLoading(false)
    }
  }, [token, pagination.page, pagination.limit, search])

  useEffect(() => {
    if (token) {
      fetchExams()
    }
  }, [token, fetchExams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  if (loading && exams.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 animate-fade-up">
          <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-[rgb(var(--brand-100))] to-white border border-[rgb(var(--border))]">
            <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">Available Exams</h1>
            <p className="mt-2 text-[rgb(var(--muted))]">
              Browse and take available examinations
            </p>
          </div>
        </div>

        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search exams..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>

        {exams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-md transition-shadow animate-fade-up">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="line-clamp-2">{exam.title}</span>
                    <BookOpen className="h-5 w-5 text-blue-600 ml-2 flex-shrink-0" />
                  </CardTitle>
                  <CardDescription>
                    Created by {exam.createdBy.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {exam.description && (
                    <p className="text-sm text-[rgb(var(--muted))] mb-4 line-clamp-3">
                      {exam.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-[rgb(var(--muted))] mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatTime(exam.duration)}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {exam._count.submissions} submissions
                    </div>
                  </div>

                  <div className="text-xs text-[rgb(var(--muted))] mb-4">
                    Created {formatDate(new Date(exam.createdAt))}
                  </div>

                  <Link href={`/exam/${exam.id}`}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Take Exam
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
            <p className="text-gray-500">
              {search ? 'Try adjusting your search terms' : 'No exams are currently available'}
            </p>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="mt-8 flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages}
            </span>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
