"use client"

import React, { useState } from 'react'

export default function LikeBtn({ articleId }: { articleId: string }) {
  const [isLiked, setIsLiked] = useState(false)

  interface Article {
    id: string
    likes: number
  }

  const [article, setArticle] = useState<Article | null>(null)

  const handleLikeClick = async () => {
    try {
      const response = await fetch(`/api/article`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: articleId,
          likes: article!.likes + 1
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update likes')
      }
      
      const updatedArticle = await response.json()
      setArticle(updatedArticle)
      setIsLiked(true)
    } catch (error) {
      console.error('Error updating likes:', error)
    }
  }

  React.useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/article?id=${articleId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch article')
        }
        const data = await response.json()
        setArticle(data)
      } catch (error) {
        console.error('Error fetching article:', error)
      }
    }

    fetchArticle()
  }, [articleId])

  if (!article) return null

  return (
     <button 
                onClick={handleLikeClick}
                disabled={isLiked}
                className={`flex items-center space-x-2 cursor-pointer ${
                  isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                }`}
              >
                <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{article.likes}</span>
              </button>
  )
}
