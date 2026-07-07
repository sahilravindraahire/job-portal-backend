import React from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiBriefcase, FiClock } from "react-icons/fi";

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days}d ago`;
  return `Posted ${Math.floor(days / 30)}mo ago`;
};

function JobCard({ job }) {
  const companyName = job.postedBy?.company?.name || job.company?.name;
  const isNew =
    (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24) <
    3;

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="group grid grid-cols-[1fr_auto] gap-4 border-b border-line py-6 hover:bg-paper-dim/60 transition-colors px-2 -mx-2"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          {isNew && (
            <span className="tag-highlight stamp px-1.5 py-0.5">New</span>
          )}
          <span className="stamp text-gray-soft">{timeAgo(job.createdAt)}</span>
        </div>
        <h3 className="font-display text-lg sm:text-xl leading-tight group-hover:underline decoration-2 underline-offset-2">
          {job.title}
        </h3>
        {companyName && (
          <p className="text-sm text-gray-mid mt-1">{companyName}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs font-mono text-gray-mid">
          <span className="flex items-center gap-1">
            <FiMapPin size={13} /> {job.location}
          </span>
          <span className="flex items-center gap-1">
            <FiBriefcase size={13} /> {job.jobType}
          </span>
          <span className="flex items-center gap-1">
            <FiClock size={13} /> {job.experienceLevel} yrs exp
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between shrink-0">
        <span className="font-mono text-sm font-semibold whitespace-nowrap">
          ₹{job.salary}
        </span>
        {typeof job.applicationCount === "number" && (
          <span className="stamp text-gray-soft mt-2 whitespace-nowrap">
            {job.applicationCount} applied
          </span>
        )}
      </div>
    </Link>
  );
}

export default JobCard;
