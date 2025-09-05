import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const skip = (page - 1) * limit

    const where = {
      ...(user.role !== 'ADMIN' && { isActive: true }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } }
        ]
      })
    }

    const [exams, total] = await Promise.all([
      prisma.exam.findMany({
        where,
        include: {
          createdBy: {
            select: { name: true }
          },
          questions: {
            select: { id: true }
          },
          _count: {
            select: { 
              submissions: true,
              questions: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.exam.count({ where })
    ])

    return NextResponse.json({
      exams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get exams error:', error)
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
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { title, description, duration, isActive, questions } = await request.json()

    if (!title || !duration) {
      return NextResponse.json(
        { error: 'Title and duration are required' },
        { status: 400 }
      )
    }

    // Validate questions if provided
    if (questions && Array.isArray(questions)) {
      for (const question of questions) {
        if (!question.questionText || !question.options || question.correctAnswer === undefined) {
          return NextResponse.json(
            { error: 'Invalid question data: questionText, options, and correctAnswer are required' },
            { status: 400 }
          )
        }
        if (!Array.isArray(question.options) || question.options.length < 2) {
          return NextResponse.json(
            { error: 'Each question must have at least 2 options' },
            { status: 400 }
          )
        }
        if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
          return NextResponse.json(
            { error: 'Invalid correct answer index for a question' },
            { status: 400 }
          )
        }
      }
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        description,
        duration: parseInt(duration),
        isActive: isActive !== undefined ? isActive : true,
        createdById: user.id,
        questions: questions ? {
          create: questions.map((q: any) => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: parseInt(q.correctAnswer),
            points: q.points ? parseInt(q.points) : 1
          }))
        } : undefined
      },
      include: {
        createdBy: {
          select: { name: true }
        },
        questions: true
      }
    })

    return NextResponse.json(exam, { status: 201 })
  } catch (error) {
    console.error('Create exam error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
