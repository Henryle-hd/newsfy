'use client'

import { Loader2 } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface SignOutButtonProps {
  variant?: 'button' | 'link'
  className?: string
}

export default function SignOutButton({ variant = 'button', className }: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut({ callbackUrl: '/' })
  }

  if (variant === 'link') {
    return (
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className={className || "text-gray-700 hover:text-gray-900"}
      >
        {isLoading ? (
          <>
          <Loader2 className=' w-4 h-4 animate-spin' /> <span>Sign Out...</span>
          </>   ) : 'Sign Out'}
      </button>
    )
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={className || "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"}
    >
      {isLoading ? (
        <div className='flex justify-center items-center gap-2'>
        <Loader2 className='w-4 h-4 animate-spin'/>
        <span>Bye...</span>
        </div>
      ) : 'Sign Out'}
    </button>
  )
}