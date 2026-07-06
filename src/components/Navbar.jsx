"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 h-16 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/logo/logo.png" 
            alt="BCS Spark Logo" 
            className="h-20 w-auto object-contain"
          />
        </Link>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="BCS টুল খুঁজুন..."
              className="w-full rounded-full border border-transparent bg-[#f0f4f8] py-2 pl-6 pr-12 text-sm text-primary placeholder-gray-500 transition-all focus:border-primary/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105 active:scale-95">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right: Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/login" 
            className="rounded-full border border-primary px-6 py-1.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="rounded-full bg-accent px-6 py-1.5 text-sm font-semibold text-primary transition-all hover:bg-accent-dark"
          >
            Register
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-primary hover:bg-gray-100 focus:outline-none"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white px-4 pt-2 pb-4 shadow-lg transition-all animate-in slide-in-from-top duration-250">
          <div className="space-y-4">
            {/* Search Bar Mobile */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="BCS টুল খুঁজুন..."
                className="w-full rounded-full border border-transparent bg-[#f0f4f8] py-2.5 pl-6 pr-12 text-sm text-primary placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <Search className="h-4 w-4" />
              </button>
            </div>
            {/* Buttons Mobile */}
            <div className="flex flex-col gap-2 pt-2">
              <Link 
                href="/login" 
                className="flex w-full justify-center rounded-lg border border-primary py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="flex w-full justify-center rounded-lg bg-accent py-2.5 text-sm font-semibold text-primary transition-all hover:bg-accent-dark"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
