  import { NextResponse } from 'next/server'
  import { getUserByEmail } from '@/lib/user'
  import { generatePassword } from '@/lib/passwordGen'
  import { prisma } from '@/lib/prisma'
  import sendEmail from '@/lib/email'
  import bcrypt from 'bcryptjs'

  export async function POST(req: Request) {
    try {
      const { email } = await req.json()

      // Check if user exists
      const user = await getUserByEmail(email)
      if (!user) {
        return NextResponse.json(
          { error: 'User with this email does not exist' },
          { status: 404 }
        )
      }

      // Generate temporary password
      const gen_pws=generatePassword(50)
      const tempPassword =await bcrypt.hash(gen_pws,10)
    
      // Set expiration time to 24 hours from now
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      // Update user with temporary password
      await prisma.user.update({
        where: { email },
        data: {
            istempPassword:true,
            temporaryPassword: tempPassword,
            temporaryPasswordExpires: expiresAt
        }
      })

      const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?temp=${gen_pws}&k=${user.id}`
      console.log(resetLink)

      // Email content
      const emailContent = `
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password. Please click the link below to reset your password:</p>
        <p><a href="${resetLink}" style="padding: 10px 20px; background-color: #E6002D; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not request this password reset, please ignore this email.</p>
      `

      // Send email
      await sendEmail(
        'Password Reset Request',
        emailContent,
        email,
        'Newsfy Password Reset'
      )

      return NextResponse.json(
        { message: 'Password reset link sent successfully' },
        { status: 200 }
      )
    } catch (error) {
      console.error('Reset link error:', error)
      return NextResponse.json(
        { error: 'Failed to process password reset request' },
        { status: 500 }
      )
    }
  }
