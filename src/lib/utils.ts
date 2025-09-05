import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function calculateScore(answers: Record<string, number>, questions: { id: string; points: number; correctAnswer: number }[]): { score: number; totalScore: number } {
  let score = 0
  let totalScore = 0

  questions.forEach(question => {
    totalScore += question.points
    if (answers[question.id] === question.correctAnswer) {
      score += question.points
    }
  })

  return { score, totalScore }
}
