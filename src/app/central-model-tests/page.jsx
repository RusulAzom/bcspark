'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CENTRAL_MODEL_TESTS } from '@/data/centralModelTests';

function CountdownTimer({ targetDateTime }) {
  const [timeLeft, setTimeLeft] = useState({});
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDateTime);
      const now = new Date();
      const difference = target - now;

      if (difference <= 0) {
        setIsStarted(true);
        setTimeLeft({});
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
      setIsStarted(false);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDateTime]);

  const formatNumber = (num) => String(num).padStart(2, '0');

  if (isStarted) {
    return (
      <div className="mt-3 p-3 bg-green-50 border-2 border-green-500 rounded-lg">
        <p className="text-green-700 font-bold text-center">✓ Exam Started | পরীক্ষা শুরু হয়েছে</p>
        <p className="text-green-600 text-sm text-center mt-1">You can start anytime | যেকোনো সময় শুরু করতে পারেন</p>
      </div>
    );
  }

  return (
    <div className="mt-3 p-3 bg-blue-50 border-2 border-blue-500 rounded-lg">
      <p className="text-blue-700 font-bold text-center text-sm mb-2">
        Starts in | বাকি সময়
      </p>
      <div className="flex justify-center gap-2 text-center">
        {timeLeft.days > 0 && (
          <div className="flex flex-col">
            <span className="text-xl font-bold text-blue-900">{formatNumber(timeLeft.days)}</span>
            <span className="text-xs text-blue-600">Days | দিন</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-xl font-bold text-blue-900">{formatNumber(timeLeft.hours)}</span>
          <span className="text-xs text-blue-600">Hrs | ঘন্টা</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-blue-900">{formatNumber(timeLeft.minutes)}</span>
          <span className="text-xs text-blue-600">Min | মিনিট</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold text-blue-900">{formatNumber(timeLeft.seconds)}</span>
          <span className="text-xs text-blue-600">Sec | সেকেন্ড</span>
        </div>
      </div>
    </div>
  );
}

export default function CentralModelTests() {
  const [exams, setExams] = useState(CENTRAL_MODEL_TESTS);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-BD', options);
  };

  const getDateOnly = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    return date.toLocaleDateString('en-BD', options);
  };

  const getTimeOnly = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const options = {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleTimeString('en-BD', options);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-[#1a365d]">
              Central Model Tests | সেন্ট্রাল মডেল টেস্ট
            </h1>
            <p className="text-gray-600">
              সময়সূচী মডেল টেস্ট | Scheduled timed exams for BCS and other competitive exams
            </p>
          </div>

          {/* Combined Model Test - Top Row */}
          {exams.filter(e => e.isCombined).map((exam) => {
            const targetDate = new Date(exam.scheduledDateTime);
            const now = new Date();
            const isAvailable = targetDate <= now;

            return (
              <div key={exam.examId} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-[#1a365d]">Today's Combined Model Test</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div
                    className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-semibold bg-[#1a365d]/10 text-[#1a365d] px-2 py-1 rounded">
                        Combined Model Test
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        isAvailable
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {isAvailable ? 'Available' : 'Scheduled'}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-2 text-[#1a365d]">
                      {exam.title.split('\n').map((line, idx) => (
                        <span key={idx}>
                          {line}
                          {idx < exam.title.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </h2>

                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">Date | তারিখ:</span>
                        <span>{getDateOnly(exam.scheduledDateTime)}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">Time | সময়:</span>
                        <span>{getTimeOnly(exam.scheduledDateTime)}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">Questions | প্রশ্ন:</span>
                        <span>{exam.questions}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">Marks | নম্বর:</span>
                        <span>{exam.marks}</span>
                      </p>
                    </div>

                    <CountdownTimer targetDateTime={exam.scheduledDateTime} />

                    <div className="mt-4">
                      {isAvailable ? (
                        <Link
                          href={exam.route}
                          className="block w-full bg-[#f97316] text-white text-center py-3 rounded-lg font-bold hover:bg-[#ea580c] transition"
                          style={{
                            boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)'
                          }}
                        >
                          Start Exam | পরীক্ষা শুরু করুন
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="block w-full bg-gray-300 text-gray-500 text-center py-3 rounded-lg font-bold cursor-not-allowed"
                        >
                          Not Yet Available | এখনো উপলব্ধ নয়
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Other Scheduled Exams - Second Row */}
          {exams.filter(e => !e.isCombined).length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#1a365d]">Upcoming Model Tests</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.filter(e => !e.isCombined).map((exam) => {
                  const targetDate = new Date(exam.scheduledDateTime);
                  const now = new Date();
                  const isAvailable = targetDate <= now;

                  return (
                    <div
                      key={exam.examId}
                      className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold bg-[#1a365d]/10 text-[#1a365d] px-2 py-1 rounded">
                          Model Test
                        </span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          isAvailable
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {isAvailable ? 'Available' : 'Scheduled'}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold mb-2 text-[#1a365d]">{exam.title}</h2>

                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Date | তারিখ:</span>
                          <span>{getDateOnly(exam.scheduledDateTime)}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Time | সময়:</span>
                          <span>{getTimeOnly(exam.scheduledDateTime)}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Questions | প্রশ্ন:</span>
                          <span>{exam.questions}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-semibold">Marks | নম্বর:</span>
                          <span>{exam.marks}</span>
                        </p>
                      </div>

                      <CountdownTimer targetDateTime={exam.scheduledDateTime} />

                      <div className="mt-4">
                        {isAvailable ? (
                          <Link
                            href={exam.route}
                            className="block w-full bg-[#f97316] text-white text-center py-3 rounded-lg font-bold hover:bg-[#ea580c] transition"
                            style={{
                              boxShadow: '0 4px 14px rgba(249, 115, 22, 0.3)'
                            }}
                          >
                            Start Exam | পরীক্ষা শুরু করুন
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="block w-full bg-gray-300 text-gray-500 text-center py-3 rounded-lg font-bold cursor-not-allowed"
                          >
                            Not Yet Available | এখনো উপলব্ধ নয়
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {exams.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No scheduled exams found | কোনো scheduled পরীক্ষা পাওয়া যায়নি।
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}