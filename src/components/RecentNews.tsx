"use client"

import React, { useState, useEffect } from 'react'
import NewsCardComp from './NewCard'
import PopularSideBar from './PopularSideBar'
import HotNewsTicker from './HotNewsBanner'

export default function RecentNews() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const recentNews = [
    {id: '1', day: '1', month: '1', title: 'Tanzania yafuzu Afcon 2024 baada ya miaka 39', image: '/img.webp', pageName: 'habari'},
    {id: '2', day: '2', month: '1', title: 'Serikali yatoa maelekezo mapya kuhusu usajili wa simu', image: '/img.webp', pageName: 'habari'},
    {id: '3', day: '3', month: '1', title: 'Rais Samia azindua mradi mkubwa wa maji Dar', image: '/img.webp', pageName: 'habari'},
    {id: '4', day: '4', month: '1', title: 'Simba watwaa ubingwa wa ligi kuu Tanzania', image: '/img.webp', pageName: 'habari'},
    {id: '5', day: '5', month: '1', title: 'Benki kuu yatoa mwelekeo mpya wa uchumi', image: '/img.webp', pageName: 'habari'},
    {id: '6', day: '6', month: '1', title: 'Wakulima waanza kunufaika na mradi wa kilimo', image: '/img.webp', pageName: 'habari'},
    {id: '7', day: '7', month: '1', title: 'Sekta ya utalii yaongeza mapato ya taifa', image: '/img.webp', pageName: 'habari'},
    {id: '8', day: '8', month: '1', title: 'Vijana watakiwa kutumia fursa za mikopo', image: '/img.webp', pageName: 'habari'},
  ]

  const popularNews = [
    {title: 'Yanga Yaanza Mazungumzo na Dickson Job Kuhusu Mkataba Mpya', image: '/d.webp'},
    {title: 'Mabadiliko ya hali ya hewa yaathiri kilimo', image: '/img.webp'},
    {title: 'Timu ya Taifa yapanda nafasi FIFA', image: '/d.webp'},
  ]

  return (
    <div className="container mx-auto px-4 py-8 pt-21 md:pl-7">
      <div className="flex flex-col lg:flex-row gap-8 ">
        <div className="lg:w-3/4">
        <HotNewsTicker />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ">
            <div className="md:col-span-2">
              <NewsCardComp
                key={recentNews[0].id}
                id={recentNews[0].id}
                day={recentNews[0].day}
                month={recentNews[0].month}
                title={recentNews[0].title}
                image={recentNews[0].image}
                pageName={recentNews[0].pageName}
                isFirst={true}
              />
            </div>
            <div className="md:col-span-1">
              <NewsCardComp
                key={recentNews[1].id}
                id={recentNews[1].id}
                day={recentNews[1].day}
                month={recentNews[1].month}
                title={recentNews[1].title}
                image={recentNews[1].image}
                pageName={recentNews[1].pageName}
                isFirst={false}
              />
            </div>
            
            {recentNews.slice(2, isMobile ? 4 : recentNews.length).map((news) => (
              <NewsCardComp
                key={news.id}
                id={news.id}
                day={news.day}
                month={news.month}
                title={news.title}
                image={news.image}
                pageName={news.pageName}
                isFirst={false}
              />
            ))}
          </div>
          <div className="flex justify-center items-center space-x-2 mt-4 text-gray-800 ">
            <button className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-red-600 hover:text-gray-100 transition-colors" title="Previous">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div className="flex space-x-1">
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors" title="Page 1">1</button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-red-600 hover:text-gray-100 transition-colors" title="Page 2">2</button>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-red-600 hover:text-gray-100 transition-colors" title="Page 3">3</button>
              
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-sm hover:bg-red-600 hover:text-gray-100 transition-colors" title="Next">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
       {/* Popular newz Kulia box */}
       <PopularSideBar popularNews={popularNews} />
      </div>
    </div>
  )
}
