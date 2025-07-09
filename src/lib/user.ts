import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    return user
  } catch (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    })
    return user
  } catch (error) {
    console.error('Error fetching user by id:', error)
    return null
  }
}

export async function createUser(data: {
  name: string
  email: string
  password: string
}) {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10)
    
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      }
    })
    
    // Return user without password
    const { password, ...userWithoutPassword } = user
    console.log(password) //!Test purpose
    return userWithoutPassword
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Failed to create user')
  }
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}