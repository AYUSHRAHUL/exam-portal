'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ExamSecurity } from '@/components/ExamSecurity'
import { Clock, CheckCircle, AlertCircle, Shield } from 'lucide-react'

interface Question {
  id: string
  questionText: string
  options: string[]
  correctAnswer: number
  points: number
}

interface Exam {
  id: string
  title: string
  description: string | null
  duration: number
  questions: Question[]
  hasSubmitted: boolean
}

export default function ExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { token } = useAuth()
  const router = useRouter()
  const { id } = React.use(params)
  const [exam, setExam] = useState<Exam | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [result, setResult] = useState<{ score: number; totalScore: number; timeSpent: number } | null>(null)
  const [examStarted, setExamStarted] = useState(false)
  const [securityViolations, setSecurityViolations] = useState(0)

  const fetchExam = useCallback(async () => {
    try {
      const response = await fetch(`/api/exams/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setExam(data.exam)
        
        if (data.hasSubmitted) {
          setShowResultModal(true)
          setResult(data.submission)
        }
      } else {
        router.push('/exams')
      }
    } catch (error) {
      console.error('Error fetching exam:', error)
      router.push('/exams')
    } finally {
      setLoading(false)
    }
  }, [id, token, router])

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    
    setSubmitting(true)
    try {
      const timeSpent = exam!.duration * 60 - timeLeft
      
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          examId: id,
          answers,
          timeSpent: Math.floor(timeSpent / 60) // Convert to minutes
        })
      })

      if (response.ok) {
        const submission = await response.json()
        setResult(submission)
        setShowResultModal(true)
        setShowSubmitModal(false)
        setExamStarted(false) // Disable security
      }
    } catch (error) {
      console.error('Error submitting exam:', error)
    } finally {
      setSubmitting(false)
    }
  }, [submitting, exam, timeLeft, token, id, answers])

  useEffect(() => {
    if (token) {
      fetchExam()
    }
  }, [token, fetchExam])

  useEffect(() => {
    if (exam && !exam.hasSubmitted && examStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [exam, examStarted, timeLeft, handleSubmit])

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleSecurityViolation = () => {
    setSecurityViolations(prev => prev + 1)
    alert(`Security violation detected! Violation count: ${securityViolations + 1}`)
  }

  const handleAutoSubmit = () => {
    alert('Maximum security violations reached. Exam will be auto-submitted.')
    handleSubmit()
  }

  const startExam = () => {
    setExamStarted(true)
    setTimeLeft(exam!.duration * 60) // Convert minutes to seconds
  }

  const formatTimeDisplay = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
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

  if (!exam) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Exam not found</h3>
          <p className="text-gray-500">The exam you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </Layout>
    )
  }

  if (exam.hasSubmitted) {
    return (
      <Layout>
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Exam Already Submitted</h3>
          <p className="text-gray-500 mb-4">You have already completed this exam.</p>
          <Button onClick={() => setShowResultModal(true)}>
            View Results
          </Button>
        </div>
      </Layout>
    )
  }

  // Show exam start screen if exam hasn't started yet
  if (exam && !examStarted && !exam.hasSubmitted) {
    return (
      <Layout>
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span>Exam Security Notice</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{exam.title}</h2>
                  {exam.description && (
                    <p className="text-gray-600 mb-4">{exam.description}</p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Exam Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span><strong>Duration:</strong> {exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span><strong>Questions:</strong> {exam.questions.length}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span><strong>Security:</strong> Fullscreen Required</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-4">Security Rules</h3>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>You must enter fullscreen mode to start the exam</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>Switching tabs or windows is monitored and limited</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>Right-click and keyboard shortcuts are disabled</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>Maximum 3 tab switches allowed before auto-submission</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>Text selection and copy-paste are disabled</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <Button onClick={startExam} size="lg" className="bg-green-600 hover:bg-green-700">
                    Start Exam (Enter Fullscreen)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    )
  }

  const currentQ = exam.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100

  return (
    <Layout>
      <ExamSecurity
        isActive={examStarted}
        onSecurityViolation={handleSecurityViolation}
        onAutoSubmit={handleAutoSubmit}
        maxTabSwitches={3}
      />
      <div className="px-4 py-6 sm:px-0">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="rounded-xl p-4 md:p-5 bg-gradient-to-r from-[rgb(var(--brand-100))] to-white border border-[rgb(var(--border))] mb-3">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[rgb(var(--foreground))]">{exam.title}</h1>
                <div className={`flex items-center text-lg font-semibold text-red-600 ${timeLeft <= 60 ? 'animate-pulse-soft' : ''}`}>
                  <Clock className="h-5 w-5 mr-2" />
                  {formatTimeDisplay(timeLeft)}
                </div>
              </div>
              {exam.description && (
                <p className="text-sm md:text-base text-[rgb(var(--muted))] mt-2">{exam.description}</p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-[rgb(var(--muted))]">
              <span>Question {currentQuestion + 1} of {exam.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {exam.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : answers[exam.questions[index].id] !== undefined
                      ? 'bg-green-100 text-green-800 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Question {currentQuestion + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[rgb(var(--foreground))] mb-6">{currentQ.questionText}</p>
              
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      answers[currentQ.id] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-[rgb(var(--border))] hover:border-blue-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={index}
                      checked={answers[currentQ.id] === index}
                      onChange={() => handleAnswerSelect(currentQ.id, index)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[currentQ.id] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQ.id] === index && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-[rgb(var(--foreground))]">{option}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              {currentQuestion === exam.questions.length - 1 ? (
                <Button
                  onClick={() => setShowSubmitModal(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Exam
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion(Math.min(exam.questions.length - 1, currentQuestion + 1))}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Exam"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to submit your exam? This action cannot be undone.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Exam Summary:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Total Questions: {exam.questions.length}</li>
              <li>Answered: {Object.keys(answers).length}</li>
              <li>Unanswered: {exam.questions.length - Object.keys(answers).length}</li>
              <li>Time Remaining: {formatTimeDisplay(timeLeft)}</li>
            </ul>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowSubmitModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              Submit Exam
            </Button>
          </div>
        </div>
      </Modal>

      {/* Results Modal */}
      <Modal
        isOpen={showResultModal}
        onClose={() => {
          setShowResultModal(false)
          router.push('/dashboard')
        }}
        title="Exam Results"
        size="lg"
      >
        {result && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {Math.round((result.score / result.totalScore) * 100)}%
              </div>
              <p className="text-gray-600">
                You scored {result.score} out of {result.totalScore} points
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{result.score}</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{result.timeSpent}</div>
                <div className="text-sm text-gray-600">Minutes Taken</div>
              </div>
            </div>
            
            <div className="text-center">
              <Button
                onClick={() => {
                  setShowResultModal(false)
                  router.push('/dashboard')
                }}
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  )
}
