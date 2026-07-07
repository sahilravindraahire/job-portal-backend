import React from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiBriefcase } from "react-icons/fi";

function CompanyCard({ company }) {
  return (
    <Link
      to={`/companies/${company._id}`}
      className="group border border-line bg-paper p-5 flex flex-col gap-3 hover:border-ink transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 shrink-0 rounded-full bg-paper-dim border border-line flex items-center justify-center font-display text-base overflow-hidden">
          {company.companyProfileImage ? (
            <img
              src={company.companyProfileImage}
              alt={company.name}
              className="w-full h-full object-cover"
            />
          ) : (
            company.name?.[0]?.toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-base group-hover:underline underline-offset-2 truncate">
            {company.name}
          </h3>
          {company.location && (
            <p className="flex items-center gap-1 text-xs text-gray-mid mt-0.5">
              <FiMapPin size={11} /> {company.location}
            </p>
          )}
        </div>
      </div>
      {company.description && (
        <p className="text-sm text-gray-mid line-clamp-2">
          {company.description}
        </p>
      )}
      <div className="flex items-center gap-1.5 stamp text-gray-soft mt-auto pt-2 border-t border-line">
        <FiBriefcase size={12} /> {company.jobcount ?? 0} open roles
      </div>
    </Link>
  );
}

export default CompanyCard;
