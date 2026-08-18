"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Calendar, MapPin, Users } from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { db } from "@/lib/firebase";

type JobCircular = {
  summary?: {
    organization_name?: string;
    total_vacancies?: string | number;
    application_deadline?: string;
  };
  id: string;
  title?: string;
  organization_name?: string;
  total_vacancies?: string | number;
  application_deadline?: string;
  location?: string;
  [key: string]: unknown;
};

export default function JobCircularPage() {
  const [jobs, setJobs] = useState<JobCircular[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, "circulars"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const jobsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as JobCircular[];
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching job circulars: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="h-6 w-3/4 rounded bg-gray-200" />
                  <div className="mt-4 h-4 w-1/2 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-1/3 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-1/4 rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Briefcase className="h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No jobs found
              </h3>
              <p className="mt-2 text-gray-500">
                There are no job circulars available at the moment. Please check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/job-circular/${job.id}`}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex-1">
                    <h2 className="line-clamp-2 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                      {job.title}
                    </h2>
                    <p className="mt-2 text-base font-medium text-gray-700">
                      {job.summary?.organization_name ?? job.organization_name}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="mr-2 h-4 w-4 text-gray-400" />
                      <span>Vacancies: {job.summary?.total_vacancies ?? job.total_vacancies}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <span>Deadline: {job.summary?.application_deadline ?? job.application_deadline}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
