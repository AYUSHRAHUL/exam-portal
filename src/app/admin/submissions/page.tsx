'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Users, 
  Search,
  Download,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Submission {
  id: string
  score: number
  totalScore: number
  completedAt: string
  timeSpent: number
  exam: {
    id: string
    title: string
  }
  user: {
    id: string
    name: string
    email: string
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function AdminSubmissionsPage() {
  const { user, token } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      })

      const response = await fetch(`/api/admin/submissions?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }, [token, pagination.page, pagination.limit])

  useEffect(() => {
    if (token && user?.role === 'ADMIN') {
      fetchSubmissions()
    }
  }, [token, user, fetchSubmissions])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const exportToCSV = () => {
    const csvContent = [
      ['Student Name', 'Email', 'Exam', 'Score', 'Total Score', 'Percentage', 'Time Spent', 'Completed At'],
      ...submissions.map(sub => [
        sub.user.name,
        sub.user.email,
        sub.exam.title,
        sub.score.toString(),
        sub.totalScore.toString(),
        Math.round((sub.score / sub.totalScore) * 100).toString(),
        sub.timeSpent.toString(),
        new Date(sub.completedAt).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `exam-submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100'
    if (percentage >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  if (user?.role !== 'ADMIN') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500">You need admin privileges to access this page.</p>
        </div>
      </Layout>
    )
  }

  if (loading && submissions.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    )
  }

  const averageScore = submissions.length > 0 
    ? submissions.reduce((sum, sub) => sum + (sub.score / sub.totalScore * 100), 0) / submissions.length
    : 0

  const totalSubmissions = pagination.total
  const passedSubmissions = submissions.filter(sub => (sub.score / sub.totalScore * 100) >= 60).length

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-[rgb(var(--brand-100))] to-white border border-[rgb(var(--border))]">
              <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">Student Submissions</h1>
              <p className="mt-2 text-[rgb(var(--muted))]">
                View and analyze student exam submissions
              </p>
            </div>
            <Button onClick={exportToCSV} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow animate-fade-up anim-delay-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubmissions}</div>
              <p className="text-xs text-[rgb(var(--muted))]">
                All time
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow animate-fade-up anim-delay-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(averageScore)}%</div>
              <p className="text-xs text-[rgb(var(--muted))]">
                Overall performance
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow animate-fade-up anim-delay-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {submissions.length > 0 ? Math.round((passedSubmissions / submissions.length) * 100) : 0}%
              </div>
              <p className="text-xs text-[rgb(var(--muted))]">
                {passedSubmissions} passed
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow animate-fade-up anim-delay-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {submissions.length > 0 
                  ? Math.round(submissions.reduce((sum, sub) => sum + sub.timeSpent, 0) / submissions.length)
                  : 0
                }m
              </div>
              <p className="text-xs text-[rgb(var(--muted))]">
                Per exam
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by student name or exam..."
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

        {/* Submissions Table */}
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>
              Latest student exam submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map((submission) => {
                  const percentage = Math.round((submission.score / submission.totalScore) * 100)
                  return (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg bg-[rgb(var(--card))] animate-fade-up">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-[rgb(var(--foreground))]">{submission.user.name}</h3>
                          <span className="text-sm text-[rgb(var(--muted))]">({submission.user.email})</span>
                        </div>
                        <div className="text-sm text-[rgb(var(--muted))]">
                          <span className="font-medium">{submission.exam.title}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(new Date(submission.completedAt))}</span>
                          <span className="mx-2">•</span>
                          <span>{submission.timeSpent} minutes</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getScoreColor(percentage)}`}>
                            {percentage}%
                          </div>
                          <div className="text-sm text-[rgb(var(--muted))]">
                            {submission.score}/{submission.totalScore}
                          </div>
                        </div>
                        
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreBgColor(percentage)} ${getScoreColor(percentage)}`}>
                          {percentage >= 80 ? 'Excellent' : percentage >= 60 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                <p className="text-gray-500">Student submissions will appear here once they start taking exams.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
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
