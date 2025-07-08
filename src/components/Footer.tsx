import React from 'react';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

export default function NewsfyFooter() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          {/* Left Section - Copyright */}
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>© Copyright {new Date().getFullYear()} </span>
            <span className="hidden md:inline">|</span>
            <span className="text-gray-300">Newsfy</span>
          </div>

          {/* Center Section - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="text-white font-bold text-sm bg-black bg-opacity-20 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10 hover:bg-opacity-30 transition-all duration-300 shadow-sm">
              <span className="text-base font-extrabold tracking-tight">NEWSFY<span className="text-yellow-400">.</span></span>
            </div>
          </div>

          {/* Right Section - Social Media & Links */}
          <div className="flex items-center space-x-4 text-sm">
            {/* Social Media Icons */}
            <div className="flex items-center space-x-3">
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200 hover:scale-110 transform"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200 hover:scale-110 transform"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-red-400 transition-colors duration-200 hover:scale-110 transform"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-pink-400 transition-colors duration-200 hover:scale-110 transform"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-600 hidden md:block"></div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4 text-gray-300">
              <a href="#" className="hover:text-white transition-colors duration-200">
                About Newsfy.
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}