"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PlusCircle,
  FileCheck,
  Brain,
  BookOpenText,
  BellRing,
  Image,
  FileText,
  BookOpen,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: string;
  onNavigate: (item: string) => void;
}

const sidebarVariants = {
  open: { x: 0 },
  closed: { x: "-100%" },
};

export default function Sidebar({ isOpen, onClose, activeItem, onNavigate }: SidebarProps) {
  const { user, role, loading, signOut } = useAuth();
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "MAIN" },
    { id: "add-question", label: "Add Question", icon: PlusCircle, section: "CONTENT" },
    { id: "model-test", label: "Model Test", icon: FileCheck, section: "CONTENT" },
    { id: "psychology-test", label: "Psychology Test", icon: Brain, section: "CONTENT" },
    { id: "vocabulary-story", label: "Vocabulary Story", icon: BookOpenText, section: "CONTENT" },
    { id: "new-popup", label: "New Popup", icon: BellRing, section: "CONTENT" },
    { id: "slider", label: "Slider", icon: Image, section: "CONTENT" },
    ...(role === "admin"
      ? [
          { id: "bulk-job-upload", label: "Bulk Job Upload", icon: FileText, section: "ADMIN ONLY" },
          { id: "recent-job-solution", label: "Recent Job Solution", icon: BookOpen, section: "ADMIN ONLY" },
        ]
      : []),
  ];

  const isVisible = isDesktop || isOpen;

  return (
    <>
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={isVisible ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-[260px] bg-white border-r border-gray-200 z-50 flex flex-col"
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-lg font-bold text-gray-900">Menu</span>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-6 py-5 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            JP
          </div>
          <span className="text-lg font-bold text-gray-900">JobsPortal</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {["MAIN", "CONTENT", "ADMIN ONLY"].map((section) => {
            const items = navItems.filter((item) => item.section === section);
            if (items.length === 0) return null;
            return (
              <div key={section}>
                <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section}
                </h3>
                <ul className="space-y-1">
                  {items.map((item) => {
                    const isActive = activeItem === item.id;
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            onNavigate(item.id);
                            if (onClose) onClose();
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                            isActive
                              ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                          {item.label}
                        </motion.button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 relative group">
          {loading ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-2.5 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="absolute left-0 right-0 bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </motion.button>
              </div>
            </>
          )}
        </div>
      </motion.aside>
    </>
  );
}
