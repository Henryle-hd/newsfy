'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { SearchFilters } from '@/components/SearchFilters'

interface Subscriber {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [error, setError] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subscriberToDelete, setSubscriberToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subscriber')
      if (response.status === 401) {
        setError('You must be logged in to view this page')
        return
      }
      const data = await response.json()
      if (response.ok) {
        setSubscribers(data)
        setError('')
      } else {
        setError(data.error || 'Failed to fetch subscribers')
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error)
      setError('Failed to fetch subscribers')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/subscriber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsOpen(false)
        fetchSubscribers()
        setFormData({ name: '', email: '' })
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create subscriber')
      }
    } catch (error) {
      console.error('Failed to create:', error)
      setError('Failed to create subscriber')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleCreate()
  }

  const handleDelete = async (subscriberId: string) => {
    try {
      const response = await fetch(`/api/subscriber?id=${subscriberId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchSubscribers()
        setDeleteDialogOpen(false)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete subscriber')
      }
    } catch (error) {
      console.error('Failed to delete subscriber:', error)
      setError('Failed to delete subscriber')
    }
  }

  const filterOptions = [
    { value: 'ALL', label: 'All' },
    { value: 'RECENT', label: 'Recent' },
    { value: 'OLD', label: 'Old' }
  ]

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (typeFilter === 'ALL') return matchesSearch
    if (typeFilter === 'RECENT') return matchesSearch && new Date(subscriber.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    if (typeFilter === 'OLD') return matchesSearch && new Date(subscriber.createdAt) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    return matchesSearch
  })

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-2 md:p-4 lg:p-6">
        <Card className="shadow-none hover:shadow-sm rounded-md">
          <CardHeader className="border-b border-gray-100 p-3 md:p-4 md:py-0">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xs md:text-sm font-bold uppercase">Manage Subscribers</CardTitle>
                <p className="text-[0.65rem] md:text-xs text-gray-500">Manage newsletter subscribers</p>
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button>Add New Subscriber</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogTitle className='p-0 m-0'></DialogTitle>
                  <div className="w-full flex flex-col justify-center p-2">
                    <div className="flex items-center mb-4">
                      <Image 
                        width={1000}
                        height={1000}
                        src="/logo.webp" 
                        alt="Logo" 
                        className="w-6 h-6 mr-2 rounded-full" 
                      />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Add New <span className="text-red-600">Subscriber</span>
                    </h2>
                    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 text-gray-900">
                      <div>
                        <Input
                          placeholder="Enter name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                      </div>
                      <div>
                        <Input
                          type="email"
                          placeholder="Enter email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                      </div>
                      <Button 
                        type="submit"
                        className="bg-red-600 hover:bg-red-800 text-white text-sm font-bold py-2.5 px-5 rounded-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        Create Subscriber
                      </Button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-2 md:p-4 md:py-0">
            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              placeholder="Search subscribers..."
              filterOptions={filterOptions}
            />

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="bg-white rounded-sm border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">Name</TableHead>
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">Email</TableHead>
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">Created At</TableHead>
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">Updated At</TableHead>
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-3 md:h-4 w-[120px] md:w-[150px]" /></TableCell>
                        <TableCell><Skeleton className="h-3 md:h-4 w-[150px] md:w-[200px]" /></TableCell>
                        <TableCell><Skeleton className="h-3 md:h-4 w-[80px] md:w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-3 md:h-4 w-[80px] md:w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-3 md:h-4 w-[80px] md:w-[100px]" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredSubscribers.map((subscriber) => (
                      <TableRow key={subscriber.id} className="hover:bg-gray-50">
                        <TableCell className="text-[0.65rem] md:text-xs">{subscriber.name}</TableCell>
                        <TableCell className="text-[0.65rem] md:text-xs">{subscriber.email}</TableCell>
                        <TableCell className="text-[0.65rem] md:text-xs">{new Date(subscriber.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-[0.65rem] md:text-xs">{new Date(subscriber.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setSubscriberToDelete(subscriber.id)}
                                >
                                  Delete
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogTitle>Are you sure?</DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone. This will permanently delete the subscriber.
                                </DialogDescription>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" onClick={() => subscriberToDelete && handleDelete(subscriberToDelete)}>
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
