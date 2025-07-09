/**
 * Handles user registration via a POST request.
 * This route validates user input, checks for existing users, creates a new user in the database,
 * and sends a welcome email upon successful registration.
 *Throws an error if registration fails due to validation issues or server errors
 */


import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, createUser } from '@/lib/user'
import sendEmail from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Create user in database
    const user = await createUser({
      name,
      email,
      password,
    })

    // Send welcome email
    const emailContent = `
      <h2>Welcome to Newsfy, ${name}!</h2>
      <p>Your account has been successfully created. You now have access to the Newsfy dashboard where you can:</p>
      <ul>
        <li>Create and publish news articles</li>
        <li>Manage your content</li>
        <li>Contribute to our growing platform</li>
      </ul>
      <p>Get started by logging into your account and exploring our platform.</p>
      <a href="https://newsfy-nine.vercel.app/dashboard" class="button" style="color: white;">Access Dashboard</a>
    `

    await sendEmail(
      'Welcome to Newsfy - Account Created Successfully',
      emailContent,
      email,
      'Newsfy Team'
    )

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Failed to create user. Please try again.' },
      { status: 500 }
    )
  }
}