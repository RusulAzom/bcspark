// src/app/admin/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Determine active nav item from path
  let activeItem = "dashboard";
  if (pathname.includes("/admin/categories")) {
    activeItem = "categories";
  } else if (pathname.includes("/admin/blog")) {
    activeItem = "blogs";
  }

  // Redirect non-admins
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    } else if (role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, loading, role, router]);

  const handleNavigate = (id: string) => {
    if (id === "blogs") {
      router.push("/admin/blog");
    } else if (id === "categories") {
      router.push("/admin/categories");
    } else {
      // If clicking home dashboard/circulars/solutions, redirect back to primary dashboard page
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeItem}
        onNavigate={handleNavigate}
        role={role}
      />
      <div className="lg:ml-[260px] flex flex-col min-h-screen">
        <Topbar
          title="অ্যাডমিন প্যানেল"
          onMenuClick={() => setSidebarOpen(true)}
          backHref="/dashboard"
        />
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
