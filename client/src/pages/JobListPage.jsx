import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { FiInbox } from "react-icons/fi";
import JobCard from "../components/jobs/JobCard";
import JobFilterBar from "../components/jobs/JobFilterBar";
import Pagination from "../components/common/Pagination";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import {
  fetchAllJobs,
  setFilters,
  resetFilters,
} from "../features/jobs/jobSlice.js";

function JobListPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { jobs, filters, pagination, status } = useSelector(
    (state) => state.job,
  );

  const page = Number(searchParams.get("page")) || 1;

  const queryParams = useMemo(
    () => ({
      ...filters,
      keyword: searchParams.get("keyword") || filters.keyword,
      page,
      limit: 10,
    }),
    [filters, searchParams, page],
  );

  useEffect(() => {
    dispatch(fetchAllJobs(queryParams));
  }, [queryParams.keyword, queryParams.location, queryParams.jobType, queryParams.minSalary, queryParams.maxSalary, queryParams.experienceLevel, page]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    setSearchParams({ page: "1" });
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const params = Object.fromEntries(searchParams);
    setSearchParams({ ...params, page: String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return(
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <p className="stamp text-gray-mid mb-2">
        {pagination.total || 0} listings found
      </p>
      <h1 className="font-display text-3xl sm:text-4xl mb-8">Open positions</h1>

      <JobFilterBar filters={filters} onChange={handleFilterChange} onReset={handleReset} />

      <div className="mt-8">
        {status === "loading" ? (
          <Spinner className="py-20" />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={FiInbox}
            title="No listings match your search"
            description="Try widening your filters or searching a different keyword."
          />
        ) : (
          <div>
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default JobListPage;
