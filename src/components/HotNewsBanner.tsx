"use client"
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Flame } from 'lucide-react';
import Link from 'next/link';

export default function HotNewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sample hot news data - replace with your actual news data
  const hotNews = [
    {
      id: 1,
      title: "Rais Samia azindua mradi wa barabara ya kimataifa",
      category: "SIASA",
      time: "2 masaa yaliyopita"
    },
    {
      id: 2,
      title: "Simba SC waichapa Yanga SC 2-1 katika mchezo wa derby",
      category: "MICHEZO",
      time: "4 masaa yaliyopita"
    },
    {
      id: 3,
      title: "Bei ya mafuta yapanda kwa asilimia 15 nchini",
      category: "UCHUMI",
      time: "6 masaa yaliyopita"
    },
    {
      id: 4,
      title: "Mfumo wa afya wa Tanzania unapokea msaada wa dola milioni 50",
      category: "HABARI",
      time: "8 masaa yaliyopita"
    },
    {
      id: 5,
      title: "Mvua kubwa yasababisha mafuriko Dar es Salaam",
      category: "MAZINGIRA",
      time: "10 masaa yaliyopita"
    }
  ];

  // Auto-rotate news kila baada ya 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % hotNews.length);
      setIsAnimating(false);
    }, 200);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + hotNews.length) % hotNews.length);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto pr-4 sm:pr-6 bg-gray-100 text-gray-900 border-y border-gray-900 overflow-hidden">
        <div className="flex items-center">
          
          {/* Hot News Label */}
          <div className="flex items-center space-x-2 bg-black px-3 py-2 mr-4 flex-shrink-0">
            <Flame className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span className="text-sm  text-gray-50">Hot News</span>
          </div>

          {/* News Content */}
          <div className="flex-1 overflow-hidden">
            <div 
              className={`transition-all duration-300 transform ${
                isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* News Title */}
                <Link href={`/habari/${hotNews[currentIndex].id}`} className="hover:text-blue-600">
                  <h3 className="text-xs md:text-sm font-medium text-gray-900 truncate">
                    {hotNews[currentIndex].title}
                  </h3>
                </Link>
                
              </div>
            </div>
          </div>

          {/*Juu & chini btn  Navigation Controls */}
          <div className="flex ml-4 flex-shrink-0">
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              className="p-1 text-gray-800 hover:text-gray-900 hover:bg-gray-200 rounded transition-all duration-200 disabled:opacity-50 cursor-pointer"
              aria-label="Previous news"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="p-1 text-gray-800 hover:text-gray-900 hover:bg-gray-200 rounded transition-all duration-200 disabled:opacity-50 cursor-pointer"
              aria-label="Next news"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}