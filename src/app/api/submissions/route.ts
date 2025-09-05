import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { calculateScore } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const examId = searchParams.get('examId')

    const where = {
      userId: user.id,
      ...(examId && { examId })
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            duration: true
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Get submissions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { examId, answers, timeSpent } = await request.json()

    if (!examId || !answers) {
      return NextResponse.json(
        { error: 'Exam ID and answers are required' },
        { status: 400 }
      )
    }

    // Check if user has already submitted this exam
    const existingSubmission = await prisma.submission.findUnique({
      where: {
        examId_userId: {
          examId,
          userId: user.id
        }
      }
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted this exam' },
        { status: 400 }
      )
    }

    // Get exam and questions
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        questions: true
      }
    })

    if (!exam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      )
    }

    // Calculate score
    const { score, totalScore } = calculateScore(answers, exam.questions)

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        examId,
        userId: user.id,
        answers,
        score,
        totalScore,
        timeSpent: timeSpent || 0
      },
      include: {
        exam: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Submit exam error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
