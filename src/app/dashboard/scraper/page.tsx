  "use client"

  import { useState } from 'react'
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

  export default function ScraperPage() {
    const [loading, setLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [scrapedArticles, setScrapedArticles] = useState<Article[]>([])

    const startScraping = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/scraper', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ category: selectedCategory }),
        })
      
        const data = await response.json()
        if (data.status === "success") {
          setScrapedArticles(data.articles)
          const messageDiv = document.createElement('div')
          messageDiv.textContent = `Successfully scraped ${data.total_articles} articles`
          messageDiv.style.position = 'fixed'
          messageDiv.style.bottom = '20px'
          messageDiv.style.right = '20px'
          messageDiv.style.padding = '10px'
          messageDiv.style.backgroundColor = 'green'
          messageDiv.style.color = 'white'
          messageDiv.style.borderRadius = '8px'
          messageDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'
          document.body.appendChild(messageDiv)
          setTimeout(() => messageDiv.remove(), 3000)
        }
      } catch (error) {
        console.log(error)
        const messageDiv = document.createElement('div')
        messageDiv.textContent = "Failed to scrape articles"
        messageDiv.style.position = 'fixed'
        messageDiv.style.bottom = '20px'
        messageDiv.style.right = '20px'
        messageDiv.style.padding = '10px'
        messageDiv.style.backgroundColor = 'red'
        messageDiv.style.color = 'white'
        messageDiv.style.borderRadius = '8px'
        messageDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'
        document.body.appendChild(messageDiv)
        setTimeout(() => messageDiv.remove(), 3000)
      } finally {
        setLoading(false)
      }
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

          const messageDiv = document.createElement('div')
          messageDiv.textContent = "Article made public successfully"
          messageDiv.style.position = 'fixed'
          messageDiv.style.bottom = '20px'
          messageDiv.style.right = '20px'
          messageDiv.style.padding = '10px'
          messageDiv.style.backgroundColor = 'green'
          messageDiv.style.color = 'white'
          messageDiv.style.borderRadius = '8px'
          messageDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'
          document.body.appendChild(messageDiv)
          setTimeout(() => messageDiv.remove(), 3000)
          
          setScrapedArticles(articles => 
            articles.map(a => 
              a.id === article.id ? {...a, isPublic: true} : a
            )
          )
        }
      } catch (error) {
        console.log(error)
        const messageDiv = document.createElement('div')
        messageDiv.textContent = "Failed to make article public"
        messageDiv.style.position = 'fixed'
        messageDiv.style.bottom = '20px'
        messageDiv.style.right = '20px'
        messageDiv.style.padding = '10px'
        messageDiv.style.backgroundColor = 'red'
        messageDiv.style.color = 'white'
        messageDiv.style.borderRadius = '8px'
        messageDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'
        document.body.appendChild(messageDiv)
        setTimeout(() => messageDiv.remove(), 3000)
      }
    }

    const deleteArticle = async (articleId: string) => {
      try {
        const response = await fetch(`/api/article?id=${articleId}`, {
          method: 'DELETE',
        })
      
        if (response.ok) {
          const messageDiv = document.createElement('div')
          messageDiv.textContent = "Article deleted successfully"
          messageDiv.style.position = 'fixed'
          messageDiv.style.bottom = '20px'
          messageDiv.style.right = '20px'
          messageDiv.style.padding = '10px'
          messageDiv.style.backgroundColor = 'green'
          messageDiv.style.color = 'white'
          messageDiv.style.borderRadius = '8px'
          messageDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'
          document.body.appendChild(messageDiv)
          setTimeout(() => messageDiv.remove(), 3000)
          
          setScrapedArticles(articles => 
            articles.filter(article => article.id !== articleId)
          )
        }
      } catch (error) {
        console.log(error)
        const messageDiv = document.createElement('div')
        messageDiv.textContent = "Failed to delete article"
        messageDiv.style.position = 'fixed'
        messageDiv.style.bottom = '20px'
        messageDiv.style.right = '20px'
        messageDiv.style.padding = '10px'
        messageDiv.style.backgroundColor = 'red'
        messageDiv.style.color = 'white'
        messageDiv.style.borderRadius = '8px'
        messageDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'
        document.body.appendChild(messageDiv)
        setTimeout(() => messageDiv.remove(), 3000)
      }
    }

    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">News Scraper</h1>
        
          <div className="flex gap-4 items-center bg-white p-6 rounded-lg shadow-sm">
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
              className="px-6 py-2 transition-all duration-200 hover:scale-105"
            >
              {loading ? "Scraping..." : "Start Scraping"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scrapedArticles.map((article) => (
            <Card key={article.id} className=" transition-all duration-200">
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
                <CardTitle className="text-xl mb-4  text-gray-800">
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
                      className={`p-2 ${article.isPublic ? 'text-green-600 border-green-600  hover:bg-green-100' : ' border-red-600 hover:bg-red-100 text-red-600 bg-green-50'} rounded border cursor-pointer text-xs`}
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
