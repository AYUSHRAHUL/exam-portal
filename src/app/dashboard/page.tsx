'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BookOpen, Users, BarChart3, Clock } from 'lucide-react'
import Link from 'next/link'

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

interface Submission {
  id: string
  score: number
  totalScore: number
  completedAt: string
  exam: {
    id: string
    title: string
  }
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const [exams, setExams] = useState<Exam[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    try {
      const [examsRes, submissionsRes] = await Promise.all([
        fetch('/api/exams?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/submissions?limit=5', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (examsRes.ok) {
        const examsData = await examsRes.json()
        setExams(examsData.exams)
      }

      if (submissionsRes.ok) {
        const submissionsData = await submissionsRes.json()
        setSubmissions(submissionsData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchDashboardData()
    }
  }, [token, fetchDashboardData])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    )
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 animate-fade-up">
          <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-r from-[rgb(var(--brand-100))] to-white border border-[rgb(var(--border))]">
            {/* decorative blobs */}
            <div className="pointer-events-none absolute -top-6 -right-6 w-28 h-28 rounded-full bg-blue-200/40 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-purple-200/40 blur-2xl" />
            <h1 className="text-3xl md:text-4xl font-bold text-[rgb(var(--foreground))]">
              Welcome back, {user?.name}!
            </h1>
            <p className="mt-2 text-[rgb(var(--muted))]">
              {user?.role === 'ADMIN' 
                ? 'Manage exams and view student performance' 
                : 'Take exams and track your progress'
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow animate-fade-up anim-delay-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.length}</div>
              <p className="text-xs text-[rgb(var(--muted))]">
                Active exams
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow animate-fade-up anim-delay-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Submissions</CardTitle>
              <BarChart3 className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
              <p className="text-xs text-[rgb(var(--muted))]">
                Completed exams
              </p>
            </CardContent>
          </Card>

          {user?.role === 'ADMIN' && (
            <Card className="hover:shadow-md transition-shadow animate-fade-up anim-delay-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {exams.reduce((sum, exam) => sum + exam._count.submissions, 0)}
                </div>
                <p className="text-xs text-[rgb(var(--muted))]">
                  Across all exams
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="hover:shadow-md transition-shadow animate-fade-up anim-delay-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {submissions.length > 0 
                  ? Math.round((submissions.reduce((sum, sub) => sum + (sub.score / sub.totalScore * 100), 0) / submissions.length))
                  : 0
                }%
              </div>
              <p className="text-xs text-[rgb(var(--muted))]">
                Your performance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-up">
          <Link href="/exams" className="group">
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[rgb(var(--muted))]">Explore</div>
                  <div className="text-lg font-semibold text-[rgb(var(--foreground))]">Browse Exams</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
          <Link href="/results" className="group">
            <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 hover:border-emerald-200 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[rgb(var(--muted))]">Track</div>
                  <div className="text-lg font-semibold text-[rgb(var(--foreground))]">View Results</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Link>
          {user?.role === 'ADMIN' && (
            <Link href="/admin" className="group">
              <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-4 hover:border-purple-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[rgb(var(--muted))]">Manage</div>
                    <div className="text-lg font-semibold text-[rgb(var(--foreground))]">Admin Panel</div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Exams</CardTitle>
              <CardDescription>
                Latest available exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exams.length > 0 ? (
                <div className="space-y-4">
                  {exams.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg bg-[rgb(var(--card))]">
                      <div>
                        <h3 className="font-medium">{exam.title}</h3>
                        <p className="text-sm text-gray-500">
                          {exam.duration} minutes • {exam._count.submissions} submissions
                        </p>
                      </div>
                      <Link href={`/exam/${exam.id}`}>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                      </Link>
                    </div>
                  ))}
                  <div className="text-center">
                    <Link href="/exams">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View all exams
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No exams available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
              <CardDescription>
                Your latest exam results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg bg-[rgb(var(--card))]">
                      <div>
                        <h3 className="font-medium">{submission.exam.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(submission.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {submission.score}/{submission.totalScore}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.round((submission.score / submission.totalScore) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <Link href="/results">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View all results
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No submissions yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </Layout>
    </ProtectedRoute>
  )
}
