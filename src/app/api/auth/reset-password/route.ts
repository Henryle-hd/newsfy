import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { userId, temporaryPassword, newPassword } = await req.json()

    if (!userId || !temporaryPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.istempPassword || !user.temporaryPassword || !user.temporaryPasswordExpires) {
      return NextResponse.json({ error: 'No temporary password set' }, { status: 400 })
    }

    // Check if temp password expired
    if (new Date(user.temporaryPasswordExpires) < new Date()) {
      return NextResponse.json({ error: 'Temporary password expired' }, { status: 400 })
    }

    // Compare temp password
    const isMatch = await bcrypt.compare(temporaryPassword, user.temporaryPassword)
    if (!isMatch) {
      return NextResponse.json({ error: 'Temporary password incorrect' }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        istempPassword: false,
        temporaryPassword: null,
        temporaryPasswordExpires: null,
      }
    })

    return NextResponse.json({ message: 'Password reset successful' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}