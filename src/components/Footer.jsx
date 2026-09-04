"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b1a30] text-gray-300 pb-16 pt-16 border-t border-blue-950 font-bengali">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: 5 columns on desktop, wrap on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-blue-900/40">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex flex-col items-start gap-1">
              <img 
                src="/logo/logo_hr.png" 
                alt="BCS Spark Logo" 
                className="h-14 w-auto object-contain brightness-110"
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed pt-2">
              BCS Spark হল বাংলাদেশের প্রথম AI-চালিত BCS প্রস্তুতি প্ল্যাটফর্ম।
            </p>
            
            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-gray-400">
              <a href="mailto:info@bcsspark.com" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-accent" />
                <span>info@bcsspark.com</span>
              </a>
              <a href="tel:+880123456789" className="flex items-center gap-2.5 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-accent" />
                <span>+880 123 456 789</span>
              </a>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-5">
              দরকারি লিঙ্ক
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-400">
              <li><Link href="/syllabus" className="hover:text-white transition-colors">BCS সিলেবাস</Link></li>
              <li><Link href="/job-circular" className="hover:text-white transition-colors">জব সার্কুলার</Link></li>
              <li><Link href="/mock-test" className="hover:text-white transition-colors">মডেল টেস্ট</Link></li>
              <li><Link href="/leaderboard" className="hover:text-white transition-colors">লিডারবোর্ড</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">ব্লগ</Link></li>
              <li><Link href="/psychology-test-bangla" className="hover:text-white transition-colors">মানসিক স্বাস্থ্য পরীক্ষা</Link></li>
              <li><Link href="/central-model-tests" className="hover:text-white transition-colors">সেন্ট্রাল মডেল টেস্ট</Link></li>
            </ul>
          </div>

          {/* Column 3: About BCS Spark */}
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-5">
              BCS Spark সম্পর্কে
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">আমাদের গল্প</Link></li>
              <li><Link href="/team" className="hover:text-white transition-colors">টিম মেম্বার</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">কেরিয়ার</Link></li>
              <li><Link href="/press" className="hover:text-white transition-colors">প্রেস রিলিজ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">যোগাযোগ করুন</Link></li>
            </ul>
          </div>

          {/* Column 4: Learning Resources */}
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-5">
              লার্নিং রিসোর্স
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-gray-400">
              <li><Link href="/literature" className="hover:text-white transition-colors">বাংলা সাহিত্য</Link></li>
              <li><Link href="/general-knowledge" className="hover:text-white transition-colors">সাধারণ জ্ঞান</Link></li>
              <li><Link href="/math" className="hover:text-white transition-colors">গণিত প্রস্তুতি</Link></li>
              <li><Link href="/bjs" className="hover:text-white transition-colors">বিজস প্রস্তুতি</Link></li>
              <li><Link href="/science" className="hover:text-white transition-colors">বিজ্ঞান ও প্রযুক্তি</Link></li>
              <li><Link href="/live-classes" className="hover:text-white transition-colors">লাইভ ক্লাস</Link></li>
            </ul>
          </div>

          {/* Column 5: Social Media */}
          <div>
            <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-5">
              সোশ্যাল মিডিয়া
            </h4>
            <div className="grid grid-cols-5 gap-3 max-w-[200px]">
              
              {/* Facebook */}
              <a href="#" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-white transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 border border-blue-900 group-hover:bg-blue-900 transition-colors">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                  </svg>
                </div>
                <span className="text-[9px] text-gray-500 group-hover:text-gray-400 mt-1">Facebook</span>
              </a>

              {/* Instagram */}
              <a href="#" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-white transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 border border-blue-900 group-hover:bg-blue-900 transition-colors">
                  <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
                <span className="text-[9px] text-gray-500 group-hover:text-gray-400 mt-1">Instagram</span>
              </a>

              {/* LinkedIn */}
              <a href="#" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-white transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 border border-blue-900 group-hover:bg-blue-900 transition-colors">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <span className="text-[9px] text-gray-500 group-hover:text-gray-400 mt-1">LinkedIn</span>
              </a>

              {/* YouTube */}
              <a href="#" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-white transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 border border-blue-900 group-hover:bg-blue-900 transition-colors">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555a3.002 3.002 0 0 0-2.11 2.108C0 8.03 0 12 0 12s0 3.97.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.97 24 12 24 12s0-3.97-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <span className="text-[9px] text-gray-500 group-hover:text-gray-400 mt-1">YouTube</span>
              </a>

              {/* Twitter */}
              <a href="#" className="flex flex-col items-center gap-1 group text-gray-400 hover:text-white transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 border border-blue-900 group-hover:bg-blue-900 transition-colors">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="text-[9px] text-gray-500 group-hover:text-gray-400 mt-1">Twitter</span>
              </a>

            </div>
          </div>

        </div>

        {/* Bottom Footer Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 text-xs text-gray-500 font-medium">
          <p>© 2024 BCS Spark. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white hover:underline transition-all">গোপনীয়তার নীতি</Link>
            <Link href="/terms" className="hover:text-white hover:underline transition-all">ব্যবহারের শর্তাবলী</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
