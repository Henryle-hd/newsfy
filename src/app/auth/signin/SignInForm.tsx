'use client'

import { useState, useEffect } from 'react'
import { signIn} from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const message = searchParams.get('message')
    if (message === 'verified') {
      setSuccessMessage('Email Verified Successfully! Please sign in with your credentials.')
    } else if (message === 'Registration successful') {
      setSuccessMessage('Registration successful! Please sign in with your credentials.')
    }
  }, [searchParams])

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return false
    }

    return true
  }

  const sendLoginNotification = async (userEmail: string) => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: userEmail,
          subject: `New Login Detected - ${new Date().toLocaleString()}`,
          content: `
            <div style="padding: 20px;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello,</h2>
              <p style="color: #666; line-height: 1.6;">We have detected a new login to your newsfy account.</p>
              <div style="padding: 20px; border: 1px solid #E6002D; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #E6002D; margin-bottom: 15px;">Login Details:</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;">
                    <strong>Date:</strong> ${new Date().toLocaleString()}
                  </li>
                  <li style="margin-bottom: 10px;">
                    <strong>Device:</strong> ${navigator.userAgent}
                  </li>
                  <li style="margin-bottom: 10px;">
                    <strong>Browser:</strong> ${navigator.userAgent.split(')')[0].split('(')[1]}
                  </li>
                </ul>
              </div>
              <p style="color: #666; line-height: 1.6; margin-bottom: 10px;">
                If this wasn't you, please contact our support team immediately.
              </p>
            </div>          `
        })
      })

      if (!response.ok) {
        console.error('Failed to send login notification email')
      }
    } catch (error) {
      console.error('Error sending login notification:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMessage('')

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError('Invalid email or password. Please check your credentials and try again.')
        } else {
          setError('An error occurred during sign in. Please try again.')
        }
      } else if (result?.ok) {
        await sendLoginNotification(email.toLowerCase().trim())
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('Sign in error:', error)
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
              className="w-6 h-6 mr-2 rounded-full block sm:hidden" 
            />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Hello, <span className="text-red-600">Welcome!</span>
          </h2>

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
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                {showPassword ? (
                  <EyeOff 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" 
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" 
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>
            <div className="flex items-center mb-2">
              <Link href="/auth/forgot-password" className="text-gray-600 text-xs hover:text-red-600">
                Forgot password?
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-800 text-white text-sm font-bold py-2.5 px-5 rounded-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Login...' : 'Login'}
              </button>
              {/* <p className="text-center text-sm text-gray-600">
                {"Don't have an account?"} <Link href="/auth/signup"
                  className="text-red-600 font-semibold hover:text-red-800"
                >
                  Sign up
                </Link>
              </p> */}
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