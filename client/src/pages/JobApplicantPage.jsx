import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiArrowLeft, FiInbox } from "react-icons/fi";
import ApplicantCard from "../components/applications/ApllicantCard";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import {
  fetchJobApplicants,
  updateApplicationStatus,
} from "../features/applications/applicationsSlice.js";

function JobApplicantPage() {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { jobApplicants, pagination, status } = useSelector(
    (state) => state.applications,
  );

  useEffect(() => {
    dispatch(fetchJobApplicants({ jobId, params: { page: 1, limit: 10 } }));
  }, [jobId, dispatch]);

  const handleUpdateStatus = (applicationId, newStatus) => {
    dispatch(updateApplicationStatus({ applicationId, status: newStatus }));
  };

  const handlePageChange = (page) => {
    dispatch(fetchJobApplicants({ jobId, params: { page, limit: 10 } }));
  };

  return(
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link
        to="/employer/jobs"
        className="flex items-center gap-1.5 stamp text-gray-mid hover:text-ink mb-8 w-fit"
      >
        <FiArrowLeft size={13} /> Back to my jobs
      </Link>

      <p className="stamp text-gray-mid mb-2">{pagination.total || 0} applicants</p>
      <h1 className="font-display text-3xl mb-8">Applicants</h1>

      {status === "loading" ? (
        <Spinner className="py-20" />
      ) : jobApplicants.length === 0 ? (
        <EmptyState icon={FiInbox} title="No applicants yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {jobApplicants.map((app) => (
            <ApplicantCard
              key={app._id}
              application={app}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default JobApplicantPage;
