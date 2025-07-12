'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [userId, setUserId] = useState('')
    const [tempPassword, setTempPassword] = useState('')

    useEffect(() => {
        const k = searchParams.get('k')
        const temp = searchParams.get('temp')
        if (k && temp) {
            setUserId(k)
            setTempPassword(temp)
        } else {
            setError('Invalid or missing reset link parameters.')
        }
    }, [searchParams])

    const validateForm = () => {
        if (!newPassword || !confirmPassword) {
            setError('Please fill in all fields')
            return false
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters')
            return false
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')
        if (!validateForm()) return

        setLoading(true)
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    temporaryPassword: tempPassword,
                    newPassword,
                }),
            })
            const data = await response.json()
            if (response.ok) {
                setSuccessMessage(data.message || 'Password reset successful! You can now sign in.')
                setNewPassword('')
                setConfirmPassword('')
                setTimeout(() => {
                    router.push('/auth/signin?message=Password reset successful')
                }, 500)
            } else {
                setError(data.error || 'Failed to reset password')
            }
        } catch (err) {
            console.log(err)
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
                        Set a <span className="text-red-600">new password</span>
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Please enter your new password below.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 text-gray-900">
                        <div>
                            <input
                                type="password"
                                required
                                placeholder="New password"
                                className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                placeholder="Confirm new password"
                                className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-800 text-white text-sm font-bold py-2.5 px-5 rounded-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                            <p className="text-center text-sm text-gray-600">
                                Remember your password?{' '}
                                <Link href="/auth/signin" className="text-red-600 font-semibold hover:text-red-800">
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
                    <div className="absolute inset-0"></div>
                </div>
            </div>
        </div>
    )
}

export default function ResetPassword() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}