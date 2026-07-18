'use client';

export default function VocabStories() {
  const stories = [
    {
      id: 1,
      title: 'The Eloquent Speaker',
      excerpt:
        'In a bustling town, there lived a man named Arif who was known for his eloquent speech. His words flowed like a gentle river, captivating everyone who listened...',
      words: ['Eloquent', 'Captivate', 'Profound'],
      difficulty: 'Intermediate',
      readTime: '3 min',
    },
    {
      id: 2,
      title: 'The Resilient Farmer',
      excerpt:
        'Despite the devastating floods that destroyed his crops, Rahman remained resilient. Each morning, he would wake up before dawn, determined to rebuild...',
      words: ['Resilient', 'Perseverance', 'Tenacious'],
      difficulty: 'Easy',
      readTime: '4 min',
    },
    {
      id: 3,
      title: 'The Benevolent Merchant',
      excerpt:
        'Hasan was a wealthy merchant, but unlike others, he was profoundly benevolent. He believed that true wealth lay not in gold, but in the hearts he touched...',
      words: ['Benevolent', 'Profound', 'Abundant'],
      difficulty: 'Intermediate',
      readTime: '5 min',
    },
  ];

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Intermediate: 'bg-[#F9B816]/10 text-[#F9B816] border-[#F9B816]/20',
    Advanced: 'bg-[#F35E1B]/10 text-[#F35E1B] border-[#F35E1B]/20',
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-[#1E53C5]/5 border border-[#1E53C5]/15 rounded-full px-4 py-1.5">
          <span className="w-2 h-2 bg-[#1E53C5] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-[#1E53C5]">
            Story Mode
          </span>
        </div>
        <h2 className="text-2xl font-bold text-[#0B1B4F]">
          Vocabulary Stories
        </h2>
        <p className="text-sm text-slate-500">
          Learn vocabulary through engaging narrative stories (Coming Soon)
        </p>
      </div>

      {/* Story Cards */}
      <div className="grid gap-4">
        {stories.map((story) => (
          <div
            key={story.id}
            className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#1E53C5]/30 hover:shadow-md transition-all duration-200 cursor-pointer shadow-sm"
          >
            <div className="flex items-start gap-4">
              {/* Story Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#1E53C5]/5 border border-[#1E53C5]/15 flex items-center justify-center text-2xl">
                📖
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-[#0B1B4F]">
                    {story.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      difficultyColors[story.difficulty]
                    }`}
                  >
                    {story.difficulty}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-3">
                  {story.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {story.words.map((word, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#1E53C5]/5 text-[#1E53C5] px-2 py-0.5 rounded-md"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                    {story.readTime} read
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 text-slate-300 group-hover:text-[#1E53C5] transition-colors">
                →
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-[#1E53C5]/5 to-[#1E53C5]/5 border border-[#1E53C5]/15 rounded-2xl p-6 text-center shadow-sm">
        <div className="text-3xl mb-3">🎯</div>
        <h3 className="text-lg font-semibold text-[#0B1B4F] mb-2">
          More Stories Coming Soon
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          We are building an extensive library of vocabulary stories. Each story
          is crafted to help you remember words through context and narrative.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 bg-[#1E53C5] rounded-full" />
          <span>AI-generated stories with human review</span>
          <span className="w-1.5 h-1.5 bg-[#1E53C5] rounded-full" />
          <span>CEFR-aligned difficulty levels</span>
          <span className="w-1.5 h-1.5 bg-[#1E53C5] rounded-full" />
          <span>Interactive comprehension checks</span>
        </div>
      </div>
    </div>
  );
}