'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  BarChart3, 
  Clock, 
  Calendar,
  Search,
  TrendingUp,
  Award
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
    duration: number
  }
}

export default function ResultsPage() {
  const { token } = useAuth()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([])

  const fetchSubmissions = useCallback(async () => {
    try {
      const response = await fetch('/api/submissions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
        setFilteredSubmissions(data)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) {
      fetchSubmissions()
    }
  }, [token, fetchSubmissions])

  useEffect(() => {
    if (search) {
      setFilteredSubmissions(
        submissions.filter(submission =>
          submission.exam.title.toLowerCase().includes(search.toLowerCase())
        )
      )
    } else {
      setFilteredSubmissions(submissions)
    }
  }, [search, submissions])

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

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return 'A+'
    if (percentage >= 80) return 'A'
    if (percentage >= 70) return 'B+'
    if (percentage >= 60) return 'B'
    if (percentage >= 50) return 'C'
    return 'F'
  }

  const averageScore = submissions.length > 0 
    ? submissions.reduce((sum, sub) => sum + (sub.score / sub.totalScore * 100), 0) / submissions.length
    : 0

  const totalExams = submissions.length
  const passedExams = submissions.filter(sub => (sub.score / sub.totalScore * 100) >= 60).length

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
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 animate-fade-up">
          <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-[rgb(var(--brand-100))] to-white border border-[rgb(var(--border))]">
            <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">My Results</h1>
            <p className="mt-2 text-[rgb(var(--muted))]">
              View your exam results and track your progress
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExams}</div>
              <p className="text-xs text-[rgb(var(--muted))]">
                Completed
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(averageScore)}%</div>
              <p className="text-xs text-[rgb(var(--muted))]">
                Overall performance
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Passed Exams</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{passedExams}</div>
              <p className="text-xs text-[rgb(var(--muted))]">
                {totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0}% pass rate
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
              <Award className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {submissions.length > 0 
                  ? Math.round(Math.max(...submissions.map(sub => (sub.score / sub.totalScore * 100))))
                  : 0
                }%
              </div>
              <p className="text-xs text-[rgb(var(--muted))]">
                Highest achievement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <form className="flex gap-4">
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

        {/* Results List */}
        {filteredSubmissions.length > 0 ? (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => {
              const percentage = Math.round((submission.score / submission.totalScore) * 100)
              return (
                <Card key={submission.id} className="hover:shadow-md transition-shadow animate-fade-up">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-[rgb(var(--foreground))]">
                            {submission.exam.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreBgColor(percentage)} ${getScoreColor(percentage)}`}>
                            {getGrade(percentage)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[rgb(var(--muted))]">
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            <span>
                              <span className="font-medium text-[rgb(var(--foreground))]">{submission.score}</span> / {submission.totalScore} points
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>
                              <span className="font-medium text-[rgb(var(--foreground))]">{submission.timeSpent}</span> minutes
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{formatDate(new Date(submission.completedAt))}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(percentage)}`}>
                          {percentage}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.score} / {submission.totalScore}
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            percentage >= 80 ? 'bg-green-500' :
                            percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search ? 'No results found' : 'No submissions yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {search 
                ? 'Try adjusting your search terms' 
                : 'Complete some exams to see your results here'
              }
            </p>
            {!search && (
              <Button onClick={() => window.location.href = '/exams'}>
                Browse Exams
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
