"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Briefcase, Calendar, Users } from "lucide-react";
import {
  getDaysRemainingBengali,
  badgeStyles,
} from "@/lib/bengaliDate";

// Client component for the job listing with filter tabs
// Receives jobs data from the server component and handles filtering client-side
export default function JobFilterTabs({ jobs }) {
  const [activeFilter, setActiveFilter] = useState("all");

  // Extract unique job types from the jobs array for the filter tabs
  const jobTypes = useMemo(() => {
    const types = new Set();
    jobs.forEach((job) => {
      if (job.type) types.add(job.type);
    });
    return ["all", ...Array.from(types)];
  }, [jobs]);

  // Filter jobs based on the active tab
  const filteredJobs = useMemo(() => {
    if (activeFilter === "all") return jobs;
    return jobs.filter((job) => job.type === activeFilter);
  }, [jobs, activeFilter]);

  return (
    <div>
      {/* Filter Tabs */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {jobTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeFilter === type
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-blue-300"
            }`}
          >
            {type === "all" ? "সব চাকরি" : type}
          </button>
        ))}
      </div>

      {/* Job Count */}
      <p className="mb-6 text-center text-sm text-gray-500">
        {activeFilter === "all"
          ? `মোট ${filteredJobs.length} টি চাকরির সার্কুলার`
          : `"${activeFilter}" - ${filteredJobs.length} টি চাকরির সার্কুলার`}
      </p>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => {
          const seoTitle = [job.title, job.org, "Job Circular 2026", job.type]
            .filter(Boolean)
            .join(" - ");

          const badgeInfo = getDaysRemainingBengali(job.deadlineRaw);

          return (
            <Link
              key={job.id}
              href={`/job-circular/${job.id}`}
              className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              {/* Floating "Days Remaining" badge in Bengali */}
              <span
                className={`absolute top-3 right-3 z-10 px-2.5 py-1 text-xs font-semibold rounded-full border ${badgeStyles[badgeInfo.status]}`}
              >
                {badgeInfo.text}
              </span>
              <div className="flex-1">
                <h2 className="line-clamp-2 pr-20 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                  {seoTitle}
                </h2>
                <p className="mt-2 text-base font-medium text-gray-700">
                  {job.org}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="mr-2 h-4 w-4 text-gray-400" />
                  <span>Vacancies: {job.vacancies}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <span>Deadline: {job.deadline}</span>
                </div>
                {job.type && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{job.type}</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty state when no jobs match the filter */}
      {filteredJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Briefcase className="h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No jobs found
          </h3>
          <p className="mt-2 text-gray-500">
            There are no job circulars available for this category at the moment.
          </p>
        </div>
      )}
    </div>
  );
}