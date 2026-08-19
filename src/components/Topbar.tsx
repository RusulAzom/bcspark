"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown, Menu } from "lucide-react";

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

export default function Topbar({ title, onMenuClick }: TopbarProps) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        <div className="relative" ref={dropdownRef}>
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="hidden sm:block space-y-2">
                <div className="h-3.5 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-2.5 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.displayName || "User"}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1"
                  >
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        router.push("/profile");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
