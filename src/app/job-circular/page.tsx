// Server Component
import { collection, getDocs } from "firebase/firestore";
import { format, isValid, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobFilterTabs from "@/components/JobFilterTabs";
import { db } from "@/lib/firebase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Latest Job Circulars in Bangladesh 2026 | BCS Spark',
  description: 'Browse the latest government and private job opportunities in Bangladesh. Find job circulars, vacancies, and apply online at BCS Spark.',
};

type JobCircular = {
  id: string;
  [key: string]: any;
};

type JobDetailsData = {
  title?: string;
  summary?: {
    organization_name?: string;
    total_vacancies?: number | string;
    application_deadline?: string;
    job_type?: string;
  };
  organization_name?: string;
  total_vacancies?: number | string;
  application_deadline?: string;
  job_type?: string;
  [key: string]: any;
};

function generateSeoTitle(title: string, org: string, type?: string): string {
  const parts = [title, org, "Job Circular 2026"];
  if (type) parts.push(type);
  return parts.filter(Boolean).join(" - ");
}

function formatDate(value?: string | null): string {
  if (!value) return "N/A";
  const parsed = parseISO(String(value));
  if (isValid(parsed)) {
    return format(parsed, "dd MMMM yyyy");
  }
  return String(value);
}

// Check if a job's deadline has already passed (expired)
// Returns true if the deadline is in the past, false otherwise
function isDeadlinePassed(deadline?: string | null): boolean {
  if (!deadline) return false; // No deadline = keep the job visible
  const parsed = parseISO(String(deadline));
  if (!isValid(parsed)) return false; // Invalid date = keep the job visible
  return parsed.getTime() < Date.now(); // Deadline in the past = expired
}

export default async function JobCircularPage() {
  const querySnapshot = await getDocs(collection(db, "circulars"));

  // Map Firestore docs to plain serializable objects ONLY.
  // Do NOT spread the raw doc data (contains Firestore Timestamps with toJSON methods
  // which Next.js 16 forbids passing to Client Components).
  // Map Firestore docs to plain serializable objects, then filter out expired jobs
  const jobs = querySnapshot.docs
    .map((doc) => {
      const data = doc.data() as JobCircular;
      const details = (data.job_blog_post ?? data ?? {}) as JobDetailsData;
      const summary = details?.summary ?? {};

      const rawDeadline = details?.application_deadline ?? summary?.application_deadline;

      return {
        id: doc.id, // Firestore doc ID (plain string)
        title: details?.title ?? "No Title",
        // org: details?.organization_name ?? summary?.organization_name ?? "Organization Not Listed",
        vacancies: details?.total_vacancies ?? summary?.total_vacancies ?? "N/A",
        deadline: formatDate(rawDeadline),
        deadlineRaw: rawDeadline ?? null, // keep raw for expiry check
        type: details?.job_type ?? summary?.job_type,
      };
    })
    // RULE: Hide jobs whose deadline has already passed (expired)
    .filter((job) => !isDeadlinePassed(job.deadlineRaw));

  jobs.sort((a, b) => {
    const aTime = (a as any).created_at ?? (a as any).createdAt;
    const bTime = (b as any).created_at ?? (b as any).createdAt;
    if (aTime && bTime) {
      return (bTime?.toMillis?.() ?? 0) - (aTime?.toMillis?.() ?? 0);
    }
    return 0;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
             সরকারি চাকরির সার্কুলার | Latest Gov. Job Circulars 2026
            </h1>
            {/* <h2 className="mt-4 text-xl text-gray-600">
             সরকারি চাকরির নিয়োগ, ব্যাংক, মন্ত্রণালয় চাকরি, জেলা প্রশাসকের কার্যালয় সহ সকল নিয়োগ বিজ্ঞপ্তি            
             </h2> */}
          </div>

          {/* Filter Tabs + Job Cards (client component) */}
          <JobFilterTabs jobs={jobs} />
        </div>
      </main>
      <Footer />
    </>
  );
}