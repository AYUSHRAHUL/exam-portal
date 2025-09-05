import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'
import { User, Role } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    console.log('Verifying token:', token ? 'present' : 'missing')
    console.log('JWT_SECRET:', JWT_SECRET ? 'present' : 'missing')
    
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; name: string; email: string; role: Role }
    console.log('Decoded token:', decoded)
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email }
  })
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  role?: Role
}): Promise<User> {
  const hashedPassword = await hashPassword(data.password)
  
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || Role.STUDENT
    }
  })
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email)
  if (!user) return null

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) return null

  return user
}
