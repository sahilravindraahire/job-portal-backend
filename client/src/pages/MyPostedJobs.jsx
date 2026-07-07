import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiUsers, FiEdit2, FiTrash2, FiInbox } from "react-icons/fi";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import { fetchMyPostedJobs, deleteJob } from "../features/jobs/jobSlice.js";

function MyPostedJobs() {
  const dispatch = useDispatch();
  const { myJobs, pagination, status } = useSelector((state) => state.job);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    dispatch(fetchMyPostedJobs({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleDelete = (jobId) => {
    dispatch(deleteJob(jobId));
    setConfirmId(null);
  };

  const handlePageChange = (page) => {
    dispatch(fetchMyPostedJobs({ page, limit: 10 }));
  };

  return(
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl sm:text-4xl">My posted jobs</h1>
        <Link
          to="/employer/jobs/new"
          className="btn-primary px-4 py-2.5 text-sm flex items-center gap-1.5"
        >
          <FiPlus size={15} /> Post job
        </Link>
      </div>

      {status === "loading" ? (
        <Spinner className="py-20" />
      ) : myJobs.length === 0 ? (
        <EmptyState
          icon={FiInbox}
          title="You haven't posted any jobs yet"
          description="Post your first job to start receiving applications."
          action={
            <Link to="/employer/jobs/new" className="btn-primary px-5 py-2.5 text-sm">
              Post a job
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {myJobs.map((job) => (
            <div key={job._id} className="border border-line p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-display text-lg truncate">{job.title}</h3>
                  <p className="text-xs font-mono text-gray-mid mt-1">
                    {job.location} · {job.jobType} · ₹{job.salary}
                  </p>
                  <p className="stamp text-gray-soft mt-2">
                    {job.applicationCount || 0} applicants
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    to={`/employer/jobs/${job._id}/applicants`}
                    className="btn-outline p-2.5"
                    title="View applicants"
                  >
                    <FiUsers size={15} />
                  </Link>
                  <button
                    onClick={() =>
                      setConfirmId(confirmId === job._id ? null : job._id)
                    }
                    className="btn-outline p-2.5 text-danger border-danger cursor-pointer"
                    title="Delete job"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
              {confirmId === job._id && (
                <div className="mt-4 pt-4 border-t border-dashed border-line flex items-center justify-between">
                  <p className="text-sm text-danger">
                    Delete this job and all its applications permanently?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-sm px-3 py-1.5 border border-line cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="text-sm px-3 py-1.5 bg-danger text-paper cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
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

export default MyPostedJobs;
