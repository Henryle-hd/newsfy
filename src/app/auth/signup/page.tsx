/**
 * SignUp page component for user registration
 * 
 * This component provides a signup form with client-side validation for:
 * - Name (minimum 2 characters)
 * - Email (valid email format)
 * - Password (minimum 6 characters, matching confirmation)
 * 
 * Features:
 * - Real-time input validation
 * - Password visibility toggle
 * - Error handling for registration process
 * - Redirects to signin page on successful registration
 */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"

export default function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    if (value.length < 2) {
      setNameError('Name must be at least 2 characters long')
    } else {
      setNameError('')
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (!validateEmail(value)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
    } else {
      setPasswordError('')
    }
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
    } else {
      setConfirmPasswordError('')
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
    if (value !== password) {
      setConfirmPasswordError('Passwords do not match')
    } else {
      setConfirmPasswordError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (response.ok) {
        router.push('/auth/signin?message=Registration successful')
      } else {
        const data = await response.json()
        setError(data.message || 'Registration failed')
      }
    } catch (error) {
        console.log(error)
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-2 sm:px-0">
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
            Create your <span className="text-red-600">account!</span>
          </h2>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 text-gray-900">
            <div>
              <input
                type="text"
                required
                placeholder="Enter your full name"
                className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={name}
                onChange={handleNameChange}
                disabled={loading}
              />
              {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
            </div>
            <div>
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
            </div>
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={password}
                  onChange={handlePasswordChange}
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
              {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
            </div>
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Confirm your password"
                  className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  disabled={loading}
                />
                {showConfirmPassword ? (
                  <EyeOff 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" 
                    onClick={() => setShowConfirmPassword(false)}
                  />
                ) : (
                  <Eye 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 cursor-pointer" 
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )}
              </div>
              {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-800 text-white text-sm font-bold py-2.5 px-5 rounded-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </button>
              <p className="text-center text-sm text-gray-600">
                Already have an account? <Link href="/auth/signin"
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