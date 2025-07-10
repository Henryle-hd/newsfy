  'use client'
  import React, { useState } from 'react'
  import { useForm } from 'react-hook-form'
  import { useRouter } from 'next/navigation'
  import RichTextEditor from '@/components/dashboard/RichTextEditor'
  import ImageUpload from '@/components/ImageUpload'
//   import { useSession } from 'next-auth/react'

  export default function Page() {
    const [imageUrl, setImageUrl] = useState('')
    const [titleError, setTitleError] = useState('')
    const [contentError, setContentError] = useState('')
    const [imageError, setImageError] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
  
    const router = useRouter()
    // const { data: session } = useSession()
    const { register, handleSubmit, setValue } = useForm({
      defaultValues: {
        title: '',
        content: '',
        image: '',
        day: String(new Date().getDate()),
        month: String(new Date().getMonth() + 1),
        status: 'NEW',
        isPublic: false,
        createdByBot: false,
        ArticleSource: '',
        category: ''
      }
    })

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (value.length === 0) {
        setTitleError('')
      } else if (value.length < 5) {
        setTitleError('Title must be at least 5 characters')
      } else if (value.length > 100) {
        setTitleError('Title cannot exceed 100 characters')
      } else {
        setTitleError('')
      }
    }

    const onSubmit = async (data: Record<string, unknown>) => {
      try {
        setLoading(true)
        setError('')

        // Validation
        if (!data.title || String(data.title).length < 5) {
          setError('Title must be at least 5 characters')
          setLoading(false)
          return
        }

        if (!data.content) {
          setError('Content is required')
          setLoading(false)
          return
        }

        if (!data.image) {
          setError('Article image is required')
          setLoading(false)
          return
        }

        const response = await fetch('/api/article', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (response.ok) {
          router.push('/dashboard/articles')
        } else {
          const responseData = await response.json()
          setError(responseData.error || 'Failed to create article')
        }
      } catch (error) {
        console.error('Error creating article:', error)
        setError('Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-2 sm:px-0">
        <div className="w-full max-w-3xl m-auto rounded-md flex overflow-hidden px-3 sm:px-10 my-5">
          <div className="w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-3">
              <div>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="Article Title"
                  onChange={handleTitleChange}
                  className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {titleError && (
                  <span className="text-xs mt-1 text-red-600">{titleError}</span>
                )}
              </div>

              <div>
                <RichTextEditor
                  value=""
                  onChange={(content) => {
                    setValue('content', content)
                    setContentError(!content ? 'Content is required' : '')
                  }}
                  placeholder="Write your article content..."
                  className="min-h-[300px] border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {contentError && (
                  <span className="text-xs mt-1 text-red-600">{contentError}</span>
                )}
              </div>

              <div>
                <ImageUpload
                  onUploadSuccess={(result) => {
                    setImageUrl(result.url)
                    setValue('image', result.url)
                    setImageError('')
                  }}
                  onUploadError={(error) => {
                    console.error('Upload error:', error)
                    setImageError('Failed to upload image')
                  }}
                  initialImageUrl={imageUrl}
                  placeholder="Upload Article Image"
                  maxSizeInMB={5}
                  previewHeight="400px"
                />
                {imageError && (
                  <span className="text-xs mt-1 text-red-600">{imageError}</span>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Select Category</h3>
                <div className="flex flex-wrap gap-4 border-b pb-8 text-sm text-gray-600">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register('category')}
                      value="KIMATAIFA"
                      className="mr-2"
                    />
                    <span>KIMATAIFA</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register('category')}
                      value="AFYA"
                      className="mr-2"
                    />
                    <span>AFYA</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register('category')}
                      value="TEHAMA"
                      className="mr-2"
                    />
                    <span>TEHAMA</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register('category')}
                      value="AJIRA"
                      className="mr-2"
                    />
                    <span>AJIRA</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register('category')}
                      value="BURUDANI"
                      className="mr-2"
                    />
                    <span>BURUDANI</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register('category')}
                      value="MICHEZO"
                      className="mr-2"
                    />
                    <span>MICHEZO</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 text-sm text-gray-600">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isPublic')}
                    className="mr-2"
                  />
                  <span>Make Public</span>
                </label>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-800 text-white text-sm font-bold py-2.5 px-5 rounded-sm transition disabled:opacity-50"
                >
                  {loading ? 'Creating article...' : 'Create Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
