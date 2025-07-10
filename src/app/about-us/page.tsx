import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-4">About Us</h1>
        <p className="text-white/80 mb-8 max-w-2xl mx-auto font-mono">
          Newsfy is an innovative final year IT project focused on creating a modern news aggregation and management platform. Our mission is to demonstrate the practical application of web technologies in delivering a seamless news experience.
        </p>
        <svg className="w-64 h-12 mx-auto mb-6" viewBox="0 0 400 50">
          <path
            d="M10 25 C 50 10, 100 40, 150 25 C 200 10, 250 40, 300 25 C 350 10, 400 40, 450 25"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-shadow-blue-600 rounded-md hover:text-blue-500/50 hover:underline transition-colors duration-300"
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  )
}
