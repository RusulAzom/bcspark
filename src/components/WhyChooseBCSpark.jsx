"use client";

import { Brain, Bell, Trophy } from "lucide-react";

export default function WhyChooseBCSpark() {
  const cards = [
    {
      icon: <Brain className="h-6 w-6" />,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      title: "AI-Powered প্র্যাকটিস",
      description: "কৃত্রিম বুদ্ধিমত্তা দিয়ে আপনার দুর্বল জায়গা চিহ্নিত করে ব্যক্তিগতকৃত প্রশ্ন দেয়"
    },
    {
      icon: <Bell className="h-6 w-6" />,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50",
      title: "ডেইলি নোটিফিকেশন",
      description: "প্রতিদিন সকালে নতুন প্রশ্ন, BCS আপডেট ও পড়াশোনার রিমাইন্ডার পাবেন"
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-50",
      title: "লিডারবোর্ড + কমিউনিটি",
      description: "হাজারো পরীক্ষার্থীর সাথে প্রতিযোগিতা করুন এবং কমিউনিটি থেকে সহযোগিতা নিন"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Headings */}
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-primary mb-2">
          কেন BCSpark বেছে নিবেন?
        </h2>
        <p className="text-sm sm:text-base text-gray-500 font-medium">
          HSC থেকে BCS, এক প্ল্যাটফর্মেই প্রস্তুতি
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {cards.map((card, index) => (
          <div 
            key={index}
            className="flex flex-col items-start rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300"
          >
            {/* Circle Icon */}
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bgColor} ${card.iconColor} mb-5`}>
              {card.icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-primary mb-2">
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
