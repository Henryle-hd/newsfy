"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Home, Users, Menu, X, Globe,User, Box } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from '../ui/scroll-area'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function SideBar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname()
    const router = useRouter()
    const {status } = useSession()

    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push('/auth/signin')
      }
    }, [status, router])

    const menuGroups = [
         {
          title: 'Dashboard',
          items: [
            { icon: Home, label: 'Overview', href: '/dashboard/overview' },
            { icon: Globe, label: 'Articles', href: '/dashboard/articles' },
          ]
        },
          {
            title: 'Management',
            items: [
              // { icon: Bot, label: 'Bot', href: '/dashboard/bot' },
              { icon: User, label: 'My Profile', href: '/dashboard/myprofile' },
              { icon: Box, label: 'Managers', href: '/dashboard/managers' },
            //   { icon: MessageSquare, label: 'Message', href: '/dashboard/contact-message' },
              { icon: Users, label: 'Subscribers', href: '/dashboard/subscribers' },
              // { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
            ]
          }
    ]

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed xl:hidden ${isSidebarOpen?"right-55 top-4 ":"left-4 top-4 "}  z-50 hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 text-2xl`}
      >
        {isSidebarOpen ? <X size={14} className=''/> : <Menu size={14} />}
      </Button>
      <div className={`fixed xl:sticky bottom-0 ${isSidebarOpen ? 'z-40' : '-z-10'} xl:z-0`}>
        <div className={`${isSidebarOpen ? 'w-64' : 'w-0 xl:w-12'} bg-white dark:bg-gray-800 transition-all duration-300 h-screen`}>
          <div className={` ${isSidebarOpen?"p-4":"p-2"} flex items-center justify-between`}>
            {/* logo */}
            {isSidebarOpen &&<div className="flex items-center space-x-2">
              <div className="text-white font-bold text-sm bg-black/80 px-2 py-[0.1em] rounded-sm backdrop-blur-sm border border-white/10 hover:bg-opacity-30 transition-all duration-300 shadow-xs">
                <span className="text-xl font-extrabold tracking-tight">N<span className="text-red-600">.</span></span>
              </div>
               <span className="font-medium text-gray-800 dark:text-gray-200 text-base">Newsfy</span>
            </div>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 xl:block hidden"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-4rem)]">
             <nav className="mt-2 px-1">
              {menuGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-6">
                  {isSidebarOpen && <div className="px-4 py-2 text-sm font-medium text-gray-500">{group.title}</div>}
                  {group.items.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={`flex items-center py-2 ${isSidebarOpen ? "px-4" : "px-2 justify-center"} text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 ${pathname.startsWith(item.href) ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                    >
                      <item.icon size={24} className={pathname === item.href ? 'text-red-600' : ''} strokeWidth={1}/>
                      {isSidebarOpen && <span className="ml-5 font-medium text-sm">{item.label}</span>}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </div>
        </div>
    </div>
  )
}
