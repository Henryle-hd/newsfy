"use client"

import React, { useState, useEffect } from 'react'
import NewsCardComp from './NewCard'
import PopularSideBar from './PopularSideBar'
import HotNewsTicker from './HotNewsBanner'
import { Skeleton } from "@/components/ui/skeleton"

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
    id: string
    name?: string
    email: string
    image?: string
  }
  comment?: Array<{
    id: string
    content: string
    subscriberId: string
    ArticleId: string
    createdAt: Date
    updatedAt: Date
  }>
}

interface RecentNewsProps {
  category?: 'ALL' | 'KIMATAIFA' | 'AFYA' | 'TEHAMA' | 'AJIRA' | 'BURUDANI' | 'MICHEZO'
}

export default function RecentNews({ category = 'ALL' }: RecentNewsProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    fetchArticles(currentPage)
  }, [currentPage, category])

  const fetchArticles = async (page: number) => {
    setLoading(true)
    try {
      const url = category === 'ALL' 
        ? `/api/article?page=${page}`
        : `/api/article?page=${page}&category=${category}`
      const response = await fetch(url)
      const data = await response.json()
      setArticles(data.articles)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
    setLoading(false)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const NewsCardSkeleton = ({ isFirst = false }) => (
    <div className="flex flex-col">
      <div className="relative h-62 overflow-hidden rounded-sm mt-5">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-4 right-4">
          <Skeleton className="w-16 h-16 rounded-md" />
        </div>
      </div>
      <div className="px-6 py-6 sm:p-8 sm:pb-6 bg-white rounded-md overflow-hidden w-[93%] sm:w-[96%] mx-auto -mt-10 z-10">
        <Skeleton className={`h-6 ${isFirst ? "w-3/4" : "w-2/3"} mb-2`} />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 pt-21 md:pl-7">
      <div className="flex flex-col lg:flex-row gap-8 ">
        <div className="lg:w-3/4">
        <HotNewsTicker />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
            {loading ? (
              <>
                <div className="md:col-span-2">
                  <NewsCardSkeleton isFirst={true} />
                </div>
                <div className="md:col-span-1">
                  <NewsCardSkeleton />
                </div>
                {[...Array(4)].map((_, index) => (
                  <NewsCardSkeleton key={index} />
                ))}
              </>
            ) : articles.length > 0 && (
              <>
                <div className="md:col-span-2">
                  <NewsCardComp
                    key={articles[0].id}
                    id={articles[0].id}
                    day={articles[0].day}
                    month={articles[0].month}
                    title={articles[0].title}
                    image={articles[0].image}
                    pageName={articles[0].category}
                    isFirst={true}
                  />
                </div>
                <div className="md:col-span-1">
                  <NewsCardComp
                    key={articles[1].id}
                    id={articles[1].id}
                    day={articles[1].day}
                    month={articles[1].month}
                    title={articles[1].title}
                    image={articles[1].image}
                    pageName={articles[1].category}
                    isFirst={false}
                  />
                </div>
                
                {articles.slice(2, isMobile ? 4 : articles.length).map((article) => (
                  <NewsCardComp
                    key={article.id}
                    id={article.id}
                    day={article.day}
                    month={article.month}
                    title={article.title}
                    image={article.image}
                    pageName={article.category}
                    isFirst={false}
                  />
                ))}
              </>
            )}
          </div>
          <div className="flex justify-center items-center space-x-2 mt-4 text-gray-800 ">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-red-600 hover:text-gray-100 transition-colors" 
              title="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  disabled={loading}
                  className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md ${
                    currentPage === index + 1 ? 'bg-red-600 text-white' : 'hover:bg-red-600 hover:text-gray-100'
                  } transition-colors`}
                  title={`Page ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-red-600 hover:text-gray-100 transition-colors" 
              title="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
       {/* Popular newz Kulia box */}
       <PopularSideBar />
      </div>
    </div>
  )
}
