export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Metadata } from "next";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { format, isValid, parseISO } from "date-fns";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  ExternalLink,
  FileText,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";

type SalaryRange = {
  min?: number | string;
  max?: number | string;
};

type AgeLimit = {
  min?: number | string;
  max?: number | string;
  reference_date?: string;
};

type Position = {
  position_name?: string;
  vacancy_count?: number | string;
  grade?: number | string;
  salary_range?: SalaryRange;
};

type RecruitmentCategory = {
  category_name?: string;
  positions?: Position[];
};

type JobBlogPost = {
  title?: string;
  summary?: {
    organization_name?: string;
    total_vacancies?: number | string;
    application_deadline?: string;
    application_process?: string;
    job_type?: string;
    source_url?: string;
  };
  application_details?: {
    application_link?: string;
    start_date?: string;
    end_date?: string;
    application_fee?: {
      regular?: number | string;
      special_quota?: number | string;
    };
  };
  eligibility_criteria?: {
    age_limit?: AgeLimit | string;
    residency_requirement?: string;
    citizenship?: string;
    other_conditions?: string[];
  };
  recruitment_categories?: RecruitmentCategory[];
};

type JobCircular = {
  id: string;
  [key: string]: any;
};

type JobDetailsData = JobBlogPost & {
  organization_name?: string;
  total_vacancies?: number | string;
  application_deadline?: string;
  application_process?: string;
  job_type?: string;
  source_url?: string;
  [key: string]: unknown;
};

function formatDate(value?: string | null): string {
  if (!value) return "N/A";
  const parsed = parseISO(String(value));
  if (isValid(parsed)) {
    return format(parsed, "dd MMMM yyyy");
  }
  return String(value);
}

function formatAgeLimit(ageLimit?: AgeLimit | string | null): string {
  if (ageLimit == null) return "N/A";
  if (typeof ageLimit === "string") return ageLimit;
  const min = ageLimit?.min ?? "N/A";
  const max = ageLimit?.max ?? "N/A";
  const reference = ageLimit?.reference_date
    ? ` Reference: ${formatDate(ageLimit.reference_date)}`
    : "";
  return `${min} to ${max} years.${reference}`;
}

function formatSalaryRange(salaryRange?: SalaryRange | null): string | null {
  if (!salaryRange) return null;
  const min = salaryRange?.min;
  const max = salaryRange?.max;
  if (min == null && max == null) return null;
  return `৳${min ?? "N/A"} - ৳${max ?? "N/A"}`;
}

function getDetails(data: JobCircular) {
  const details = (data.job_blog_post ?? data ?? {}) as JobDetailsData;
  const summary = details?.summary ?? {};
  return { details, summary };
}

function getFields(details: JobDetailsData, summary: Record<string, any>) {
  const title = details?.title ?? "N/A";
  const organizationName = details?.organization_name ?? summary?.organization_name ?? "N/A";
  const totalVacancies = details?.total_vacancies ?? summary?.total_vacancies ?? "N/A";
  const applicationDeadline =
    details?.application_deadline ?? summary?.application_deadline ?? "N/A";
  const applicationProcess =
    details?.application_process ?? summary?.application_process ?? "N/A";
  const sourceUrl = details?.source_url ?? summary?.source_url ?? null;
  const jobType = details?.job_type ?? summary?.job_type;
  const applicationDetails = details?.application_details ?? {};
  const eligibility = details?.eligibility_criteria ?? {};
  const recruitmentCategories = details?.recruitment_categories ?? [];

  return {
    title,
    organizationName,
    totalVacancies,
    applicationDeadline,
    applicationProcess,
    sourceUrl,
    jobType,
    applicationDetails,
    eligibility,
    recruitmentCategories,
  };
}

async function fetchJob(id: string) {
  if (!id || !db) return null;
  try {
    const docRef = doc(db, "circulars", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docSnap.data() as JobCircular;
  } catch (error) {
    console.error("Error fetching job from Firestore:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    // Next.js 16: params is a Promise - must await it
    const { id } = await params;
    const data = await fetchJob(id);
    if (!data) {
      return {
        title: "Job Not Found | BCS Spark",
      };
    }

    const { details, summary } = getDetails(data);
    const { title, organizationName, applicationDeadline, jobType } = getFields(details, summary);

    const seoTitle = `${title} - ${organizationName} Job Circular 2026${jobType ? " | " + jobType : ""} | BCS Spark`;
    const description =
      `Apply for ${details?.total_vacancies ?? summary?.total_vacancies ?? "various"} ${title} posts at ${organizationName}. ` +
      `Deadline: ${applicationDeadline}. ` +
      (jobType ? `${jobType}. ` : "") +
      `Apply online at BCS Spark.`;

    return {
      title: seoTitle,
      description,
      openGraph: {
        title: seoTitle,
        description,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error generating metadata for job:", error);
    return {
      title: "Job Circular | BCS Spark",
    };
  }
}

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Next.js 16: params is a Promise - must await it
    const { id } = await params;
    const data = await fetchJob(id);

    if (!data) {
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

    const { details, summary } = getDetails(data);
    const {
      title,
      organizationName,
      totalVacancies,
      applicationDeadline,
      applicationProcess,
      sourceUrl,
      jobType,
      applicationDetails,
      eligibility,
      recruitmentCategories,
    } = getFields(details, summary);

    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
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
                {title}
              </h1>
              <p className="mt-2 text-base font-medium text-slate-700">
                {organizationName}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  <Users className="h-4 w-4" />
                  Vacancies: {totalVacancies}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  <Calendar className="h-4 w-4" />
                  Deadline: {applicationDeadline}
                </span>

                {sourceUrl && (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 border-gray-300 hover:bg-gray-200"
                  >
                    <FileText className="h-4 w-4" />
                    Source PDF
                  </a>
                )}
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
                    {formatDate(applicationDetails?.start_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">END DATE</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {formatDate(applicationDetails?.end_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">EXAM DATE</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">N/A</p>
                </div>
              </div>
            </div>

            {/* Card 3: Eligibility */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900">Eligibility</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-slate-500">AGE LIMIT</p>
                  <p className="mt-1 text-base text-slate-900">
                    {formatAgeLimit(eligibility?.age_limit)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">RESIDENCY</p>
                  <p className="mt-1 text-base text-slate-900">
                    {eligibility?.residency_requirement ?? "N/A"}
                  </p>
                </div>
              </div>
              {Array.isArray(eligibility?.other_conditions) &&
                eligibility?.other_conditions &&
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

            {/* Card 4: Vacancy Details */}
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
                        {category?.category_name ?? "N/A"}
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
                            {Array.isArray(category?.positions) &&
                            category.positions.length > 0 ? (
                              category.positions.map((position, posIndex) => (
                                <tr key={posIndex}>
                                  <td className="whitespace-nowrap px-4 py-3 text-slate-900">
                                    {position?.position_name ?? "N/A"}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                    {position?.vacancy_count ?? "N/A"}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                    {position?.grade ?? "N/A"}
                                  </td>
                                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                    {formatSalaryRange(position?.salary_range) ??
                                      "N/A"}
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

            {/* Card 5: Application Info */}
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
                    {applicationProcess}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    APPLICATION FEE
                  </p>
                  <p className="mt-1 text-base text-slate-900">
                    {applicationDetails?.application_fee?.regular ?? "N/A"}
                  </p>
                </div>
                {applicationDetails?.application_link && (
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
        </main>
        <Footer />
      </>
    );
  } catch (error) {
    console.error("Error rendering job details:", error);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
        <p className="mt-2 text-slate-600">
          Unable to load job details. Please try again later.
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
}