import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
// import SignOutButton from '@/components/SignOutButton'
// import { signOut } from 'next-auth/react'


export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }
  redirect("/dashboard/overview")
}