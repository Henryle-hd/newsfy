"use client"
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Flame } from 'lucide-react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  createdAt: string;
  views: number;
  likes: number;
  comment: Comment[];
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

export default function HotNewsTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hotNews, setHotNews] = useState<Article[]>([]);

  const handleNext = () => {
    if (isAnimating || !hotNews.length) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % hotNews.length);
      setIsAnimating(false);
    }, 200);
  };

  const handlePrev = () => {
    if (isAnimating || !hotNews.length) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + hotNews.length) % hotNews.length);
      setIsAnimating(false);
    }, 200);
  };

  useEffect(() => {
    const fetchHotNews = async () => {
      try {
        const response = await fetch('/api/hotnews');
        const data = await response.json();
        setHotNews(data);
      } catch (error) {
        console.error('Error fetching hot news:', error);
      }
    };
    fetchHotNews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [handleNext]);

  if (!hotNews.length) return null;

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
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{hotNews[currentIndex].category}</span>
                  <span>•</span>
                  <span>{new Date(hotNews[currentIndex].createdAt).toLocaleTimeString()}</span>
                  <span>•</span>
                  <span>{hotNews[currentIndex].views} views</span>
                </div>
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