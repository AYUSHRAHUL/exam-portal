'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { 
  Trophy, 
  Medal, 
  Award,
  Crown,
  Users,
  TrendingUp,
  Clock
} from 'lucide-react'

interface LeaderboardEntry {
  id: string
  score: number
  totalScore: number
  completedAt: string
  timeSpent: number
  user: {
    id: string
    name: string
    email: string
  }
}

export default function LeaderboardPage() {
  const { user, token } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const fetchLeaderboard = useCallback(async () => {
    try {
      // This would be replaced with actual exam selection
      const response = await fetch('/api/admin/leaderboard?examId=all', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token && user?.role === 'ADMIN') {
      // For now, we'll show a general leaderboard
      // In a real app, you'd have a dropdown to select specific exams
      fetchLeaderboard()
    }
  }, [token, user, fetchLeaderboard])

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">
          {index + 1}
        </span>
    }
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 2:
        return 'bg-gradient-to-r from-amber-400 to-amber-600'
      default:
        return 'bg-white border-2 border-gray-200'
    }
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
            <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">Leaderboard</h1>
            <p className="mt-2 text-[rgb(var(--muted))]">
              Top performing students across all exams
            </p>
          </div>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="mb-8">
            <div className="flex justify-center items-end space-x-4">
              {/* 2nd Place */}
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 ${getRankColor(1)}`}>
                  <Medal className="h-8 w-8 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-900">{leaderboard[1].user.name}</div>
                <div className="text-xs text-gray-500">{Math.round((leaderboard[1].score / leaderboard[1].totalScore) * 100)}%</div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-2 ${getRankColor(0)}`}>
                  <Crown className="h-10 w-10 text-white" />
                </div>
                <div className="text-lg font-bold text-gray-900">{leaderboard[0].user.name}</div>
                <div className="text-sm text-gray-500">{Math.round((leaderboard[0].score / leaderboard[0].totalScore) * 100)}%</div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 ${getRankColor(2)}`}>
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-900">{leaderboard[2].user.name}</div>
                <div className="text-xs text-gray-500">{Math.round((leaderboard[2].score / leaderboard[2].totalScore) * 100)}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-blue-600" />
              Complete Leaderboard
            </CardTitle>
            <CardDescription>
              Rankings based on exam performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => {
                  const percentage = Math.round((entry.score / entry.totalScore) * 100)
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        index < 3 ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200' : 'bg-white border'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(index)}
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-[rgb(var(--foreground))]">{entry.user.name}</h3>
                            {index < 3 && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                Top {index + 1}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[rgb(var(--muted))]">{entry.user.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-lg font-bold text-[rgb(var(--foreground))]">{percentage}%</div>
                          <div className="text-sm text-[rgb(var(--muted))]">
                            {entry.score}/{entry.totalScore} points
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-[rgb(var(--muted))]">Time</div>
                          <div className="text-sm font-medium">{entry.timeSpent}m</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-[rgb(var(--muted))]">Date</div>
                          <div className="text-sm font-medium">
                            {new Date(entry.completedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
                <p className="text-gray-500">Student submissions will appear here once they start taking exams.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        {leaderboard.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leaderboard.length}</div>
                <p className="text-xs text-muted-foreground">
                  Students who took exams
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(leaderboard.reduce((sum, entry) => sum + (entry.score / entry.totalScore * 100), 0) / leaderboard.length)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(leaderboard.reduce((sum, entry) => sum + entry.timeSpent, 0) / leaderboard.length)}m
                </div>
                <p className="text-xs text-muted-foreground">
                  Per exam
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  )
}
