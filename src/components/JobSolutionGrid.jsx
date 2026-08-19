"use client";

import Link from "next/link";
import { Calendar, Clock, FileQuestion, Award, Building2 } from "lucide-react";

// Client component for the job solution listing grid
// Receives solutions data from the server component
export default function JobSolutionGrid({ solutions }) {
  return (
    <div>
      {/* Solution Count */}
      <p className="mb-6 text-center text-sm text-gray-500">
        মোট {solutions.length} টি চাকরির সমাধান
      </p>

      {/* Solution Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {solutions.map((solution) => (
          <Link
            key={solution.id}
            href={`/job-solution/${solution.id}`}
            className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex-1">
              <h2 className="line-clamp-2 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                {solution.title}
              </h2>

              <div className="mt-2 flex items-center text-base text-gray-700">
                <Building2 className="mr-2 h-4 w-4 text-gray-400" />
                <span>{solution.organization}</span>
              </div>

              {solution.postName && (
                <p className="mt-1 text-sm font-medium text-gray-500">
                  পদ: {solution.postName}
                </p>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {solution.examDate && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <span>Exam Date: {solution.examDate}</span>
                </div>
              )}
              {solution.totalQuestions && (
                <div className="flex items-center text-sm text-gray-600">
                  <FileQuestion className="mr-2 h-4 w-4 text-gray-400" />
                  <span>মোট প্রশ্ন: {solution.totalQuestions}</span>
                </div>
              )}
              {solution.timeAllowed && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-2 h-4 w-4 text-gray-400" />
                  <span>
                    সময়:{" "}
                    {/^(auto|auto )?\d+$/i.test(String(solution.timeAllowed))
                      ? `${solution.timeAllowed} মিনিট`
                      : solution.timeAllowed}
                  </span>
                </div>
              )}
              {solution.fullMarks && (
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="mr-2 h-4 w-4 text-gray-400" />
                  <span>পূর্ণমান: {solution.fullMarks}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {solutions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <FileQuestion className="h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No job solutions found
          </h3>
          <p className="mt-2 text-gray-500">
            There are no job solutions available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}