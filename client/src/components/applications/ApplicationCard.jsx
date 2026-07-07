import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import { FiMapPin } from "react-icons/fi";

function ApplicationCard({ application, onWithdraw, withdrawing }) {
  const job = application.job?.[0] || application.job;

  if (!job) return null;

  return (
    <div className="border border-line bg-paper flex flex-col sm:flex-row">
      <div className="flex-1 p-5">
        <div className="flex items-center justify-between mb-2">
          <StatusBadge status={application.status} />
          <span className="stamp text-gray-soft">
            Applied {new Date(application.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Link
          to={`/jobs/${job._id}`}
          className="font-display text-lg hover:underline underline-offset-2"
        >
          {job.title}
        </Link>
        <p className="text-sm text-gray-mid mt-1">
          {job.postedBy?.[0]?.Company?.name || job.postedBy?.company?.name || "—"}
        </p>
        <p className="flex items-center gap-1 text-xs font-mono text-gray-mid mt-2">
          <FiMapPin size={12} /> {job.location}
        </p>
      </div>
      {application.status === "pending" && onWithdraw && (
        <div className="sm:w-40 border-t sm:border-t-0 sm:border-l border-dashed border-line flex items-center justify-center p-4">
            <Button
            variant="danger"
            size="sm"
            loading={withdrawing}
            onClick={() => onWithdraw(application._id)}
            className="w-full"
          >
            Withdraw
          </Button>
        </div>
      )}
    </div>
  );
}

export default ApplicationCard;
