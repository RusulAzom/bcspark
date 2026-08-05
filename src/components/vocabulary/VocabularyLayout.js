'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import vocabularyData from './vocabularyData';
import { sampleDistributed } from './sampleEngine';
import AllVocabTable from './AllVocabTable';
import SmartMCQ from './SmartMCQ';
import Flashcard3D from './Flashcard3D';
import AISuggestions from './AISuggestions';
import VocabStories from './VocabStories';

const TABS = [
  { id: 'all', label: 'All Vocabulary List', icon: '📋' },
  { id: 'mcq', label: 'Smart MCQ Test', icon: '✍️' },
  { id: 'flashcard', label: 'Flashcard Games', icon: '🃏' },
  { id: 'suggestions', label: 'Daily AI Suggestions', icon: '🤖' },
  { id: 'stories', label: 'Vocabulary Stories', icon: '📖' },
];

const SAMPLE_SIZE = 10;

export default function VocabularyLayout() {
  const [activeTab, setActiveTab] = useState('all');

  const sampledQuestions = useMemo(() => {
    return sampleDistributed(vocabularyData, SAMPLE_SIZE);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return <AllVocabTable questions={vocabularyData} />;
      case 'mcq':
        return <SmartMCQ questions={sampledQuestions} />;
      case 'flashcard':
        return <Flashcard3D questions={sampledQuestions} />;
      case 'suggestions':
        return <AISuggestions />;
      case 'stories':
        return <VocabStories />;
      default:
        return <AllVocabTable questions={vocabularyData} />;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-[#0B1B4F]">
                Vocabulary Hub
              </h1>
              <span className="text-xs bg-gradient-to-r from-[#F35E1B]/15 to-[#F9B816]/15 text-[#F35E1B] border border-[#F35E1B]/25 px-2.5 py-0.5 rounded-full font-medium">
                BCS Focused
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Master English vocabulary for BCS and competitive exams
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-white/95 sticky top-16 z-20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide gap-1 py-3">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#1E53C5]/10 text-[#1E53C5] border border-[#1E53C5]/25 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </>
  );
}