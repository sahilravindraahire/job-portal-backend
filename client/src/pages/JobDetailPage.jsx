import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiUsers,
  FiArrowLeft,
} from "react-icons/fi";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import useAuth from "../hooks/useAuth.js";
import { fetchJobById, clearCurrentJob } from "../features/jobs/jobSlice.js";
import {
  applyForJob,
  clearApplicationsError,
  clearSuccessMessage,
} from "../features/applications/applicationsSlice.js";

function JobDetailPage() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { currentJob, status } = useSelector((state) => state.job);
  const {
    status: appStatus,
    error: appError,
    successMessage,
  } = useSelector((state) => state.applications);
  const { isAuthenticated, isEmployee, user} = useAuth();
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    dispatch(fetchJobById(jobId));
    return () => dispatch(clearCurrentJob());
  }, [jobId, dispatch]);

  const handleApply = async () => {
    const result = await dispatch(applyForJob(jobId));
    if (applyForJob.fulfilled.match(result)) {
      setApplied(true);
    }
  };

  if (status === "loading" || !currentJob) {
    return <Spinner className="py-24" />;
  }

  const company = currentJob.postedBy?.company;

  return(
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link
        to="/jobs"
        className="flex items-center gap-1.5 stamp text-gray-mid hover:text-ink mb-8 w-fit"
      >
        <FiArrowLeft size={13} /> Back to listings
      </Link>

      {(appError || successMessage) && (
        <div className="mb-6">
          <Alert
            type={successMessage ? "success" : "error"}
            message={successMessage || appError}
            onClose={() => {
              dispatch(clearApplicationsError());
              dispatch(clearSuccessMessage());
            }}
          />
        </div>
      )}

      <div className="border-b border-line pb-8 mb-8">
        <div className="flex items-center gap-3 mb-4">
          {company?.companyProfileImage && (
            <img
              src={company.companyProfileImage}
              alt={company.name}
              className="w-11 h-11 rounded-full object-cover border border-line"
            />
          )}
          <div>
            <p className="text-sm font-medium">{company?.name}</p>
            <p className="stamp text-gray-soft">
              Posted {new Date(currentJob.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl leading-tight mb-5">
          {currentJob.title}
        </h1>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-mono text-gray-mid mb-6">
          <span className="flex items-center gap-1.5">
            <FiMapPin size={14} /> {currentJob.location}
          </span>
          <span className="flex items-center gap-1.5">
            <FiBriefcase size={14} /> {currentJob.jobType}
          </span>
          <span className="flex items-center gap-1.5">
            <FiClock size={14} /> {currentJob.experienceLevel} yrs experience
          </span>
          <span className="flex items-center gap-1.5">
            <FiUsers size={14} /> {currentJob.applicationCount || 0} applicants
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display text-2xl">₹{currentJob.salary}</span>

          {isAuthenticated && isEmployee && (
            <Button
              onClick={handleApply}
              loading={appStatus === "loading"}
              disabled={applied}
            >
              {applied ? "Applied" : "Apply now"}
            </Button>
          )}
          {!isAuthenticated && (
            <Link to="/login" className="btn-primary px-5 py-2.5 text-sm">
              Log in to apply
            </Link>
          )}
        </div>
      </div>

      <div className="prose-sm max-w-none">
        <h2 className="font-display text-xl mb-3">Job description</h2>
        <p className="text-sm leading-relaxed whitespace-pre-line text-gray-mid mb-8">
          {currentJob.description}
        </p>

        {currentJob.requirements?.length > 0 && (
          <>
            <h2 className="font-display text-xl mb-3">Requirements</h2>
            <ul className="flex flex-wrap gap-2">
              {currentJob.requirements.map((req) => (
                <li
                  key={req}
                  className="border border-line px-3 py-1 text-xs font-mono"
                >
                  {req}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default JobDetailPage;
