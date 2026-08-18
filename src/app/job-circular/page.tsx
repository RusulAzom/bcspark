// Server Component
import Link from "next/link";
import { Briefcase, Calendar, Users } from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type JobCircular = {
  id: string;
  [key: string]: any; // any type so we can handle both structures
};

export default async function JobCircularPage() {
  const q = query(collection(db, "circulars"), orderBy("created_at", "desc"));
  const querySnapshot = await getDocs(q);

  const jobs = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as JobCircular[];

  console.log("Total jobs from firebase:", jobs.length);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Latest Job Circulars
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Browse the latest government and private job opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => {
              // FIX: Check both flat and nested structure with fallbacks
              const title = job.title?? "No Title";
              const org = job.organization_name?? job.organization?? "Organization Not Listed";
              const vacancies = job.total_vacancies?? job.summary?.total_vacancies?? "N/A";
              const deadline = job.application_deadline?? job.deadline?? "N/A";
              const type = job.job_type;

              return (
                <Link
                  key={job.id}
                  href={`/job-circular/${job.id}`}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex-1">
                    <h2 className="line-clamp-2 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                      {title}
                    </h2>
                    <p className="mt-2 text-base font-medium text-gray-700">
                      {org}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="mr-2 h-4 w-4 text-gray-400" />
                      <span>Vacancies: {vacancies}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <span>Deadline: {deadline}</span>
                    </div>
                    {type && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="mr-2 h-4 w-4 text-gray-400" />
                        <span>{type}</span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}