"use client"
import React, { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function NewsNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'HOME', href: '/' },
    { name: 'KIMATAIFA', href: '/kimataifa' },
    { name: 'AFYA', href: '/afya' },
    { name: 'TEHAMA', href: '/tehama' },
    { name: 'AJIRA', href: '/ajira' },
    { name: 'BURUDANI', href: '/burudani' },
    { name: 'MICHEZO', href: '/michezo' },
    // { name: 'MAKALA', href: '/makala' },
    { name: 'ABOUT US', href: '/about-us' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
 if (pathname.startsWith("/dashboard")) return

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-lg backdrop-blur-sm'
        : 'bg-gradient-to-r from-red-600 via-red-500 to-red-600'
    }`}>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="text-white font-bold text-sm bg-black/80 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10 hover:bg-opacity-30 transition-all duration-300 shadow-sm">
              <span className="text-base font-extrabold tracking-tight">N<span className="text-red-600">.</span></span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-0.5">
              {navItems.map((item, index) => (
                <div key={index} className="relative group">
                  <Link
                    href={item.href}
                    className={`flex items-center px-2 py-1.5 rounded-md text-xs cursor-pointer font-medium transition-all duration-300 ${
                      pathname === item.href
                        ? 'text-yellow-500 font-black' 
                        : 'text-white hover:text-yellow-500 hover:scale-105'
                    }`}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* Search Icon */}
            <button title='Search' className="text-white hover:text-yellow-300 transition-colors duration-200 hidden md:block">
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden inline-flex items-center justify-center p-1.5 rounded-md text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen
          ? 'max-h-screen opacity-100 visible'
          : 'max-h-0 opacity-0 invisible'
      }`}>
        <div className="bg-gradient-to-b from-red-600 to-red-700 border-t border-red-400 border-opacity-30">
          <div className="px-3 py-4 space-y-1.5">
            {navItems.map((item, index) => (
              <div key={index}>
                <Link
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? 'text-yellow-500 font-black'
                      : 'text-white hover:text-yellow-500'
                  }`}
                >
                  {item.name}
                </Link>
              </div>
            ))}
            
            {/* Mobile Search */}
            <div className="pt-3 border-t border-red-400 border-opacity-30">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md">
                <Search className="w-4 h-4 text-white" />
                <input
                  type="text"
                  placeholder="Search news..."
                  className="bg-transparent text-white placeholder-red-200 text-sm flex-1 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated underline for active states */}
      <style jsx>{`
        .marquee-text {
          animation: marquee 20s linear infinite;
        }
        
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </nav>
  );
}