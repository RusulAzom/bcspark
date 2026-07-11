import questions from '../../../../../data/t20/english/grammar/vocabulary/vocabulary.json';
import QuickPracticeEngine from '@/components/QuickPracticeEngine';

export default function VocabularyPage() {
    const randomQuestions = [...questions]
        .sort(() => 0.5 - Math.random())
        .slice(0, 20);

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <QuickPracticeEngine
                questions={randomQuestions}
                config={{
                    title: "Vocabulary Test - BCS",
                    questionLimit: 20,
                    timeLimit: 120,
                    timerDisplay: "t20",
                    negativeMarking: 0.5,
                    randomize: true,
                }}
            />
        </div>
    );
}