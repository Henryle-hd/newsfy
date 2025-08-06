"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Search, X, Filter, Tag, Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import NewsCardComp from '@/components/NewCard'


interface Article {
  id: string
  title: string
  content: string
  image: string
  day: string
  month: string
  status: string
  isPublic: boolean
  createdByBot: boolean
  ArticleSource: string
  userid?: string
  category: string
  views: number
  likes: number
  createdAt: Date
  updatedAt: Date
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [searchStats, setSearchStats] = useState({ total: 0, filtered: 0 })

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'HABARI', label: 'Habari' },
    { value: 'AFYA', label: 'Afya' },
    { value: 'TEHAMA', label: 'Tehama' },
    { value: 'AJIRA', label: 'Ajira' },
    { value: 'BURUDANI', label: 'Burudani' },
    { value: 'MICHEZO', label: 'Michezo' },
  ]

  // Fetch all public articles on component mount
  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/article?all=true&isPublic=true')
      const data = await response.json()
      
      if (data.articles) {
        setArticles(data.articles)
        setFilteredArticles(data.articles)
        setSearchStats({ total: data.articles.length, filtered: data.articles.length })
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  // Debounced search function
  const performSearch = useCallback(
    debounce((query: string, category: string) => {
      setSearching(true)
      
      let filtered = articles

      // Filter by search query
      if (query.trim()) {
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
        
        filtered = filtered.filter(article => {
          const searchableContent = [
            article.title,
            article.content,
            article.category,
            article.ArticleSource || ''
          ].join(' ').toLowerCase()

          return searchTerms.every(term => searchableContent.includes(term))
        })
      }

      // Filter by category
      if (category !== 'all') {
        filtered = filtered.filter(article => 
          article.category.toUpperCase() === category.toUpperCase()
        )
      }

      setFilteredArticles(filtered)
      setSearchStats({ total: articles.length, filtered: filtered.length })
      setSearching(false)
    }, 300),
    [articles]
  )

  // Handle search input changes
  useEffect(() => {
    performSearch(searchQuery, selectedCategory)
  }, [searchQuery, selectedCategory, performSearch])

  const clearSearch = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setFilteredArticles(articles)
    setSearchStats({ total: articles.length, filtered: articles.length })
  }

  const highlightSearchTerms = (text: string, query: string) => {
    if (!query.trim()) return text

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0)
    let highlightedText = text

    searchTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>')
    })

    return highlightedText
  }
  // Debounce utility function
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
  return (
    <div className="min-h-screen  pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-800 pb-2 flex items-center justify-center uppercase">Search News</h1>
          <p className="text-gray-600 text-sm">Find the latest news and articles</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-none border-0 bg-transparent">
          <CardContent className="p-6">
            {/* Main Search Bar */}
            <div className="relative mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search articles by title, content, category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-12 py-3 text-lg border-gray-300 focus:border-red-500 focus:ring-red-500 rounded-lg h-16"
                />
                {searchQuery && (
                  <Button
                    onClick={clearSearch}
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Search Stats and Filters Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {searching ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Searching...
                    </div>
                  ) : (
                    <span>
                      Showing {searchStats.filtered.toLocaleString()} of {searchStats.total.toLocaleString()} articles
                    </span>
                  )}
                </div>
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    {searchQuery}
                  </Badge>
                )}
              </div>

              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Category
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-red-500" />
              <p className="text-gray-600">Loading articles...</p>
            </div>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="space-y-6">
            {/* Active Filters */}
            {(searchQuery || selectedCategory !== 'all') && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchQuery}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSearchQuery('')}
                    />
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {categories.find(c => c.value === selectedCategory)?.label}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedCategory('all')}
                    />
                  </Badge>
                )}
                <Button
                  onClick={clearSearch}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <div key={article.id} className="transform transition-all duration-200 hover:scale-105">
                  <NewsCardComp
                    id={article.id}
                    title={searchQuery ? highlightSearchTerms(article.title, searchQuery) : article.title}
                    image={article.image}
                    day={article.day}
                    month={article.month}
                    pageName={article.category}
                    isFirst={false}
                    // category={article.category}
                    // content={searchQuery ? highlightSearchTerms(article.content.substring(0, 150) + '...', searchQuery) : article.content.substring(0, 150) + '...'}
                    // views={article.views}
                    // likes={article.likes}
                    // createdAt={article.createdAt}
                  />
                </div>
              ))}
            </div>

            {/* Load More Section - if you want pagination later */}
            {filteredArticles.length >= 12 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">
                  Showing {filteredArticles.length} articles
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? `No articles found matching "${searchQuery}"`
                  : "Try adjusting your search criteria"
                }
              </p>
              {(searchQuery || selectedCategory !== 'all') && (
                <Button onClick={clearSearch} variant="outline">
                  Clear filters and show all articles
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
