import React from "react";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import { FiMail, FiFileText } from "react-icons/fi";

function ApllicantCard({ application, onUpdateStatus, updating }) {
  const applicant = application.applicant;

  if (!applicant) return null;

  console.log(applicant.resume);

  return (
    <div className="border border-line bg-paper p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
      <div className="flex items-start gap-4 min-w-0">
        <div className="w-11 h-11 shrink-0 rounded-full bg-paper-dim border border-line flex items-center justify-center font-display text-sm overflow-hidden">
          {applicant.profileImage ? (
            <img
              src={applicant.profileImage}
              alt={applicant.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            applicant.fullName?.[0]?.toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{applicant.fullName}</p>
          <p className="flex items-center gap-1 text-xs text-gray-mid mt-0.5 truncate">
            <FiMail size={12} /> {applicant.email}
          </p>
          {applicant.skills && (
            <p className="text-xs font-mono text-gray-soft mt-1 truncate">
              {applicant.skills}
            </p>
          )}
          {applicant.resume && (
            <a
              href={applicant.resume}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs font-medium underline underline-offset-2 mt-1.5"
            >
              <FiFileText size={12} /> View resume
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={application.status} />
        {application.status === "pending" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              loading={updating}
              onClick={() => onUpdateStatus(application._id, "accepted")}
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="danger"
              loading={updating}
              onClick={() => onUpdateStatus(application._id, "rejected")}
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApllicantCard;
