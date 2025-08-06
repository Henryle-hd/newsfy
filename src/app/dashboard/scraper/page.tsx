"use client"

import { useState, useEffect, useRef } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Settings, Clock, Globe, Bot, X } from "lucide-react"

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

interface ScraperSettings {
  id?: string
  isAuto: boolean
  timeGap: number
  makeArticlePublic: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface AutoScrapeStatus {
 status: string
 shouldRunAutoScrape: boolean
 settings: {
   id?: string
   isAuto: boolean
   timeGap: number
   makeArticlePublic: boolean
   createdAt?: Date
   updatedAt?: Date
 } | null
 lastScrape: Date | null
 message: string
}

export default function ScraperPage() {
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [scrapedArticles, setScrapedArticles] = useState<Article[]>([])
  const [scraperSettings, setScraperSettings] = useState<ScraperSettings>({
    isAuto: false,
    timeGap: 24,
    makeArticlePublic: false
  })
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [autoScrapeStatus, setAutoScrapeStatus] = useState<AutoScrapeStatus | null>(null)
  
  // AbortController ref to handle request cancellation
  const abortControllerRef = useRef<AbortController | null>(null)

  // Load scraper settings on component mount
  useEffect(() => {
    loadScraperSettings()
    checkAutoScrapeStatus()
  }, [])

  // Cleanup function to abort requests on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const loadScraperSettings = async () => {
    try {
      const response = await fetch('/api/scraper-settings')
      const data = await response.json()
      if (data.status === "success") {
        setScraperSettings(data.settings)
      }
    } catch (error) {
      console.error("Failed to load scraper settings:", error)
    }
  }

  const checkAutoScrapeStatus = async () => {
    try {
      const response = await fetch('/api/scraper?action=check')
      const data = await response.json()
      if (data.status === "success") {
        setAutoScrapeStatus(data)
      }
    } catch (error) {
      console.error("Failed to check auto scrape status:", error)
    }
  }

  const updateScraperSettings = async (newSettings: Partial<ScraperSettings>) => {
    try {
      setSettingsLoading(true)
      const response = await fetch('/api/scraper-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      })
      
      const data = await response.json()
      if (data.status === "success") {
        setScraperSettings(data.settings)
        showToast("Settings updated successfully", "success")
        checkAutoScrapeStatus() // Refresh auto scrape status
      } else {
        showToast("Failed to update settings", "error")
      }
    } catch (error) {
      console.error("Failed to update settings:", error)
      showToast("Failed to update settings", "error")
    } finally {
      setSettingsLoading(false)
    }
  }

  const startScraping = async () => {
    try {
      setLoading(true)
      
      // Create new AbortController for this request
      abortControllerRef.current = new AbortController()
      
      const response = await fetch('/api/scraper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: selectedCategory }),
        signal: abortControllerRef.current.signal
      })
    
      const data = await response.json()
      if (data.status === "success") {
        setScrapedArticles(data.articles)
        showToast(`Successfully scraped ${data.total_articles} articles`, "success")
      } else {
        showToast("Failed to scrape articles", "error")
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        showToast("Scraping cancelled", "info")
      } else {
        console.log(error)
        showToast("Failed to scrape articles", "error")
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  const cancelScraping = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setLoading(false)
  }

  const executeAutoScrape = async () => {
    try {
      setLoading(true)
      
      // Create new AbortController for this request
      abortControllerRef.current = new AbortController()
      
      const response = await fetch('/api/scraper?action=execute', {
        signal: abortControllerRef.current.signal
      })
      const data = await response.json()
      
      if (data.status === "success") {
        setScrapedArticles(data.articles || [])
        showToast(`Auto scrape completed: ${data.total_articles} articles`, "success")
        checkAutoScrapeStatus() // Refresh status
      } else if (data.status === "skipped") {
        showToast("Auto scrape conditions not met", "info")
      } else {
        showToast("Auto scrape failed", "error")
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        showToast("Auto scrape cancelled", "info")
      } else {
        console.error("Auto scrape failed:", error)
        showToast("Auto scrape failed", "error")
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  const showToast = (message: string, type: "success" | "error" | "info") => {
    const messageDiv = document.createElement('div')
    messageDiv.textContent = message
    messageDiv.style.position = 'fixed'
    messageDiv.style.bottom = '20px'
    messageDiv.style.right = '20px'
    messageDiv.style.padding = '12px 16px'
    messageDiv.style.color = 'white'
    messageDiv.style.borderRadius = '8px'
    messageDiv.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
    messageDiv.style.zIndex = '1000'
    messageDiv.style.fontSize = '14px'
    messageDiv.style.fontWeight = '500'
    
    switch (type) {
      case 'success':
        messageDiv.style.backgroundColor = '#10b981'
        break
      case 'error':
        messageDiv.style.backgroundColor = '#ef4444'
        break
      case 'info':
        messageDiv.style.backgroundColor = '#FFFF11'
        break
    }
    
    document.body.appendChild(messageDiv)
    setTimeout(() => messageDiv.remove(), 4000)
  }

  const makePublic = async (article: Article) => {
    try {
      const response = await fetch('/api/article', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: article.id,
          isPublic: true
        }),
      })
    
      if (response.ok) {
        // Get subscribers
        const subscribersResponse = await fetch('/api/subscriber')
        const subscribers = await subscribersResponse.json()
        
        // Prepare email content
        const emailContent = `
          <div style="">
            <div class="">
              <img src="${article.image}" alt="${article.title}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px;"/>
              <h3 style="color: #1a202c; margin: 15px 0; font-size: large;">${article.title}</h3>
              <p style="color: #4a5568;">${article.content.substring(0, 500)}...</p>
              <div style="margin: 20px 0;">
                <a href="https://newsfy-nine.vercel.app/habari/${article.id}" style="background: #E6002D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: large;">Read More</a>
              </div>
            </div>
          </div>
        `

        // Send email
        await fetch('/api/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: `Updates: ${article.title}`,
            content: emailContent,
            to: subscribers.map((sub: { email: string }) => sub.email),
          }),
        })

        showToast("Article made public successfully", "success")
        
        setScrapedArticles(articles => 
          articles.map(a => 
            a.id === article.id ? {...a, isPublic: true} : a
          )
        )
      }
    } catch (error) {
      console.log(error)
      showToast("Failed to make article public", "error")
    }
  }

  const deleteArticle = async (articleId: string) => {
    try {
      const response = await fetch(`/api/article?id=${articleId}`, {
        method: 'DELETE',
      })
    
      if (response.ok) {
        showToast("Article deleted successfully", "success")
        
        setScrapedArticles(articles => 
          articles.filter(article => article.id !== articleId)
        )
      }
    } catch (error) {
      console.log(error)
      showToast("Failed to delete article", "error")
    }
  }

  const formatTimeGap = (hours: number) => {
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`
    }
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    if (remainingHours === 0) {
      return `${days} day${days !== 1 ? 's' : ''}`
    }
    return `${days} day${days !== 1 ? 's' : ''} ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800 pb-2 flex items-center justify-center uppercase">News Scraper</h1>
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-gray-100 hover:text-gray-50 rounded-sm"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        {showSettings && (
          <Card className="mb-6 border-l-4 border-l-red-500 rounded-sm shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Scraper Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    Auto Scraping
                  </Label>
                  <p className="text-sm text-gray-500">
                    Enable automatic scraping based on time intervals
                  </p>
                </div>
                <Switch
                  checked={scraperSettings.isAuto}
                  onCheckedChange={(checked) => 
                    updateScraperSettings({ isAuto: checked })
                  }
                  disabled={settingsLoading}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Time Gap (hours)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="168"
                    value={scraperSettings.timeGap}
                    onChange={(e) => 
                      updateScraperSettings({ timeGap: parseInt(e.target.value) || 24 })
                    }
                    disabled={settingsLoading}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Scrape every {formatTimeGap(scraperSettings.timeGap)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Auto Publish Articles
                    </Label>
                    <Switch
                      checked={scraperSettings.makeArticlePublic}
                      onCheckedChange={(checked) => 
                        updateScraperSettings({ makeArticlePublic: checked })
                      }
                      disabled={settingsLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Automatically make scraped articles public
                  </p>
                </div>
              </div>

              {scraperSettings.isAuto && autoScrapeStatus && (
                <>
                  <Separator />
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Auto Scrape Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Should Run:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          autoScrapeStatus.shouldRunAutoScrape 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {autoScrapeStatus.shouldRunAutoScrape ? 'Yes' : 'No'}
                        </span>
                      </div>
                      {autoScrapeStatus.lastScrape && (
                        <div>
                          <span className="text-blue-700">Last Scrape:</span>
                          <span className="ml-2 text-gray-600">
                            {new Date(autoScrapeStatus.lastScrape).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      
        <Card className='rounded-sm shadow-none'>
          <CardContent className="p-6">
            {!scraperSettings.isAuto ? (
              // Manual Scraping Interface
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-gray-600">Manual scraping mode enabled</span>
                </div>
                
                <div className="flex gap-4 items-center flex-wrap">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="ajira">AJIRA</SelectItem>
                      <SelectItem value="burudani">BURUDANI</SelectItem>
                      <SelectItem value="michezo">MICHEZO</SelectItem>
                      <SelectItem value="habari">HABARI</SelectItem>
                      <SelectItem value="afya">AFYA</SelectItem>
                      <SelectItem value="tehama">TEHAMA</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button 
                    onClick={startScraping} 
                    disabled={loading}
                    className="px-6 py-2 transition-all duration-200 hover:scale-105 rounded-sm shadow-none"
                  >
                    {loading ? "Scraping..." : "Start Scraping"}
                  </Button>

                  {loading && (
                    <Button 
                      onClick={cancelScraping} 
                      variant="destructive"
                      className="px-4 py-2 flex items-center gap-2 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              // Auto Scraping Interface
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">
                    Auto scraping enabled - Running every {formatTimeGap(scraperSettings.timeGap)}
                  </span>
                </div>

                <div className="flex gap-4 items-center flex-wrap">
                  <Button
                    onClick={() => updateScraperSettings({ isAuto: false })}
                    variant="outline"
                    disabled={settingsLoading}
                    className="px-6 py-2"
                  >
                    Turn Off Auto Scraping
                  </Button>

                  <Button
                    onClick={executeAutoScrape}
                    disabled={loading}
                    variant="secondary"
                    className="px-6 py-2"
                  >
                    {loading ? "Running..." : "Run Now"}
                  </Button>

                  {loading && (
                    <Button
                      onClick={cancelScraping}
                      variant="destructive"
                      className="px-4 py-2 flex items-center gap-2 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  )}

                  <Button
                    onClick={checkAutoScrapeStatus}
                    variant="ghost"
                    className="px-4 py-2"
                  >
                    Refresh Status
                  </Button>
                </div>

                {autoScrapeStatus?.shouldRunAutoScrape && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        Auto scrape is ready to run based on time gap settings
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {scrapedArticles.map((article) => (
          <Card key={article.id} className="transition-all duration-200">
            <CardHeader className="relative p-0">
              <div className="relative w-full h-48">
                <img
                  src={article.image || "/placeholder.jpg"}
                  alt={article.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-red-600 text-white px-3 py-2 rounded-sm shadow-md">
                <div className="text-lg font-bold">{article.day}</div>
                <div className="text-sm">{article.month}</div>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <CardTitle className="text-xl mb-4 text-gray-800">
                {article.title}
              </CardTitle>
              <div className="flex items-center justify-between mt-4">
                <span className="px-3 py-1 bg-yellow-900 text-white text-sm rounded-sm font-medium">
                  {article.category}
                </span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => makePublic(article)}
                    disabled={article.isPublic}
                    variant={article.isPublic ? "outline" : "default"}
                    className={`p-2 ${article.isPublic ? 'text-green-600 border-green-600 hover:bg-green-100' : 'border-red-600 hover:bg-red-100 text-red-600 bg-green-50'} rounded border cursor-pointer text-xs`}
                  >
                    {article.isPublic ? "Published" : "Make Public"}
                  </Button>
                  <Button
                    onClick={() => deleteArticle(article.id)}
                    variant="destructive"
                    className="transition-all duration-200 hover:bg-red-700 cursor-pointer"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}