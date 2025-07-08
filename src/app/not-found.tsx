import React from 'react'
import Link from 'next/link'

export default function Notfound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-2">Developer working on ....</h2>
        <p className="text-white/80 mb-8 max-w-xs mx-auto font-mono ">
          Samahani, ukurasa unautafuta haupo. Inawezekana umehamishwa au kufutwa.
        </p>
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
          Rudi Nyumbani
        </Link>
      </div>
    </div>
  )
}
