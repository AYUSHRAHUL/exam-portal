import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  })

  // Create sample students
  const student1Password = await bcrypt.hash('student123', 12)
  await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'student1@example.com',
      password: student1Password,
      role: Role.STUDENT,
    },
  })

  const student2Password = await bcrypt.hash('student123', 12)
  await prisma.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'student2@example.com',
      password: student2Password,
      role: Role.STUDENT,
    },
  })

  // Create sample exam
  const exam = await prisma.exam.upsert({
    where: { id: 'sample-exam-1' },
    update: {},
    create: {
      id: 'sample-exam-1',
      title: 'JavaScript Fundamentals',
      description: 'Test your knowledge of JavaScript basics including variables, functions, and objects.',
      duration: 30,
      isActive: true,
      createdById: admin.id,
    },
  })

  // Create sample questions
  const questions = [
    {
      questionText: 'What is the correct way to declare a variable in JavaScript?',
      options: [
        'var myVar = 5;',
        'variable myVar = 5;',
        'v myVar = 5;',
        'declare myVar = 5;'
      ],
      correctAnswer: 0,
      points: 1
    },
    {
      questionText: 'Which of the following is NOT a JavaScript data type?',
      options: [
        'String',
        'Boolean',
        'Float',
        'Undefined'
      ],
      correctAnswer: 2,
      points: 1
    },
    {
      questionText: 'What does the === operator do in JavaScript?',
      options: [
        'Assigns a value',
        'Compares values and types',
        'Compares only values',
        'Creates a function'
      ],
      correctAnswer: 1,
      points: 2
    },
    {
      questionText: 'Which method is used to add an element to the end of an array?',
      options: [
        'push()',
        'pop()',
        'shift()',
        'unshift()'
      ],
      correctAnswer: 0,
      points: 1
    },
    {
      questionText: 'What is the result of typeof null in JavaScript?',
      options: [
        'null',
        'undefined',
        'object',
        'string'
      ],
      correctAnswer: 2,
      points: 2
    }
  ]

  for (const questionData of questions) {
    await prisma.question.create({
      data: {
        examId: exam.id,
        questionText: questionData.questionText,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        points: questionData.points,
      },
    })
  }

  // Create another exam
  const exam2 = await prisma.exam.upsert({
    where: { id: 'sample-exam-2' },
    update: {},
    create: {
      id: 'sample-exam-2',
      title: 'React Basics',
      description: 'Test your understanding of React fundamentals including components, props, and state.',
      duration: 45,
      isActive: true,
      createdById: admin.id,
    },
  })

  // Create questions for second exam
  const reactQuestions = [
    {
      questionText: 'What is JSX in React?',
      options: [
        'A JavaScript extension that allows HTML-like syntax',
        'A CSS framework',
        'A state management library',
        'A testing framework'
      ],
      correctAnswer: 0,
      points: 1
    },
    {
      questionText: 'Which hook is used to manage state in functional components?',
      options: [
        'useEffect',
        'useState',
        'useContext',
        'useReducer'
      ],
      correctAnswer: 1,
      points: 2
    },
    {
      questionText: 'What is the purpose of the useEffect hook?',
      options: [
        'To manage component state',
        'To perform side effects',
        'To create custom hooks',
        'To handle events'
      ],
      correctAnswer: 1,
      points: 2
    }
  ]

  for (const questionData of reactQuestions) {
    await prisma.question.create({
      data: {
        examId: exam2.id,
        questionText: questionData.questionText,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        points: questionData.points,
      },
    })
  }

  console.log('Database seeded successfully!')
  console.log('Admin user: admin@example.com / admin123')
  console.log('Student users: student1@example.com / student123, student2@example.com / student123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
