"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface CommentFormProps {
  articleId: string
}

interface Comment {
  id: string
  content: string
  createdAt: string
  subscriber: {
    name: string
    email: string
  }
}

export default function CommentForm({ articleId }: CommentFormProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  })

  const [isCommenting, setIsCommenting]=useState(false)
  useEffect(() => {
    fetchComments()
  }, [articleId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comment?articleId=${articleId}`)
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCommenting(true)
    try {
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: formData.comment,
          email: formData.email,
          name: formData.name,
          ArticleId: articleId
        }),
      })

      if (response.ok) {
        setFormData({ name: '', email: '', comment: '' })
        fetchComments()
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsCommenting(false)
    }
  }

  return (
    <>
      <div className="mt-4 p-6 rounded-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Comments</h2>
        <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border-b last:border-0 pb-4 hover:bg-gray-50 transition-colors duration-200 p-3 rounded-md border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Image src="/avatar.webp" alt={comment.subscriber.name} className="w-10 h-10 rounded-full" width={40} height={40} />
                    <p className="font-medium text-gray-800">{comment.subscriber.name}</p>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 text-gray-600 text-sm">{comment.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-sm">Be the first to share your thoughts!</p>
              <p className="text-gray-400 text-xs mt-1">Start the conversation below</p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-md text-gray-800">
        <h2 className="text-md font-black text-gray-800 mb-4 pb-2 border-b-gray-200 uppercase">Leave a Reply</h2>
        <div className="mb-4 flex flex-col md:flex-row gap-2">
          <input
            placeholder='Full Name'
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-400 rounded-sm focus:outline-none focus:border-red-500 text-sm"
            required
          />

          <input
            placeholder='Your Email'
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-400 rounded-sm focus:outline-none focus:border-red-500 text-sm"
            required
          />
        </div>

        <div className="mb-2 md:mb-4">
          <textarea
            placeholder='Your Comment'
            id="comment"
            name="comment"
            rows={3}
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
            className="w-full px-3 py-2 border border-gray-400 rounded-sm focus:outline-none focus:border-red-500 text-sm resize-none"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-red-600 text-white py-2 px-4 rounded-sm hover:bg-red-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
          disabled={isCommenting}
        >
          {isCommenting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Commenting...
            </span>
          ) : (
            "Comment!"
          )}
        </button>
      </form>
    </>
  )
}
