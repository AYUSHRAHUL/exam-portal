'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { 
  Plus, 
  BookOpen, 
  Users, 
  BarChart3, 
  Edit, 
  Trash2,
  Eye,
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Exam {
  id: string
  title: string
  description: string | null
  duration: number
  isActive: boolean
  createdAt: string
  _count: {
    questions: number
    submissions: number
  }
}

export default function AdminPage() {
  const { user, token } = useAuth()
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    isActive: true
  })
  
  const [questions, setQuestions] = useState<Array<{
    questionText: string
    options: string[]
    correctAnswer: number
    points: number
  }>>([])
  
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1
  })

  const fetchExams = useCallback(async () => {
    try {
      console.log('Fetching exams with token:', token ? 'present' : 'missing')
      const response = await fetch('/api/exams', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      console.log('Fetch exams response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched exams data:', data)
        setExams(data.exams)
      } else {
        const errorData = await response.json()
        console.error('Error fetching exams:', errorData)
      }
    } catch (error) {
      console.error('Error fetching exams:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token && user?.role === 'ADMIN') {
      fetchExams()
    }
  }, [token, user, fetchExams])

  const addQuestion = () => {
    // Validate current question
    if (!currentQuestion.questionText.trim()) {
      alert('Please enter a question text')
      return
    }
    
    const validOptions = currentQuestion.options.filter(option => option.trim() !== '')
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options')
      return
    }
    
    const correctAnswerText = currentQuestion.options[currentQuestion.correctAnswer]
    if (!correctAnswerText || correctAnswerText.trim() === '') {
      alert('Please select a valid correct answer')
      return
    }
    
    const correctAnswerIndex = validOptions.findIndex(option => option === correctAnswerText)
    if (correctAnswerIndex === -1) {
      alert('Please select a valid correct answer')
      return
    }
    
    // Add question to the list
    setQuestions(prev => [...prev, {
      questionText: currentQuestion.questionText.trim(),
      options: validOptions,
      correctAnswer: correctAnswerIndex,
      points: currentQuestion.points
    }])
    
    // Reset current question form
    setCurrentQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    })
  }
  
  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index))
  }
  
  const updateCurrentQuestionOption = (index: number, value: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }))
  }
  
  const addCurrentQuestionOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }))
  }
  
  const removeCurrentQuestionOption = (index: number) => {
    if (currentQuestion.options.length > 2) {
      setCurrentQuestion(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        correctAnswer: prev.correctAnswer >= index ? Math.max(0, prev.correctAnswer - 1) : prev.correctAnswer
      }))
    }
  }

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating exam with data:', formData)
    
    // Validate form data
    if (!formData.title.trim()) {
      alert('Please enter an exam title')
      return
    }
    
    if (!formData.duration || parseInt(formData.duration) < 1) {
      alert('Please enter a valid duration (minimum 1 minute)')
      return
    }
    
    try {
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          duration: parseInt(formData.duration),
          isActive: formData.isActive,
          questions: questions
        })
      })

      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (response.ok) {
        await fetchExams()
        setShowCreateModal(false)
        setFormData({ title: '', description: '', duration: '', isActive: true })
        setQuestions([])
        setCurrentQuestion({ questionText: '', options: ['', '', '', ''], correctAnswer: 0, points: 1 })
        alert('Exam created successfully!')
      } else {
        console.error('Error response:', responseData)
        alert(`Error: ${responseData.error || 'Failed to create exam'}`)
      }
    } catch (error) {
      console.error('Error creating exam:', error)
      alert('Network error occurred while creating exam')
    }
  }

  const handleEditExam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingExam) return

    try {
      const response = await fetch(`/api/exams/${editingExam.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchExams()
        setShowEditModal(false)
        setEditingExam(null)
        setFormData({ title: '', description: '', duration: '', isActive: true })
      }
    } catch (error) {
      console.error('Error updating exam:', error)
    }
  }

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/exams/${examId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        await fetchExams()
      }
    } catch (error) {
      console.error('Error deleting exam:', error)
    }
  }

  const openEditModal = (exam: Exam) => {
    setEditingExam(exam)
    setFormData({
      title: exam.title,
      description: exam.description || '',
      duration: exam.duration.toString(),
      isActive: exam.isActive
    })
    setShowEditModal(true)
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
    <ProtectedRoute requireAdmin>
      <Layout>
        <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 animate-fade-up">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-[rgb(var(--brand-100))] to-white border border-[rgb(var(--border))]">
              <h1 className="text-3xl font-bold text-[rgb(var(--foreground))]">Admin Dashboard</h1>
              <p className="mt-2 text-[rgb(var(--muted))]">
                Manage exams, questions, and view student submissions
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Exam
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow animate-fade-up anim-delay-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.length}</div>
              <p className="text-xs text-[rgb(var(--muted))]">
                {exams.filter(e => e.isActive).length} active
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow animate-fade-up anim-delay-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {exams.reduce((sum, exam) => sum + exam._count.questions, 0)}
              </div>
              <p className="text-xs text-[rgb(var(--muted))]">
                Across all exams
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow animate-fade-up anim-delay-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {exams.reduce((sum, exam) => sum + exam._count.submissions, 0)}
              </div>
              <p className="text-xs text-[rgb(var(--muted))]">
                Student attempts
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exams Management</CardTitle>
            <CardDescription>
              Create, edit, and manage your exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            {exams.length > 0 ? (
              <div className="space-y-4">
                {exams.map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg bg-[rgb(var(--card))] animate-fade-up">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{exam.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          exam.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {exam.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {exam._count.questions} questions • {exam.duration} minutes • {exam._count.submissions} submissions
                      </p>
                      <p className="text-xs text-gray-400">
                        Created {formatDate(new Date(exam.createdAt))}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link href={`/admin/exam/${exam.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(exam)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteExam(exam.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No exams yet</h3>
                <p className="text-gray-500 mb-4">Create your first exam to get started</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  Create Exam
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Exam Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Exam"
        size="lg"
      >
        <form onSubmit={handleCreateExam} className="space-y-4">
          <Input
            label="Exam Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            placeholder="Enter exam title"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter exam description (optional)"
            />
          </div>
          
          <Input
            label="Duration (minutes)"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            required
            placeholder="Enter duration in minutes"
            min="1"
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active (students can take this exam)
            </label>
          </div>
          
          {/* Question Builder Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Questions</h3>
            
            {/* Current Question Form */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text
                </label>
                <textarea
                  value={currentQuestion.questionText}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Enter your question here..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options
                </label>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 w-6">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateCurrentQuestionOption(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      />
                      {currentQuestion.options.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCurrentQuestionOption(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCurrentQuestionOption}
                  className="mt-2"
                >
                  Add Option
                </Button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer
                </label>
                <select
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {currentQuestion.options.map((_, index) => (
                    <option key={index} value={index}>
                      {String.fromCharCode(65 + index)}. {currentQuestion.options[index] || `Option ${String.fromCharCode(65 + index)}`}
                    </option>
                  ))}
                </select>
              </div>
              
              <Input
                label="Points"
                type="number"
                value={currentQuestion.points}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
                min="1"
              />
              
              <Button
                type="button"
                onClick={addQuestion}
                className="w-full"
              >
                Add Question
              </Button>
            </div>
            
            {/* Added Questions List */}
            {questions.length > 0 && (
              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                  Added Questions ({questions.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {questions.map((question, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Q{index + 1}: {question.questionText}
                        </p>
                        <p className="text-xs text-gray-500">
                          {question.options.length} options • {question.points} point{question.points !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Exam {questions.length > 0 && `(${questions.length} questions)`}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Exam Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Exam"
        size="md"
      >
        <form onSubmit={handleEditExam} className="space-y-4">
          <Input
            label="Exam Title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            placeholder="Enter exam title"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter exam description (optional)"
            />
          </div>
          
          <Input
            label="Duration (minutes)"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            required
            placeholder="Enter duration in minutes"
            min="1"
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="editIsActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="editIsActive" className="ml-2 block text-sm text-gray-900">
              Active (students can take this exam)
            </label>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Exam
            </Button>
          </div>
        </form>
      </Modal>
      </Layout>
    </ProtectedRoute>
  )
}
