"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2, Megaphone, Zap, BookOpen, Bot, Brain, MessageCircle, Heart } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

interface CardProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  external?: boolean;
}

function DashboardCard({ title, description, buttonText, href, icon: Icon, iconColor, bgColor, external = false }: CardProps) {
  const router = useRouter();
  const handleClick = () => {
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${bgColor} mb-4`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <button
        onClick={handleClick}
        className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}

export default function StudentDashboard() {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    } else if (role === "admin") {
      router.push("/dashboard");
    }
  }, [user, loading, role, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || role === "admin") {
    return null;
  }

  const cards: CardProps[] = [
    {
      title: "সকল সরকারি চাকরির সর্বশেষ সার্কুলার",
      description: "ডেইলি আপডেট সহ আবেদনের তারিখ, যোগ্যতা ও লিংক",
      buttonText: "সার্কুলার দেখো",
      href: "/job-circular",
      icon: Megaphone,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "একটা ☕কফির দামে প্রজেক্টটা বাঁচিয়ে রাখুন",
      description: "সার্ভার, ডোমেইন এর খরচ। ২০, ৫০, ১২০ টাকা দিয়ে সাপোর্ট করুন",
      buttonText: "এখনই সাপোর্ট করুন",
      href: "https://www.supportkori.com/rasumon",
      icon: Heart,
      iconColor: "text-red-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "T20 কুইজ চ্যালেঞ্জ",
      description: "প্রতিদিন মাত্র ২০টি প্রশ্ন। সেরা ৫ জন পাবে স্পেশাল ব্যাজ",
      buttonText: "কুইজ খেলো",
      href: "/t20",
      icon: Zap,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "প্রশ্ন ব্যাংক ",
      description: "BCS (11-50), NTRCA, স্বাস্থ্য মন্ত্রণালয়, PSC, 12-20 Grade সহ সকল চাকরির প্রশ্ন ও সলিউশন।",
      buttonText: "ভুলের খাতা দেখো",
      href: "/question-bank",
      icon: BookOpen,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Recent Job Solution",
      description: "সম্প্রতিক PSC, 12-20 Grade সহ সকল চাকরির প্রশ্ন ও সলিউশন। অটো আপডেট",
      buttonText: "সম্পতিক পরীক্ষার সলিউশন",
      href: "/job-solution",
      icon: Bot,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "আপনার মানসিক স্বাস্থ্য ঠিক আছে তো?",
      description: "ডিপ্রেশন, দুশ্চিন্তা পরিমাপ করুন বিনামূল্যে",
      buttonText: "পরীক্ষা শুরু করুন",
      href: "/psychology-test-bangla",
      icon: Brain,
      iconColor: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "WhatsApp Study Group",
      description: "আপডেট, প্রিমিয়াম PDF, বই ফ্রি পেতে জয়েন করুন",
      buttonText: "গ্রুপে জয়েন করুন",
      href: "https://chat.whatsapp.com/JW63CMSIlMF4sLnf6bF7g4?s=cl&p=a&ilr=1",
      icon: MessageCircle,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeItem}
        onNavigate={setActiveItem}
        role={role}
      />
      <div className="lg:ml-[260px]">
        <Topbar title="Student Dashboard" onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.displayName || "Student"}</h1>
            <p className="text-gray-600">Ready to start learning? Choose a tool below.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {cards.map((card, index) => (
              <DashboardCard key={index} {...card} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
