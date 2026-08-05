'use client';

export default function AISuggestions() {
  const suggestions = [
    {
      id: 1,
      title: 'Daily Recommended Words',
      description:
        'Based on your learning patterns, here are 5 words to master today:',
      words: ['Eloquent', 'Resilient', 'Tenacious', 'Benevolent', 'Prudent'],
      accent: 'blue',
    },
    {
      id: 2,
      title: 'Weak Areas Spotlight',
      description:
        'You tend to confuse synonyms. Focus on these pairs to strengthen your vocabulary:',
      words: ['Ephemeral vs Eternal', 'Hostile vs Amicable', 'Abate vs Intensify'],
      accent: 'orange',
    },
    {
      id: 3,
      title: 'Exam-Focused Words',
      description:
        'These words appeared most frequently in recent BCS exams:',
      words: ['Verdant', 'Cunning', 'Ambiguous', 'Profound', 'Inevitable'],
      accent: 'amber',
    },
  ];

  const accentMap = {
    blue: { border: 'border-[#1E53C5]/20', badge: 'bg-[#1E53C5]/10 text-[#1E53C5]', dot: 'bg-[#1E53C5]' },
    orange: { border: 'border-[#F35E1B]/20', badge: 'bg-[#F35E1B]/10 text-[#F35E1B]', dot: 'bg-[#F35E1B]' },
    amber: { border: 'border-[#F9B816]/20', badge: 'bg-[#F9B816]/10 text-[#F9B816]', dot: 'bg-[#F9B816]' },
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-[#1E53C5]/5 border border-[#1E53C5]/15 rounded-full px-4 py-1.5">
          <span className="w-2 h-2 bg-[#1E53C5] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-[#1E53C5]">
            AI-Powered
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#0B1B4F]">
          Daily AI Suggestions
        </h2>
        <p className="text-sm text-slate-500">
          Personalized vocabulary recommendations powered by AI (Coming Soon)
        </p>
      </div>

      {/* Demo Suggestion Cards */}
      <div className="grid gap-4">
        {suggestions.map((s) => {
          const colors = accentMap[s.accent];
          return (
            <div
              key={s.id}
              className={`bg-white border ${colors.border} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl ${colors.badge} flex items-center justify-center text-lg font-bold`}
                >
                  {s.id}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-[#0B1B4F] mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    {s.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {s.words.map((word, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`flex-shrink-0 w-2 h-2 rounded-full ${colors.dot} mt-2`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Coming Soon Overlay */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-8 py-4 border border-[#F9B816]/30 shadow-lg">
            <p className="text-[#F35E1B] font-semibold text-center">
              🚀 Full AI integration coming soon
            </p>
            <p className="text-slate-400 text-xs text-center mt-1">
              Connect your account to unlock personalized learning
            </p>
          </div>
        </div>
        {/* Placeholder future content */}
        <div className="opacity-10 pointer-events-none select-none">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-4">
            <div className="h-4 bg-slate-100 rounded w-3/4 mb-3" />
            <div className="h-3 bg-slate-100 rounded w-full mb-2" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-4">
            <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />
            <div className="h-3 bg-slate-100 rounded w-full mb-2" />
            <div className="h-3 bg-slate-100 rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}