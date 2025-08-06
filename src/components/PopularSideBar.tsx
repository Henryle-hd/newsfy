import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const router = useRouter()

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

  const fetchAllArticles = async () => {
    try {
      const response = await fetch('/api/article?all=true&isPublic=true')
      const data = await response.json()
      return data.articles || []
    } catch (error) {
      console.error('Error fetching all articles:', error)
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

  // Debounce utility function with proper TypeScript typing
  function debounce<T extends unknown[]>(
    func: (...args: T) => void, 
    wait: number
  ): (...args: T) => void {
    let timeout: NodeJS.Timeout
    return function executedFunction(...args: T) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    
    try {
      const articles = await fetchAllArticles()
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
      
      const filtered = articles.filter((article: Article) => {
        const searchableContent = [
          article.title,
          article.content,
          article.category,
          article.ArticleSource || ''
        ].join(' ').toLowerCase()

        return searchTerms.every(term => searchableContent.includes(term))
      })

      setSearchResults(filtered.slice(0, 6)) // Limit to 6 results for sidebar
      setShowSearchResults(true)
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => performSearch(query), 300),
    [performSearch]
  )

  useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search page with query
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery)
    }
  }

  const handleSearchBlur = () => {
    // Delay hiding results to allow for clicks
    setTimeout(() => {
      setShowSearchResults(false)
    }, 200)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowSearchResults(false)
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const highlightSearchTerms = (text: string, query: string) => {
    if (!query.trim()) return text

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
    let highlightedText = text

    searchTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark style="background-color: #fef08a; color: #92400e; padding: 1px 2px; border-radius: 2px;">$1</mark>')
    })

    return highlightedText
  }

  return (
    <div className="lg:w-1/4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-b-gray-200 flex items-center">
          POPULAR POSTS
          <svg className="w-5 h-5 ml-2 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM12 20c-3.31 0-6-2.69-6-6 0-1.53.3-3.04.86-4.43 1.01 1.01 2.41 1.63 3.97 1.63 2.66 0 4.75-1.83 5.28-4.43C17.34 8.97 18 11.44 18 14c0 3.31-2.69 6-6 6z"/>
          </svg>
        </h2>

        {/* Enhanced Search Box */}
        <div className="relative mb-5">
          <form onSubmit={handleSearchSubmit}>
            <div className="bg-[#e53935] rounded-md px-4 py-3 flex items-center relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="flex-1 bg-transparent outline-none text-white placeholder-white text-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-white hover:text-gray-200 mr-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                disabled={isSearching}
                className="text-white hover:text-gray-200 transition-colors"
              >
                {isSearching ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                )}
              </button>
            </div>
          </form>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-md shadow-lg z-50 max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <>
                  <div className="p-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">
                        Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => router.push(`/search?q=${encodeURIComponent(searchQuery)}`)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        View all
                      </button>
                    </div>
                  </div>
                  {searchResults.map((article) => (
                    <a
                      key={article.id}
                      href={`/habari/${article.id}`}
                      className="block p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 group transition-colors"
                    >
                      <div className="flex gap-3">
                        <img
                          src={article.image || '/logo.webp'}
                          alt={article.title}
                          className="w-12 h-12 object-cover rounded flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 
                            className="text-sm font-medium text-gray-900 group-hover:text-red-600 line-clamp-2 mb-1 transition-colors"
                            dangerouslySetInnerHTML={{ 
                              __html: highlightSearchTerms(truncateText(article.title, 60), searchQuery) 
                            }}
                          />
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                              {article.category}
                            </span>
                            <span>{article.views} views</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </>
              ) : (
                <div className="p-4 text-center">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">No articles found</p>
                  <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Popular Posts List */}
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
                  <span className="absolute top-0 right-0 bg-black text-white px-2 py-1 text-xs">
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