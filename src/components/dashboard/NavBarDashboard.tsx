"use client"

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SignOutButton from '../SignOutButton';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


export default function NavBarDashboard() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const router = useRouter()

  return (
      <div>
          <div className="flex justify-end gap-4 md:gap-0 md:justify-between  items-center h-14 px-4 md:px-8 bg-white shadow-xs border-b w-full z-50 transition-all">
              <div className="flex items-center space-x-2 md:space-x-4">
                  <h1 className="text-xs md:text-sm font-bold text-gray-700 capitalize">
                      {/* {pathname.replace('/', '')} */}
                        {pathname.split('/')[2] ? pathname.split('/')[2].replace(/-/g, ' ') : 'Dashboard'}
                  </h1>
              </div>
              <div className="flex items-center space-x-2 md:space-x-6">
                  <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="text-right hidden sm:block">
                          <p className="text-xs md:text-sm font-medium text-gray-700">
                              {session?.user?.name?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </p>
                      </div>
                      <Popover>
                          <PopoverTrigger>
                              <Avatar className="h-6 w-6 md:h-7 md:w-7 cursor-pointer hover:opacity-80 border border-red-600/50">
                                  <AvatarImage src={session?.user?.image || "/avatar.webp"} alt="Profile" />
                                  <AvatarFallback>
                                      {session?.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                  </AvatarFallback>
                              </Avatar>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 md:w-56">
                              <div className="flex flex-col space-y-1 md:space-y-2">
                                
                                <div className='border-b flex items-center gap-1 pb-2'>
                                    <Avatar className="h-6 w-6 md:h-7 md:w-7 hover:opacity-80 border border-red-600/50">
                                        <AvatarImage src={session?.user?.image || "/avatar.webp"} alt="Profile" />
                                        <AvatarFallback>
                                        {session?.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <p className="text-[10px] md:text-xs text-gray-700 ">
                                            {session?.user?.email}
                                        </p>
                                    </div>
                                  </div>
                                  <button
                                    
                                    className="w-full justify-start text-xs md:text-sm hover:text-red-600 cursor-pointer flex items-center gap-2"
                                    onClick={() => router.push(`/dashboard/myaccount`)}
                                  >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                      My Account
                                  </button>
                                  <button
                                    className="w-full justify-start text-xs md:text-sm hover:text-red-600 cursor-pointer flex items-center gap-2"
                                    onClick={() => router.push('/dashboard/settings')}
                                  >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                      Settings
                                  </button>
                                  {/* <Button variant="ghost" className="w-full justify-start text-xs md:text-sm hover:text-red-600">
                                      Change Picture
                                  </Button> */}
                                  <hr className="my-1 md:my-2" />
                                  <SignOutButton className="w-full cursor-pointer text-xs md:text-sm hover:text-red-600" />
                              </div>
                          </PopoverContent>
                      </Popover>
                  </div>
              </div>
          </div>
      </div>
  )
}
