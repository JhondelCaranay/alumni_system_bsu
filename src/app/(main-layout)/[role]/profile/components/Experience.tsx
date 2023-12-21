"use client"
import { JobSchemaType } from "@/schema/jobs";
import React from "react";
import { format } from "date-fns";
import { useModal } from "@/hooks/useModalStore";
import { GetCurrentUserType } from "@/actions/getCurrentUser";
type ExperienceProps = {
  data: JobSchemaType;
  user: GetCurrentUserType
};
const DATE_FORMAT = `MMMM yyyy`;

const Experience: React.FC<ExperienceProps> = ({ data, user }) => {
  return (
    <li className="flex justify-between relative">
      <div className="mb-10 ms-6">
        <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
          <svg
            className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </span>
        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          {data.jobTitle}
          {data.isCurrentJob && (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 ms-3">
              Current Work
            </span>
          )}
        </h3>
        <p className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
          {data.company}
        </p>
        <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
          {format(new Date(data.yearStart || new Date()), DATE_FORMAT)}
          {data.yearEnd && `- ${format(new Date(data.yearEnd), DATE_FORMAT)}`}
        </time>
      </div>
    </li>
  );
};

export default Experience;
