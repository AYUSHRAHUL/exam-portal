import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const questions = await prisma.question.findMany({
      where: { examId: id },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Get questions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { questionText, options, correctAnswer, points } = await request.json()
    
    console.log('Received question data:', { questionText, options, correctAnswer, points })

    if (!questionText || !options || correctAnswer === undefined) {
      console.log('Validation failed: missing required fields')
      return NextResponse.json(
        { error: 'Question text, options, and correct answer are required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 options are required' },
        { status: 400 }
      )
    }

    if (correctAnswer < 0 || correctAnswer >= options.length) {
      return NextResponse.json(
        { error: 'Invalid correct answer index' },
        { status: 400 }
      )
    }

    const { id } = await params
    console.log('Creating question for exam ID:', id)
    
    const question = await prisma.question.create({
      data: {
        examId: id,
        questionText,
        options,
        correctAnswer: parseInt(correctAnswer),
        points: points ? parseInt(points) : 1
      }
    })
    
    console.log('Question created successfully:', question)
    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error('Create question error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
