"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Calendar, Target, Wallet } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Stats {
  articles: {
    current: number
    previous: number
    percentChange: string
  }
  subscribers: {
    current: number
    previous: number
    percentChange: string
  }
  views: {
    current: number
    previous: number
    percentChange: string
  }
  comments: {
    current: number
    previous: number
    percentChange: number
  }
}

interface ArticleTrend {
  name: string
  views: number
}

interface CategoryDistribution {
  name: string
  value: number
}

interface TopUser {
  name: string
  articles: number
  views: number
}

interface DashboardData {
  stats: Stats
  articleTrend: ArticleTrend[]
  categoryDistribution: CategoryDistribution[]
  topUsers: TopUser[]
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)
  const COLORS = ['#dc2626', '#facc15', '#16a34a', '#2563eb', '#9333ea', '#ec4899']

  useEffect(() => {
    const fakeData: DashboardData = {
      stats: {
        articles: {
          current: 2456,
          previous: 2100,
          percentChange: "16.9"
        },
        subscribers: {
          current: 15780,
          previous: 12500,
          percentChange: "26.2"
        },
        views: {
          current: 8900,
          previous: 7500,
          percentChange: "18.7"
        },
        comments: {
          current: 45600,
          previous: 38000,
          percentChange: 20.0
        }
      },
      articleTrend: [
        { name: "Mon", views: 3000 },
        { name: "Tue", views: 30000 },
        { name: "Wed", views: 38000 },
        { name: "Thu", views: 22000 },
        { name: "Fri", views: 41000 },
        { name: "Sat", views: 30000 },
        { name: "Sun", views: 60000 }
      ],
      categoryDistribution: [
        { name: "KIMATAIFA", value: 20 },
        { name: "AFYA", value: 15 },
        { name: "TEHAMA", value: 25 },
        { name: "AJIRA", value: 15 },
        { name: "BURUDANI", value: 15 },
        { name: "MICHEZO", value: 10 }
      ],
      topUsers: [
        { name: "Sarah Johnson", articles: 156, views: 985000 },
        { name: "Michael Chen", articles: 142, views: 876000 },
        { name: "Emily Williams", articles: 128, views: 754000 },
        { name: "David Rodriguez", articles: 115, views: 689000 },
        { name: "Lisa Thompson", articles: 98, views: 567000 },
      ]
    }

    setTimeout(() => {
      setData(fakeData)
      setLoading(false)
    }, 1000)
  }, [])

  const statsConfig = data ? [
    {
      label: "Articles",
      value: data.stats.articles.current.toString(),
      color: "#3b82f6",
      percent: data.stats.articles.percentChange,
      icon: Target,
    },
    {
      label: "Subscribers",
      value: data.stats.subscribers.current.toString(),
      color: "#22c55e",
      percent: data.stats.subscribers.percentChange,
      icon: Calendar,
    },
    {
      label: "Views",
      value: data.stats.views.current.toString(),
      color: "#ef4444",
      percent: data.stats.views.percentChange,
      icon: FileText,
    },
    {
      label: "Comments",
      value: `${(data.stats.comments.current.toLocaleString())}`,
      color: "#22c55e",
      percent: data.stats.comments.percentChange,
      icon: Wallet,
    },
  ] : []

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-2 md:p-4 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-4 md:mb-6">
          {loading ? (
            Array(4).fill(0).map((_, index) => (
              <Card key={index} className="shadow-xs hover:shadow-sm rounded-sm">
                <CardContent className="px-2 md:px-3 py-2 md:py-3">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-3 md:h-4 w-[80px] md:w-[100px]" />
                      <div className="mt-1 mb-1 flex justify-between">
                        <Skeleton className="h-3 md:h-4 w-[50px] md:w-[60px]" />
                        <Skeleton className="h-3 md:h-4 w-[30px] md:w-[40px]" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            statsConfig.map((stat, index) => (
              <Card key={index} className="shadow-xs hover:shadow-sm rounded-sm">
                <CardContent className="px-2 md:px-3 py-2 md:py-0">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 md:p-2 rounded-full bg-opacity-20`} style={{ backgroundColor: `${stat.color}20` }}>
                      <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-gray-700" strokeWidth={1}/>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[0.65rem] md:text-[0.7rem] font-semibold text-gray-600 uppercase">{stat.label}</h3>
                      <div className="mt-1 mb-1 flex justify-between">
                        <span className="text-xs md:text-sm font-bold" style={{ color: stat.color }}>{stat.value}</span>
                        <span className="inline-flex items-center px-1 py-0.5 rounded-full text-[0.65rem] md:text-[0.7rem] font-medium bg-green-100 text-green-800">
                          ↑ {stat.percent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
          <Card className="col-span-2 shadow-xs hover:shadow-sm rounded-sm">
            <CardHeader className="border-b border-gray-100 p-3 md:p-4 md:py-0">
              <CardTitle className="text-xs md:text-sm font-bold uppercase">Article Views Trend</CardTitle>
              <p className="text-[0.65rem] md:text-xs text-gray-500">Overview of article views over time</p>
            </CardHeader>
            <CardContent className="p-2 md:p-4">
              <div className="h-[200px] md:h-[250px]">
                {loading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.articleTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="views" stroke="#3b82f6" fill="#93c5fd" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xs hover:shadow-sm rounded-sm">
            <CardHeader className="border-b border-gray-100 p-3 md:p-4 md:py-0">
              <CardTitle className="text-xs md:text-sm font-bold uppercase">Category Distribution</CardTitle>
              <p className="text-[0.65rem] md:text-xs text-gray-500">Distribution of articles by category</p>
            </CardHeader>
            <CardContent className="p-2 md:p-4">
              <div className="h-[200px] md:h-[230px]">
                {loading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.categoryDistribution}
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {data?.categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                      contentStyle={{ 
                                    backgroundColor: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    fontSize: '0.75rem'
                                }} />
                      <Legend
                    //   iconType='plainline'
                      wrapperStyle={{
                        fontSize: '9px',
                        border: 'none',
                        borderRadius: '8px',
                        }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>


          <Card className="shadow-xs hover:shadow-sm rounded-sm">
          <CardHeader className="border-b border-gray-100 p-3 md:p-4 md:py-0">
            <CardTitle className="text-xs md:text-sm font-bold uppercase">Recent Subscribers</CardTitle>
            <p className="text-[0.65rem] md:text-xs text-gray-500 ">Recent Subscribers on the platform</p>
          </CardHeader>
          <CardContent className="p-2 md:p-4 md:py-0">
            <div className="bg-white rounded-sm border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">#</TableHead>
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">User</TableHead>
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">Articles</TableHead>
                    <TableHead className="font-bold text-gray-800 text-[0.65rem] md:text-xs">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell><Skeleton className="h-3 md:h-4 w-3 md:w-4" /></TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <Skeleton className="h-6 w-6 md:h-8 md:w-8 rounded-full" />
                            <Skeleton className="h-3 md:h-4 w-[120px] md:w-[150px]" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-3 md:h-4 w-[60px] md:w-[80px]" /></TableCell>
                        <TableCell><Skeleton className="h-3 md:h-4 w-[80px] md:w-[100px]" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    data?.topUsers.map((user, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="text-[0.65rem] md:text-xs">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <Avatar className="h-6 w-6 md:h-8 md:w-8">
                              <AvatarImage src={`/avatar.webp`} />
                              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-xs md:text-sm font-medium">{user.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[0.65rem] md:text-xs">{user.articles}</TableCell>
                        <TableCell className="text-[0.65rem] md:text-xs">{user.views.toLocaleString()}</TableCell>
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
    </div>
  )
}
