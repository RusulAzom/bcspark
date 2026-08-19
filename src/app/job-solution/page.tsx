// Server Component
import { collection, getDocs } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobSolutionGrid from "@/components/JobSolutionGrid";
import { db } from "@/lib/firebase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Recent Job Solutions in Bangladesh 2026 | BCS Spark',
  description: 'Browse the latest government and private job exam solutions in Bangladesh. Find recent job solutions with questions and answers at BCS Spark.',
};

type JobSolution = {
  id: string;
  [key: string]: any;
};

export default async function JobSolutionPage() {
  const querySnapshot = await getDocs(collection(db, "job_solutions"));

  // Map Firestore docs to plain serializable objects.
  const solutions = querySnapshot.docs.map((doc) => {
    const data = doc.data() as JobSolution;
    const details: Record<string, any> = data ?? {};
    const examInfo: Record<string, any> = details.examInfo ?? {};

    return {
      id: doc.id, // Firestore doc ID (plain string)
      title:
        details.title ??
        details.jobTitle ??
        examInfo.examName ??
        details.exam_title ??
        "No Title",
      organization:
        details.organization ??
        details.examTaker ??
        examInfo.examTaker ??
        details.org ??
        "Organization Not Listed",
      postName:
        examInfo.postName ??
        details.post_name ??
        details.title ??
        "",
      examDate:
        details.examDate ??
        examInfo.examDate ??
        details.exam_date ??
        details.date ??
        null,
      totalQuestions:
        details.totalQuestions ??
        examInfo.totalQuestions ??
        details.total_questions ??
        details.questions?.length ??
        "",
      timeAllowed:
        examInfo.durationMinutes ??
        details.time_allowed ??
        "",
      fullMarks:
        examInfo.totalMarks ??
        details.full_marks ??
        "",
      sortTime: details.createdAt ?? details.created_at ?? null,
    };
  });

  // Sort newest first using the raw Firestore Timestamp server-side only.
  // Do NOT pass the Timestamp to the client component (Next.js 16 forbids it).
  solutions.sort((a, b) => {
    const aTime = (a as any).sortTime;
    const bTime = (b as any).sortTime;
    if (aTime && bTime) {
      const aMillis =
        typeof aTime?.toMillis === "function"
          ? aTime.toMillis()
          : aTime?.seconds
          ? aTime.seconds * 1000
          : 0;
      const bMillis =
        typeof bTime?.toMillis === "function"
          ? bTime.toMillis()
          : bTime?.seconds
          ? bTime.seconds * 1000
          : 0;
      return bMillis - aMillis;
    }
    return 0;
  });

  // Strip the server-only sortTime field before sending to the client component
  const printableSolutions = solutions.map(({ sortTime, ...rest }) => rest);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              সাম্প্রতিক চাকরির সমাধান | Recent Job Solutions 2026
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              সর্বশেষ সরকারি ও বেসরকারি চাকরির পরীক্ষার প্রশ্ন ও সমাধান
            </p>
          </div>

          <JobSolutionGrid solutions={printableSolutions} />
        </div>
      </main>
      <Footer />
    </>
  );
}