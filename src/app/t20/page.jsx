// import questions from '../../../../../data/t20/english/grammar/spelling/spelling.json';

import questions from '../../../data/t20/english/grammar/spelling/spelling.json';
import QuickPracticeEngine from '@/components/QuickPracticeEngine';

export default function SpellingPage() {
  const random20 = questions.sort(() => 0.5 - Math.random()).slice(0, 20);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <QuickPracticeEngine questions={random20} title="Spelling Test - BCS" />
    </div>
  );
}