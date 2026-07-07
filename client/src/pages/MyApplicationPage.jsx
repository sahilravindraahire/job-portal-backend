import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiInbox } from "react-icons/fi";
import ApplicationCard from "../components/applications/ApplicationCard";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import {
  fetchMyApplication,
  withdrawApplication,
} from "../features/applications/applicationsSlice.js";

function MyApplicationPage() {
  const dispatch = useDispatch();
  const { myApplications, pagination, status } = useSelector(
    (state) => state.applications,
  );

  useEffect(() => {
    dispatch(fetchMyApplication({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleWithdraw = (applicationId) => {
    dispatch(withdrawApplication(applicationId));
  };

  const handlePageChange = (page) => {
    dispatch(fetchMyApplication({ page, limit: 10 }));
  };

  return(
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <p className="stamp text-gray-mid mb-2">{pagination.total || 0} total</p>
      <h1 className="font-display text-3xl sm:text-4xl mb-8">My applications</h1>

      {status === "loading" ? (
        <Spinner className="py-20" />
      ) : myApplications.length === 0 ? (
        <EmptyState
          icon={FiInbox}
          title="You haven't applied to anything yet"
          description="Browse open listings and apply in one click."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {myApplications.map((app) => (
            <ApplicationCard
              key={app._id}
              application={app}
              onWithdraw={handleWithdraw}
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

export default MyApplicationPage;
