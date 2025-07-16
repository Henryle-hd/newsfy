"use client"
import { FolderGit2, Target, Users, Pencil, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Skeleton } from "@/components/ui/skeleton"
import SummaryBar from '@/components/SummaryCard'
import { SearchFilters } from '@/components/SearchFilters'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
interface Article {
    id: string
    day: string
    month: string
    title: string
    image: string
    status: string
    isPublic: boolean
    content: string
    category: string
    userid: string
    createdAt: string
    createdByBot: boolean
    user: {
      name: string | null
    }
}

export default function NewsComp() {
    const [articles, setArticles] = useState<Article[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState("ALL")
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [isUpdating, setIsUpdating] = useState<string | null>(null)

    useEffect(() => {
      const fetchArticles = async () => {
        try {
          const response = await fetch('/api/article?all=true')
          const data = await response.json()
          setArticles(data.articles)
        } catch (error) {
          console.error('Error fetching articles:', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchArticles()
    }, [])

    const publicArticles = articles.filter(a => a.isPublic).length
    const privateArticles = articles.filter(a => !a.isPublic).length
    const botArticles = articles.filter(a => a.createdByBot).length

    const handleDelete = async (id: string) => {
      setIsDeleting(id)
      try {
        await fetch(`/api/article?id=${id}`, {
          method: 'DELETE'
        })
        setArticles(articles.filter(article => article.id !== id))
      } catch (error) {
        console.error('Error deleting article:', error)
      }
      setIsDeleting(null)
    }

    const handlePublicToggle = async (article: Article) => {
      setIsUpdating(article.id)
      try {
        const response = await fetch('/api/article', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...article,
            isPublic: !article.isPublic
          }),
        })
        
        if (response.ok) {
          // If making article public, send email to subscribers
          if (!article.isPublic) {
            // Get subscribers
            const subscribersResponse = await fetch('/api/subscriber')
            const subscribers = await subscribersResponse.json()
            
            // Prepare email content
            const emailContent = `
              <div style="padding: px;">
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
          }

          setArticles(articles.map(a =>
            a.id === article.id ? { ...a, isPublic: !a.isPublic } : a
          ))
        }
      } catch (error) {
        console.error('Error updating article:', error)
      }
      setIsUpdating(null)
    }

    const filterOptions = [
      { value: "ALL", label: "All Articles" },
      { value: "PUBLIC", label: "Public" },
      { value: "NEW", label: "New" }
    ]

    const filteredArticles = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "ALL" ||
        (typeFilter === "PUBLIC" && article.isPublic) ||
        (typeFilter === "NEW" && article.status === "new")
      return matchesSearch && matchesType
    })

    return (
      <div className="py-5 px-5 sm:px-21">
        <div className='max-w-5xl mx-auto flex justify-end'>
          <Link href="/dashboard/articles/create" className='mb-4 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-sm hover:bg-gray-800 transition-colors cursor-pointer'>
            + Add Article
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-8 max-w-5xl m-auto">
          <SummaryBar
            title="Total Articles"
            value={articles.length.toString()}
            icon={<FolderGit2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />}
            isLoading={isLoading}
          />
          <SummaryBar
            title="Public Articles"
            value={publicArticles.toString()}
            icon={<Users className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />}
            isLoading={isLoading}
          />
          <SummaryBar
            title="Private Articles"
            value={privateArticles.toString()}
            icon={<Target className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />}
            isLoading={isLoading}
          />
          <SummaryBar
            title="Bot Articles"
            value={botArticles.toString()}
            icon={<Target className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />}
            isLoading={isLoading}
          />
        </div>

        <div className="max-w-5xl mx-auto">
          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            filterOptions={filterOptions}
          />

          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4 sm:p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-10">
              <FolderGit2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new article.</p>
            </div>
          ) : (
            filteredArticles.map((article, idx) => (
              <div key={article.id} className={`${idx % 2 == 0 ? "bg-slate-50" : "bg-slate-100"} border-b hover:bg-gray-100 transition-colors rounded-sm`}>
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <img
                      src={article.image}
                      alt={article.title}
                      width={60}
                      height={60}
                      className="w-12 h-12 sm:w-15 sm:h-15 object-cover rounded-full"
                    />
                  </div>
                  {/* href={`/dashboard/articles/${article.id}`} */}
                  <div  className="flex-grow text-center sm:text-left">
                    <h3 className="text-sm sm:text-md font-semibold text-gray-900 mb-1">
                      {article.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                        By <span>{article.createdByBot ? 'automated bot' : article.user?.name || 'Unknown'}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">{article.status}</span>
                      <span className={`bg-gray-100 px-2 py-1 rounded ${article.isPublic ? 'text-green-600' : 'text-red-600'}`}>
                        {article.isPublic ? 'Public' : 'Private'}
                      </span>
                      
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {article.category}
                        </span>

                    </div>
                  </div>

                  <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-4 space-x-2">
                    <button
                      onClick={() => handlePublicToggle(article)}
                      className={`p-2 ${article.isPublic ? 'text-green-600 border-green-600 hover:bg-green-100' : 'text-red-600 border-red-600 hover:bg-red-100'} rounded border cursor-pointer text-xs`}
                      disabled={isUpdating === article.id}
                    >
                      {isUpdating === article.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        article.isPublic ? 'Make Private' : 'Make Public'
                      )}
                    </button>
                    <Link href={`/dashboard/articles/edit/${article.id}`}>
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded border border-blue-600 cursor-pointer" title="Edit article">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="p-2 text-red-600 hover:bg-red-100 rounded border border-red-600 cursor-pointer"
                          title="Delete article"
                          disabled={isDeleting === article.id}
                        >
                          {isDeleting === article.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white p-6 rounded-lg shadow-xl w-sm mx-auto">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2 text-xl font-semibold text-red-600">
                            <AlertTriangle className="w-6 h-6" />
                            Confirm Deletion
                          </AlertDialogTitle>
                          <AlertDialogDescription className="mt-3 text-gray-600">
                            Are you sure you want to delete this article? This action cannot be undone and all associated data will be permanently removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex justify-end gap-3 mt-6">
                          <AlertDialogCancel className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors rounded-sm shadow-none">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(article.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-sm shadow-none hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </AlertDialogAction>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
}
