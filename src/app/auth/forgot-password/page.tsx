
'use client'

import { useState } from 'react'
// import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from "next/image"

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
//   const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
        }),
      })

      if (response.ok) {
        setSuccessMessage('Password reset instructions have been sent to your email.')
        setEmail('')
      } else {
        const data = await response.json()
        setError(data.message || 'Failed to process request')
      }
    } catch (error) {
        console.log(error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-2 sm:px-0">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="w-full max-w-3xl h-[400px] bg-white rounded-md flex overflow-hidden border">
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-6">
          <div className="flex items-center mb-4">
            <Image 
              width={1000}
              height={1000}
              src="/logo.webp" 
              alt="Logo" 
              className="w-6 h-6 mr-2 rounded-full" 
            />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Reset your <span className="text-red-600">password</span>
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {"Enter your email address and we'll send you instructions to reset your password."}
          </p>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 text-gray-900">
            <div>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-800 text-white text-sm font-bold py-2.5 px-5 rounded-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Sending...' : 'Reset Password'}
              </button>
              <p className="text-center text-sm text-gray-600">
                Remember your password? <Link href="/auth/signin"
                  className="text-red-600 font-semibold hover:text-red-800"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
        <div className="hidden md:block w-1/2 bg-gradient-to-br from-red-600 via-red-500 to-red-600 relative">
          <Image
            width={1000}
            height={1000}
            src="/logo.webp"
            alt="Planets"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0">
          </div>
        </div>
      </div>
    </div>
  )
}
