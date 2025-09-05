'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Users,
  BarChart3,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  questionText: string
  options: string[]
  correctAnswer: number
  points: number
  createdAt: string
}

interface Exam {
  id: string
  title: string
  description: string | null
  duration: number
  isActive: boolean
  createdAt: string
  questions: Question[]
  _count: {
    submissions: number
  }
}

export default function AdminExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, token } = useAuth()
  const router = useRouter()
  const { id } = React.use(params)
  const [exam, setExam] = useState<Exam | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [formData, setFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1
  })

  const fetchExam = useCallback(async () => {
    try {
      const response = await fetch(`/api/exams/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setExam(data.exam)
      } else {
        router.push('/admin')
      }
    } catch (error) {
      console.error('Error fetching exam:', error)
      router.push('/admin')
    } finally {
      setLoading(false)
    }
  }, [id, token, router])

  useEffect(() => {
    if (token && user?.role === 'ADMIN') {
      fetchExam()
    }
  }, [token, user, fetchExam])

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    if (!formData.questionText.trim()) {
      alert('Please enter a question text')
      return
    }
    
    const validOptions = formData.options.filter(option => option.trim() !== '')
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options')
      return
    }
    
    // Find the index of the correct answer in the valid options
    const correctAnswerText = formData.options[formData.correctAnswer]
    if (!correctAnswerText || correctAnswerText.trim() === '') {
      alert('Please select a valid correct answer')
      return
    }
    
    const correctAnswerIndex = validOptions.findIndex(option => option === correctAnswerText)
    if (correctAnswerIndex === -1) {
      alert('Please select a valid correct answer')
      return
    }
    
    try {
      const questionData = {
        questionText: formData.questionText.trim(),
        options: validOptions,
        correctAnswer: correctAnswerIndex,
        points: formData.points
      }
      
      console.log('Creating question with data:', questionData)
      
      const response = await fetch(`/api/exams/${id}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(questionData)
      })

      if (response.ok) {
        await fetchExam()
        setShowCreateModal(false)
        resetForm()
        alert('Question created successfully!')
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        alert(`Error creating question: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating question:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleEditQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingQuestion) return

    try {
      const response = await fetch(`/api/questions/${editingQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchExam()
        setShowEditModal(false)
        setEditingQuestion(null)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating question:', error)
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        await fetchExam()
      }
    } catch (error) {
      console.error('Error deleting question:', error)
    }
  }

  const openEditModal = (question: Question) => {
    setEditingQuestion(question)
    setFormData({
      questionText: question.questionText,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      points: question.points
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    })
  }

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }))
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        correctAnswer: prev.correctAnswer >= index ? Math.max(0, prev.correctAnswer - 1) : prev.correctAnswer
      }))
    }
  }

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }))
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

  if (!exam) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Exam not found</h3>
          <p className="text-gray-500">The exam you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{exam.title}</h1>
              <p className="text-gray-600">{exam.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <div className="text-sm text-blue-600">Duration</div>
                  <div className="font-semibold">{exam.duration} minutes</div>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <div className="text-sm text-green-600">Questions</div>
                  <div className="font-semibold">{exam.questions.length}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 mr-2" />
                <div>
                  <div className="text-sm text-purple-600">Submissions</div>
                  <div className="font-semibold">{exam._count.submissions}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>
                  Manage questions for this exam
                </CardDescription>
              </div>
              <Button onClick={() => setShowCreateModal(true)} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {exam.questions.length > 0 ? (
              <div className="space-y-4">
                {exam.questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                            Question {index + 1}
                          </span>
                          <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded">
                            {question.points} point{question.points !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">{question.questionText}</h3>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(question)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded text-sm ${
                            optionIndex === question.correctAnswer
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          {option}
                          {optionIndex === question.correctAnswer && (
                            <span className="ml-2 text-green-600 font-medium">✓ Correct</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                <p className="text-gray-500 mb-4">Add questions to make this exam available to students</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  Add First Question
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Question Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Question"
        size="lg"
      >
        <form onSubmit={handleCreateQuestion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Text
            </label>
            <textarea
              value={formData.questionText}
              onChange={(e) => setFormData(prev => ({ ...prev, questionText: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
              placeholder="Enter the question"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Options
            </label>
            <div className="space-y-2">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-6 text-sm font-medium">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    required
                  />
                  {formData.options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
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
              onClick={addOption}
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
              value={formData.correctAnswer}
              onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {formData.options.map((_, index) => (
                <option key={index} value={index}>
                  {String.fromCharCode(65 + index)}. {formData.options[index] || `Option ${String.fromCharCode(65 + index)}`}
                </option>
              ))}
            </select>
          </div>
          
          <Input
            label="Points"
            type="number"
            value={formData.points}
            onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
            min="1"
            required
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Question
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Question Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Question"
        size="lg"
      >
        <form onSubmit={handleEditQuestion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Text
            </label>
            <textarea
              value={formData.questionText}
              onChange={(e) => setFormData(prev => ({ ...prev, questionText: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
              placeholder="Enter the question"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer Options
            </label>
            <div className="space-y-2">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-6 text-sm font-medium">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    required
                  />
                  {formData.options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
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
              onClick={addOption}
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
              value={formData.correctAnswer}
              onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {formData.options.map((_, index) => (
                <option key={index} value={index}>
                  {String.fromCharCode(65 + index)}. {formData.options[index] || `Option ${String.fromCharCode(65 + index)}`}
                </option>
              ))}
            </select>
          </div>
          
          <Input
            label="Points"
            type="number"
            value={formData.points}
            onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) || 1 }))}
            min="1"
            required
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Question
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
