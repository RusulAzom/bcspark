"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, BookMarked, Clock, Trophy, Landmark, Award } from "lucide-react";
import Header from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState("august");
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const getHistoryData = () => {
    const monthlyData = {
      august: {
        name: "আগস্ট",
        banglaName: "শ্রাবণ — ভাদ্র",
        season: "বর্ষা",
        days: [
          { day: 1, events: 3, historical: "প্রাদেশিক Blandong অফিসার রেজ斌ে লাহোর消除了", birthdays: 1 },
          { day: 2, events: 5, historical: "বাংলা-বর্ষ পার্টি গঠন (১৯৪৭)", birthdays: 0 },
          { day: 5, events: 2, historical: "৫ অগাস্ট: ≥ historical data", birthdays: 1 },
          { day: 7, events: 4, historical: "৭ই আগস্ট ← World", birthdays: 1 },
          { day: 10, events: 3, historical: "১০ অগাস্ট ← Bos", birthdays: 0 },
          { day: 14, events: 6, historical: "কেরালা ≠ → independence of Pakistan", birthdays: 2 },
          { day: 15, events: 8, historical: "১৫ই আগস্ট: ভারতের স্বাধীনতা দিবস (১৯৪৭)", birthdays: 3, important: true },
          { day: 17, events: 3, historical: "১৭ই আ比武 ← শামসুর রহমান", birthdays: 0 },
          { day: 23, events: 4, historical: "২৩ অগাস্ট ← হুমpty Dumpty", birthdays: 1 },
          { day: 26, events: 5, historical: "২৬ অগাস্ট ← Independence for many countries", birthdays: 1 },
          { day: 29, events: 2, historical: "২৯ই আগস্ট ← নজরুল", birthdays: 0 },
        ]
      },
      july: {
        name: "জুলাই",
        banglaName: "আষাঢ় — শ্রাবণ",
        season: "বর্ষা",
        days: [
          { day: 1, events: 3, historical: "১লা জুলাই ← Canada Day", birthdays: 0 },
          { day: 2, events: 2, historical: "২রা জুলাই ← ≠ historical", birthdays: 0 },
          { day: 4, events: 6, historical: "৪ঠা জুলাই ← American Independence", birthdays: 1 },
          { day: 7, events: 2, historical: "৭ই জুলাই ← format", birthdays: 0 },
          { day: 14, events: 4, historical: "১৪ই জুলাই ← Bastille Day", birthdays: 1 },
          { day: 16, events: 5, historical: "১৬ জুলাই ← হোলি হামলা", birthdays: 0 },
          { day: 17, events: 4, historical: "১৭ জুলাই ← Potsdam Conference", birthdays: 0 },
          { day: 18, events: 2, historical: "১৮ই জুলাই ← Nelson Mandela", birthdays: 1 },
          { day: 19, events: 3, historical: "১৯ জুলাই ← Mughal", birthdays: 0 },
          { day: 20, events: 3, historical: "২০ জুলাই ← ≠ format", birthdays: 1 },
          { day: 26, events: 4, historical: "২৬শে জুলাই ← Independence for many", birthdays: 0 },
          { day: 29, events: 3, historical: "২৯ই জুলাই ← Vidyasagar", birthdays: 0 },
        ]
      },
      september: {
        name: "সেপ্টেম্বর",
        banglaName: "ভাদ্র — আশ্বিন",
        season: "শরৎ",
        days: [
          { day: 1, events: 2, historical: "১ সেপ্টেম্বর ← WWII", birthdays: 0 },
          { day: 5, events: 3, historical: "৫ সেপ্টেম্বর ← format", birthdays: 0 },
          { day: 7, events: 4, historical: "৭ই সেপ্টেম্বর ← Brazil Independence", birthdays: 1 },
          { day: 11, events: 6, historical: "৯/১১ tragedy (২০০১)", birthdays: 0, important: true },
          { day: 13, events: 2, historical: "১৩ সেপ্টেম্বর ← format", birthdays: 1 },
          { day: 14, events: 3, historical: "১৪ সেপ্টেম্বর ← format", birthdays: 0 },
          { day: 15, events: 2, historical: "১৫ সেপ্টেম্বর ← format", birthdays: 0 },
          { day: 18, events: 4, historical: "১৮ সেপ্টেম্বর ← Constitution Day", birthdays: 1 },
          { day: 22, events: 3, historical: "২২ সেপ্টেম্বর ← Autumn", birthdays: 0 },
          { day: 26, events: 2, historical: "২৬ সেপ্টেম্বর ← Vidyasagar", birthdays: 1 },
          { day: 29, events: 3, historical: "২৯ সেপ্টেম্বর ← format", birthdays: 1 },
        ]
      },
      october: {
        name: "অক্টোবর",
        banglaName: "আশ্বিন — কার্তিক",
        season: "শরৎ",
        days: [
          { day: 1, events: 4, historical: "১লা অক্টোবর ← China, Nigeria", birthdays: 0 },
          { day: 2, events: 3, historical: "২রা অক্টোবর ← format", birthdays: 0 },
          { day: 8, events: 2, historical: "৮ অক্টোবর ← format", birthdays: 0 },
          { day: 10, events: 5, historical: "১০ই অক্টোবর ← Fiji", birthdays: 1 },
          { day: 12, events: 3, historical: "১২ই অক্টোবর ← format", birthdays: 0 },
          { day: 16, events: 4, historical: "১৬ অক্টোবর ← format", birthdays: 0 },
          { day: 20, events: 2, historical: "২০ অক্টোবর ← format", birthdays: 0 },
          { day: 24, events: 6, historical: "২৪শে অক্টোবর ← UN Day", birthdays: 0, important: true },
          { day: 31, events: 5, historical: "৩১ অক্টোবর ← Halloween", birthdays: 1 },
        ]
      },
      november: {
        name: "নভেম্বর",
        banglaName: "কার্তিক — ওয়ার",
        season: "শীত",
        days: [
          { day: 1, events: 3, historical: "১লা নভেম্বর ← All Saints", birthdays: 0 },
          { day: 4, events: 5, historical: "৪ঠা নভেম্বর ← Bhajan", birthdays: 0 },
          { day: 7, events: 3, historical: "৭ই নভেম্বর ← Russian Revolution", birthdays: 0, important: true },
          { day: 9, events: 2, historical: "৯ নভেম্বর ← format", birthdays: 0 },
          { day: 11, events: 6, historical: "১১ই নভেম্বর ← Armistice Day", birthdays: 0, important: true },
          { day: 14, events: 3, historical: "১৪ নভেম্বর ← Bangladesh", birthdays: 1 },
          { day: 17, events: 2, historical: "১৭ই নভেম্বর ← Bangladesh", birthdays: 0 },
          { day: 19, events: 2, historical: "১৯ অক্টোবর ← Bangladesh", birthdays: 0 },
          { day: 20, events: 2, historical: "২০ নভেম্বর ← Universal Children's Day", birthdays: 1 },
          { day: 21, events: 2, historical: "২১ নভেম্বর ← format", birthdays: 1 },
          { day: 30, events: 3, historical: "৩০ নভেম্বর ← format", birthdays: 1 },
        ]
      },
      december: {
        name: "ডিসেম্বর",
        banglaName: "ওয়ার — পousing",
        season: "শীত",
        days: [
          { day: 1, events: 4, historical: "১লা ডিসেম্বর ←format", birthdays: 0 },
          { day: 2, events: 2, historical: "২রা ডিসেম্বর ← format", birthdays: 0 },
          { day: 3, events: 3, historical: "৩ ডিসেম্বর ← International Day", birthdays: 0 },
          { day: 5, events: 2, historical: "৫ ডিসেম্বর ← format", birthdays: 0 },
          { day: 9, events: 3, historical: "৯ ডিসেম্বর ← format", birthdays: 1 },
          { day: 10, events: 4, historical: "১০ই ডিসেম্বর ← format", birthdays: 0 },
          { day: 12, events: 2, historical: "১২ই ডিসেম্বর ← format", birthdays: 0 },
          { day: 13, events: 3, historical: "১৩ ডিসেম্বর ← format", birthdays: 1 },
          { day: 14, events: 6, historical: "১৪ই ডিসেম্বর ← Martyred Intellectuals Day", birthdays: 0, important: true },
          { day: 16, events: 7, historical: "১৬ই ডিসেম্বর ← Victory Day", birthdays: 0, important: true },
          { day: 19, events: 2, historical: "১৯ ডিসেম্বর ← Goa", birthdays: 0 },
          { day: 21, events: 3, historical: "২১ ডিসেম্বর ← format", birthdays: 0 },
          { day: 24, events: 5, historical: "২৪ ডিসেম্বর ← Christmas Eve", birthdays: 0 },
          { day: 25, events: 6, historical: "২৫ ডিসেম্বর ← Christmas", birthdays: 0, important: true },
          { day: 31, events: 4, historical: "৩১ ডিসেম্বর ← New Year Eve", birthdays: 0 },
        ]
      }
    };

    return monthlyData[activeTab] || monthlyData.august;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white animate-pulse">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl font-semibold text-gray-600">ইতিহাস লোড হচ্ছে...</div>
        </div>
      </div>
    );
  }

  const monthData = getHistoryData();

  const getEventIcon = (day) => {
    if (day.day === 15 && activeTab === 'august') return <Award className="w-5 h-5 text-amber-600" />;
    if (day.day === 11 && activeTab === 'november') return <Award className="w-5 h-5 text-amber-600" />;
    if (day.day === 24 && activeTab === 'october') return <Award className="w-5 h-5 text-amber-600" />;
    if (day.day === 16 && activeTab === 'december') return <Award className="w-5 h-5 text-amber-600" />;
    return <Calendar className="w-5 h-5 text-blue-600" />;
  };

  const getYearColor = (year) => {
    const y = parseInt(year);
    if (y < 1500) return "bg-amber-100 text-amber-800";
    if (y < 1800) return "bg-blue-100 text-blue-800";
    if (y < 1900) return "bg-indigo-100 text-indigo-800";
    if (y < 1950) return "bg-purple-100 text-purple-800";
    if (y < 2000) return "bg-pink-100 text-pink-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <BookMarked className="w-5 h-5" />
              <span className="text-sm font-medium">বাংলা ও বিশ্ব ইতিহাস</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              আজকের দিনে
            </h1>

            <p className="text-xl md:text-2xl mb-3 font-semibold">
              ঐতিহাসিক ঘটনা ও বিশ্ব প্রসিদ্ধ personalities
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-blue-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">বাংলাদেশ</span>
              </div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">আজকের তারিখ নিয়মিত আপডেট</span>
              </div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">সারাদেশের প্রতিটি জেলার ইতিহাস</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">৬৪</div>
                <div className="text-sm text-blue-200">জেলার ইতিহাস</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">৫০০+</div>
                <div className="text-sm text-blue-200">ঐতিহাসিক ঘটনা</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">১০০+</div>
                <div className="text-sm text-blue-200">বিখ্যাত ব্যক্তিত্ব</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold mb-1">৭০+</div>
                <div className="text-sm text-blue-200">বছরের ইতিহাস</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {[
              { id: 'august', label: 'আগস্ট', season: 'বর্ষা' },
              { id: 'july', label: 'জুলাই', season: 'বর্ষা' },
              { id: 'september', label: 'সেপ্টেম্বর', season: 'শরৎ' },
              { id: 'october', label: 'অক্টোবর', season: 'শরৎ' },
              { id: 'november', label: 'নভেম্বর', season: 'শীত' },
              { id: 'december', label: 'ডিসেম্বর', season: 'শীত' },
            ].map(month => (
              <button
                key={month.id}
                onClick={() => setActiveTab(month.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === month.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {month.label}
                <span className={`block text-xs mt-0.5 ${
                  activeTab === month.id ? 'text-blue-200' : 'text-gray-500'
                }`}>{month.season}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {monthData.name} মাসের ইতিহাস
          </h2>
          <p className="text-lg text-gray-600">
            {monthData.banglaName} | {monthData.season} ঋতু
          </p>
        </div>

        {selectedDay === null ? (
          <>
            {/* Calendar Grid */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {monthData.days.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`relative p-4 rounded-2xl border-2 transition-all hover:shadow-lg ${
                      day.important
                        ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50'
                        : 'border-gray-200 hover:border-blue-400 bg-white'
                    }`}
                  >
                    {day.important && (
                      <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <Trophy className="w-3 h-3" />
                      </div>
                    )}

                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-2 ${
                        day.important ? 'text-amber-700' : 'text-gray-800'
                      }`}>
                        {day.day}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-center gap-1 text-xs">
                          <Calendar className="w-3 h-3 text-blue-600" />
                          <span className="font-semibold text-gray-700">
                            {day.events} ঘটনা
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-1 text-xs">
                          <Users className="w-3 h-3 text-indigo-600" />
                          <span className="font-semibold text-gray-700">
                            {day.birthdays} ব্যক্তি
                          </span>
                        </div>
                      </div>

                      {day.events > 5 && (
                        <div className="mt-2 inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                          <Landmark className="w-3 h-3" />
                          <span>বড় ঘটনা</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {monthData.days.reduce((sum, day) => sum + day.events, 0)}
                    </div>
                    <div className="text-blue-100">মোট ঘটনা</div>
                  </div>
                </div>
                <div className="text-sm text-blue-100">
                  এই মাসে {monthData.days.length} তারিখে ইতিহাসিত ঘটনা們
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {monthData.days.reduce((sum, day) => sum + day.birthdays, 0)}
                    </div>
                    <div className="text-indigo-100">জন্মদিন/মৃত্যু</div>
                  </div>
                </div>
                <div className="text-sm text-indigo-100">
                  বিশিষ্ট ব্যক্তিত্বদের尤其 দিন
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">
                      {monthData.days.filter(day => day.important).length}
                    </div>
                    <div className="text-purple-100">গুরুত্বপূর্ণ দিন</div>
                  </div>
                </div>
                <div className="text-sm text-purple-100">
                  যেদিন ঘটেছে世界変革
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <button
              onClick={() => setSelectedDay(null)}
              className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              ←日历 তির্যক ফিরে যান
            </button>

            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                {monthData.name} {selectedDay} - ঐতিহাসিক দিন
              </h3>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6 py-2">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    ঐতিহাসিক ঘটনা
                  </h4>
                  <p className="text-gray-600">
                    {monthData.days.find(d => d.day === selectedDay)?.historical}
                  </p>
                </div>

                <div className="border-l-4 border-indigo-500 pl-6 py-2">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    বিশ্বের বিখ্যাত events
                  </h4>
                  <p className="text-gray-600">
                    {monthData.days.find(d => d.day === selectedDay)?.events}টি ঘটনা এই দিনে সংঘটিত হয়েছিল।
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-6 py-2">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    জন্মদিন ও মৃত্যু
                  </h4>
                  <p className="text-gray-600">
                    {monthData.days.find(d => d.day === selectedDay)?.birthdays}টি বিখ্যাত ব্যক্তিত্বের জন্মদিন বা প্রয়াণ দিবস।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

{/* About Section */}
      <section className="bg-gradient-to-b from-white to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              আজকের দিনে ─ একটি অনন্য অভিজ্ঞতা
            </h2>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                আজকের দিনে পেজে আপনাকে স্বাগতম! এটি <strong>বাংলাদেশের ইতিহাস</strong> ও <strong>বিশ্ব ইতিহাস</strong>।
              </p>

              <p>
                আমাদের <strong>আজকের দিনে</strong> ফিচার আপনাকে দেখাবে <strong>বিশ্বের ইতিহাস</strong>।
                এটি <strong>বাংলা সাহিত্য</strong>, <strong>বিশ্ব সাহিত্য</strong>, <strong>বাংলা সংস্কৃতি</strong> এবং <strong>বিশ্ব সংস্কৃতি</strong> সম্পর্কে।
              </p>

              <p>
                <strong>আজকের দিনে</strong> আপনাকে দেবে <strong>ইতিহাসের অসাম্য অভিজ্ঞতা</strong>।
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}