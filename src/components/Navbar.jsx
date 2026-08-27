"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Standard menu links shown between the search input and the user profile
  // area. Rendered as clean, modern text links — pill styling is reserved for
  // the Search Bar and the User Profile Dropdown only.
  const navLinks = [
    { href: "/question-bank", label: "Question Bank" },
    { href: "/study", label: "কুইক রিভিশন" },
    { href: "/central-model-tests", label: "Model Tests" },
    { href: "/job-circular", label: "Job Circular" },
    { href: "/job-solution", label: "Job Solution" },
  ];

  const isActiveLink = (href) => pathname === href || pathname.startsWith(`${href}/`);

  const navLinkBase =
    "text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors px-3 py-2 rounded-md hover:bg-slate-100/60 whitespace-nowrap";

  const navLinkActive =
    "text-blue-600 font-semibold bg-blue-50/70 px-3 py-2 rounded-md whitespace-nowrap";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setDropdownOpen(false);
    router.push("/login");
  };

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
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {navLinks.map(({ href, label }) => {
            const isActive = isActiveLink(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={isActive ? navLinkActive : navLinkBase}
              >
                {label}
              </Link>
            );
          })}

          {loading ? (
            <div className="h-9 w-24 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 transition-colors hover:bg-gray-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="hidden lg:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                  {user.email}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-100 py-1"
                  >
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/dashboard");
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-primary transition-all hover:bg-accent-dark whitespace-nowrap"
            >
              Login/Register
            </Link>
          )}
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
            {/* Menu links Mobile — clean text links mirroring desktop */}
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map(({ href, label }) => {
                const isActive = isActiveLink(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={
                      isActive
                        ? "block w-full text-left text-blue-600 font-semibold bg-blue-50/70 px-3 py-2 text-sm rounded-md"
                        : "block w-full text-left text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 px-3 py-2 text-sm font-medium rounded-md transition-colors"
                    }
                  >
                    {label}
                  </Link>
                );
              })}
              
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push("/dashboard");
                    }}
                    className="block w-full text-left text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 px-3 py-2 text-sm font-medium rounded-md transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left text-red-600 hover:bg-red-50 px-3 py-2 text-sm font-medium rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-left text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 px-3 py-2 text-sm font-medium rounded-md transition-colors"
                >
                  Login/Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
