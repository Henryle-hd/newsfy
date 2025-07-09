import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/SignOutButton'
// import { signOut } from 'next-auth/react'


export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome, {session.user?.name}!</p>
          <p className="text-gray-500">{session.user?.email}</p>
        </div>
        
        <div className="mt-8">
          <SignOutButton />
        </div>
      </div>
    </div>
  )
}