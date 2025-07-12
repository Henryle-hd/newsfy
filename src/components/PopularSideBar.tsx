  import React, { useEffect, useState } from 'react'
import Subscribe from './subscribe'
import FollowUs from './FollowUs'
  interface Article {
    id: string
    title: string
    content: string
    image: string
    day: string
    month: string
    status?: string
    isPublic: boolean
    createdByBot: boolean
    ArticleSource?: string
    userid?: string
    category: string
    views: number
    likes: number
    createdAt: Date
    updatedAt: Date
    user?: {
      name?: string
      image?: string
    }
    comment: Array<{
      id: string
      content: string
      createdAt: Date
    }>
  }

  export default function PopularSideBar() {
    const [newsToDisplay, setNewsToDisplay] = useState<Article[]>([])
    const [allNews, setAllNews] = useState<Article[]>([])

    const fetchHotNews = async () => {
      try {
        const response = await fetch('/api/hotnews')
        const data = await response.json()
        return data
      } catch (error) {
        console.error('Error fetching hot news:', error)
        return []
      }
    }

    useEffect(() => {
      const getNews = async () => {
        const news = await fetchHotNews()
        setAllNews(news)
        setNewsToDisplay(news.slice(0, 2))
      }
      getNews()
    }, [])

    useEffect(() => {
      let currentIndex = 0
      const interval = setInterval(() => {
        currentIndex = (currentIndex + 2) % allNews.length
        setNewsToDisplay(allNews.slice(currentIndex, currentIndex + 2))
      }, 5000)

      return () => clearInterval(interval)
    }, [allNews])

    return (
     <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-b-gray-200 flex items-center">
                POPULAR POSTS
                <svg className="w-5 h-5 ml-2 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM12 20c-3.31 0-6-2.69-6-6 0-1.53.3-3.04.86-4.43 1.01 1.01 2.41 1.63 3.97 1.63 2.66 0 4.75-1.83 5.28-4.43C17.34 8.97 18 11.44 18 14c0 3.31-2.69 6-6 6z"/>
                </svg>
              </h2>

            <div className="bg-[#e53935] rounded-md px-4 py-3 flex items-center mb-5">
          <input
            type="text"
            placeholder="Search Here"
            className="flex-1 bg-transparent outline-none text-white placeholder-white text-sm"
              />
              <svg
                className="w-4 h-4 text-white ml-2"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
        </div>
            <ul className="space-y-6">
              {newsToDisplay.map((news: Article, index: number) => (
                <li key={index} className="pb-4 border-b border-gray-200 last:border-0">
                  <a href={`/habari/${news.id}`} className="block group">
                    <div className="relative mb-3">
                      <img
                        src={news.image || '/logo.webp'}
                        alt={news.title}
                        width={400}
                        height={160}
                        className="w-full h-48 object-cover rounded-sm"
                      />
                      <span className="absolute top-0 right-0 bg-black text-white px-2 py-1 text-xs ">
                        {news.category}
                      </span>
                    </div>
                    <h3 className="text-gray-900 font-semibold text-lg group-hover:text-red-600 transition-colors duration-200 line-clamp-2 mb-2">
                      {news.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {news.views}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {news.likes}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        {news.comment.length}
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* FollowUs */}
          <FollowUs />
          {/* SUBSCRIBE */}
          <Subscribe />
        </div>
  )
}
