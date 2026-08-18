"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  ExternalLink,
  FileText,
  Users,
} from "lucide-react";

import { db } from "@/lib/firebase";

type Position = {
  position_name?: string;
  vacancies?: string | number;
  grade?: string | number;
  salary_scale?: string;
};

type RecruitmentCategory = {
  category_name?: string;
  positions?: Position[];
};

type JobBlogPost = {
  title?: string;
  summary?: {
    total_vacancies?: string | number;
    organization_name?: string;
    application_deadline?: string;
    application_process?: string;
  };
  application_details?: {
    start_date?: string;
    end_date?: string;
    application_fee?: {
      regular?: string | number;
    };
    application_link?: string;
  };
  eligibility_criteria?: {
    age_limit?: string;
    residency_requirement?: string;
    other_conditions?: string[];
  };
  recruitment_categories?: RecruitmentCategory[];
};

type JobDocument = {
  id: string;
  job_blog_post?: JobBlogPost;
  [key: string]: unknown;
};

export default function JobDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [job, setJob] = useState<JobDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      try {
        const docRef = doc(db, "circulars", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() } as JobDocument);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching job details: ", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="h-6 w-1/3 rounded bg-slate-200" />
              <div className="mt-4 space-y-3">
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-2/3 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <h1 className="text-2xl font-bold text-slate-900">Job not found</h1>
        <p className="mt-2 text-slate-600">
          The job circular you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/job-circular"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Jobs
        </Link>
      </div>
    );
  }

  // Support both nested and flattened structures
  const details = job.job_blog_post ?? (job as unknown as JobBlogPost);
  const summary = details?.summary ?? {};
  const applicationDetails = details?.application_details ?? {};
  const eligibility = details?.eligibility_criteria ?? {};
  const recruitmentCategories = details?.recruitment_categories ?? [];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back Link */}
        <Link
          href="/job-circular"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Jobs
        </Link>

        {/* Card 1: Header */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {details?.title ?? "N/A"}
          </h1>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              <Users className="h-4 w-4" />
              Vacancies: {summary.total_vacancies ?? "N/A"}
            </span>
          </div>
        </div>

        {/* Card 2: Important Dates */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Important Dates
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-slate-500">START DATE</p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {applicationDetails.start_date ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">END DATE</p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {applicationDetails.end_date ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">EXAM DATE</p>
              <p className="mt-1 text-base font-semibold text-slate-900">N/A</p>
            </div>
          </div>
        </div>


        {/* Card 4: Eligibility */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Eligibility</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-slate-500">AGE LIMIT</p>
              <p className="mt-1 text-base text-slate-900">
                {eligibility.age_limit ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">RESIDENCY</p>
              <p className="mt-1 text-base text-slate-900">
                {eligibility.residency_requirement ?? "N/A"}
              </p>
            </div>
          </div>
          {Array.isArray(eligibility.other_conditions) &&
            eligibility.other_conditions.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-slate-500">
                  OTHER CONDITIONS
                </p>
                <ul className="list-inside list-disc space-y-1 text-slate-700">
                  {eligibility.other_conditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        {/* Card 5: Vacancy Details */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Vacancy Details
            </h2>
          </div>

          {recruitmentCategories.length === 0 ? (
            <p className="text-slate-600">No vacancy details available.</p>
          ) : (
            <div className="space-y-6">
              {recruitmentCategories.map((category, index) => (
                <div key={index}>
                  <h3 className="mb-3 text-base font-semibold text-slate-900">
                    {category.category_name ?? "N/A"}
                  </h3>
                  <div className="overflow-x-auto rounded-md border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left font-medium text-slate-900"
                          >
                            Position Name
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left font-medium text-slate-900"
                          >
                            Vacancies
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left font-medium text-slate-900"
                          >
                            Grade
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left font-medium text-slate-900"
                          >
                            Salary Scale
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {Array.isArray(category.positions) &&
                        category.positions.length > 0 ? (
                          category.positions.map((position, posIndex) => (
                            <tr key={posIndex}>
                              <td className="whitespace-nowrap px-4 py-3 text-slate-900">
                                {position.position_name ?? "N/A"}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                {position.vacancies ?? "N/A"}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                {position.grade ?? "N/A"}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                {position.salary_scale ?? "N/A"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-4 py-3 text-center text-slate-500"
                            >
                              No positions listed
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: Application Info */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">
              Application Info
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                APPLICATION PROCESS
              </p>
              <p className="mt-1 text-base text-slate-900">
                {summary.application_process ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                APPLICATION FEE
              </p>
              <p className="mt-1 text-base text-slate-900">
                {applicationDetails.application_fee?.regular ?? "N/A"}
              </p>
            </div>
            {applicationDetails.application_link && (
              <div className="pt-2">
                <a
                  href={applicationDetails.application_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Apply Now
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
}
