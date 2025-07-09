import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ArticleProp{
    id:string;
    day:string;
    month:string;
    title:string;
    image:string;
    pageName:string;
    isFirst:boolean;
}


export default function NewsCardComp({id,day, month, title, image, isFirst=false}: ArticleProp) {
    const months = {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: 'Jun',
        7: 'Jul',
        8: 'Aug',
        9: 'Sep',
        10: 'Oct',
        11: 'Nov',
        12: 'Dec'
    }

  const monthWord = months[Number(month) as keyof typeof months] || month || ''
  const formattedDay = Number(day) < 10 ? `0${day}` : day
  return (
    <Link href={`/habari/${id}`} className={`flex flex-col  `}>
        {/* Image Container */}
        {/* w-[97%] sm:w-[70%] */}
        <div className="relative h-62 overflow-hidden rounded-md mt-5">
        <Image src={image} alt={title} fill className="object-cover"/>
        {/* Date Badge */}1
        <div className={`absolute bottom-4 sm:bottom-2 sm:right-10":"bottom-4 right-4  bg-red-600 text-white px-4 py-3 rounded-md text-center  z-11`}>
            <div className="text-md font-bold leading-none">{formattedDay}</div>
            <div className="text-[12px] font-medium">{monthWord}</div>
        </div>
        </div>
        {/* Content */}
        <div className="px-6 py-6 sm:p-8 sm:pb-6 bg-white rounded-md overflow-hidden hover:shadow-sm transition-shadow duration-300 w-[93%] sm:w-[96%] mx-auto -mt-10 z-10">
        <h3 className={`text-[13px] ${isFirst?"sm:text-[1.4em]":"sm:text-sm"}  font-bold text-gray-900 mb-2 leading-tight line-clamp-3 pb-4  border-b-2 border-gray-200`}>{title}</h3>
        <div className={"text-gray-600 text-[10px] font-semibold flex items-center hover:text-red-600 transition-colors"}>
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.5 3L14 8.5L6.5 14V3z"/>
            </svg>
            SOMA ZAIDI
        </div>
        </div>
    </Link>
  )
}