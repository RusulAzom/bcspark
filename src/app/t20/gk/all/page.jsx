import questions from '../../../../../data/t20/GK/gkAll.json';
import QuickPracticeEngine from '@/components/QuickPracticeEngine';

export default function GKPage() {
  // T20 এর জন্য 20 টা random প্রশ্ন
  const random20 = questions.sort(() => 0.5 - Math.random()).slice(0, 20);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <QuickPracticeEngine questions={random20} title="GK Quick Practice - BCS" />
    </div>
  );
}