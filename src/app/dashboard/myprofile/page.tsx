  'use client'
  import { useSession } from "next-auth/react"
  import { useEffect, useState } from "react"
  import Image from "next/image"
  import { User } from "@prisma/client"
  import { Skeleton } from "@/components/ui/skeleton"
  export default function MyProfile() {
    const { data: session } = useSession()
    const [userProfile, setUserProfile] = useState<User & { Article?: { id: string }[] } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`/api/user?id=${session?.user?.id}`)
          if (response.ok) {
            const data = await response.json()
            setUserProfile(data)
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error)
        } finally {
          setLoading(false)
        }
      }

      if (session?.user?.id) {
        fetchUserProfile()
      }
    }, [session])

    if (loading) {
      return (
        <div className="container mx-auto p-4 max-w-7xl">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="relative px-6 py-4">
              <div className="absolute -top-16 left-6">
                <Skeleton className="w-32 h-32 rounded-full" />
              </div>
              <div className="ml-40 mb-4">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
              <div className="border-t mt-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 sm:h-48 bg-gray-300 relative">
            {(
              <Image
                src={"/default-cover.webp"}
                alt="Profile cover"
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Profile Info */}
          <div className="relative px-4 sm:px-6 py-4">
            {/* Profile Picture */}
            <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                {userProfile?.image ? (
                  <Image
                    src={userProfile.image}
                    alt={userProfile.name || "Profile picture"}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src="/avatar.webp"
                    alt="Default profile picture"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="ml-28 sm:ml-40 mb-4">
              <h1 className="text-xl sm:text-2xl font-bold">{userProfile?.name}</h1>
              <p className="text-sm sm:text-base text-gray-600">{userProfile?.email}</p>
              <p className="inline-block px-3 py-1 mt-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 rounded-md">{userProfile?.userType}</p>
            </div>

            {/* Additional Info */}
            <div className="border-t mt-4 sm:mt-6 pt-4 sm:pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold mb-2">Account Information</h2>
                  <p className="text-sm sm:text-base text-gray-600">Member since: {userProfile?.createdAt && new Date(userProfile.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm sm:text-base text-gray-600">Last updated: {userProfile?.updatedAt && new Date(userProfile.updatedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold mb-2">Activity</h2>
                  <p className="text-sm sm:text-base text-gray-600">Articles published: {userProfile?.Article?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
