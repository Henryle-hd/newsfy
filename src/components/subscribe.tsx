import React, { useState } from 'react'

export default function Subscribe() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create subscriber
      const response = await fetch('/api/subscriber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      // Send welcome email
      const emailContent = `
        <h2>Welcome to Newsfy!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for subscribing to Newsfy! We're excited to have you join our community.</p>
        <p>You will now receive our latest news and updates directly in your inbox.</p>
        <p>Stay tuned for exciting content!</p>
      `

      await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Welcome to Newsfy Newsletter!',
          content: emailContent,
        }),
      })

      setMessage('Successfully subscribed! Check your email.')
      setName('')
      setEmail('')
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message || 'Something went wrong')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-md p-6 mt-6 text-gray-800">
      <h2 className="text-md font-black text-gray-800 mb-4 pb-2 border-b border-b-gray-200">SUBSCRIBE</h2>
      {message && <div className="mb-4 p-2 rounded bg-gray-100">{message}</div>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  )
}
