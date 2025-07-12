'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { User } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import ImageUpload from '@/components/ImageUpload'
import Image from "next/image"
import { DialogTitle } from '@radix-ui/react-dialog'

export default function ManagersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string>('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'MANAGER',
    image: '',
    istempPassword: false,
    temporaryPassword: null,
    temporaryPasswordExpires: null,
    emailVerified: null
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user')
      if (response.status === 401) {
        setError('You must be logged in to view this page')
        return
      }
      if (response.status === 403) {
        setError('You must be an admin to view this page')
        return
      }
      const data = await response.json()
      if (response.ok) {
        setUsers(data)
        setError('')
      } else {
        setError(data.error || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsOpen(false)
        fetchUsers()
        setFormData({
          name: '',
          email: '',
          password: '',
          userType: 'MANAGER',
          image: '',
          istempPassword: false,
          temporaryPassword: null,
          temporaryPasswordExpires: null,
          emailVerified: null
        })
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('Failed to create:', error)
      setError('Failed to create user')
    }
  }

  const handleUpdate = async () => {
    try {
      const updateData = {
        id: selectedUser?.id,
        name: formData.name,
        email: formData.email,
        userType: formData.userType,
        image: formData.image,
        istempPassword: formData.istempPassword,
        temporaryPassword: formData.temporaryPassword,
        temporaryPasswordExpires: formData.temporaryPasswordExpires,
        emailVerified: formData.emailVerified
      }

      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        setIsOpen(false)
        fetchUsers()
        setSelectedUser(null)
        setFormData({
          name: '',
          email: '',
          password: '',
          userType: 'MANAGER',
          image: '',
          istempPassword: false,
          temporaryPassword: null,
          temporaryPasswordExpires: null,
          emailVerified: null
        })
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Failed to update:', error)
      setError('Failed to update user')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedUser) {
      await handleUpdate()
    } else {
      await handleCreate()
    }
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name || '',
      email: user.email,
      password: '',
      userType: user.userType,
      image: user.image || '',
      istempPassword: user.istempPassword,
      temporaryPassword: null,
      temporaryPasswordExpires: null,
      emailVerified: null
    })
    setIsOpen(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const response = await fetch(`/api/user?id=${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchUsers()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      setError('Failed to delete user')
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-2 md:p-4 lg:p-6">
        <Card className="shadow-none hover:shadow-sm rounded-md ">
          <CardHeader className="border-b border-gray-100 p-3 md:p-4 md:py-0">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xs md:text-sm font-bold uppercase">Manage Users</CardTitle>
                <p className="text-[0.65rem] md:text-xs text-gray-500">Manage system users and their roles</p>
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setSelectedUser(null)
                    setFormData({
                      name: '',
                      email: '',
                      password: '',
                      userType: 'MANAGER',
                      image: '',
                      istempPassword: false,
                      temporaryPassword: null,
                      temporaryPasswordExpires: null,
                      emailVerified: null
                    })
                  }}>
                    Add New User
                  </Button>
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
                      {selectedUser ? 'Edit' : 'Add New'} <span className="text-red-600">User</span>
                    </h2>
                    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 text-gray-900">
                      <div className="mb-4">
                        <ImageUpload
                          onUploadSuccess={(result) => setFormData({ ...formData, image: result.url })}
                          initialImageUrl={formData.image}
                        />
                      </div>
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
                      {!selectedUser && (
                        <div>
                          <Input
                            type="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                          />
                        </div>
                      )}
                      <div>
                        <Select
                          value={formData.userType}
                          onValueChange={(value) => setFormData({ ...formData, userType: value })}
                        >
                          <SelectTrigger className="w-full px-3 py-3 text-sm rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400">
                            <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MANAGER">Manager</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        type="submit"
                        className="bg-red-600 hover:bg-red-800 text-white text-sm font-bold py-2.5 px-5 rounded-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {selectedUser ? 'Update User' : 'Create User'}
                      </Button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-2 md:p-4 md:py-0 ">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="bg-white rounded-sm border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">User</TableHead>
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">Email</TableHead>
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">User Type</TableHead>
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">Created At</TableHead>
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">Updated At</TableHead>
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <Skeleton className="h-6 w-6 md:h-8 md:w-8 rounded-full" />
                            <Skeleton className="h-3 md:h-4 w-[120px] md:w-[150px]" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-3 md:h-4 w-[60px] md:w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-3 md:h-4 w-[80px] md:w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-3 md:h-4 w-[80px] md:w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-3 md:h-4 w-[80px] md:w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-3 md:h-4 w-[80px] md:w-[100px]" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <Avatar className="h-6 w-6 md:h-8 md:w-8">
                              <AvatarImage src={user.image || '/avatar.webp'} />
                              <AvatarFallback>{user.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs md:text-sm font-medium">{user.name || 'N/A'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[0.65rem] md:text-xs">{user.email}</TableCell>
                        <TableCell className="text-[0.65rem] md:text-xs">{user.userType}</TableCell>
                        <TableCell className="text-[0.65rem] md:text-xs">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-[0.65rem] md:text-xs">{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                            >
                              Delete
                            </Button>
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
