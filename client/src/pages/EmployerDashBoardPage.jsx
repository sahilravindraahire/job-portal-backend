import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiBriefcase,
  FiUsers,
  FiCheckCircle,
  FiPlus,
  FiInbox,
} from "react-icons/fi";
import StatCard from "../components/company/StatCard";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import {fetchEmployerDashboard} from "../features/company/companySlice.js";

function EmployerDashBoardPage() {
  const dispatch = useDispatch();

  const { dashboard, status, hasCompany, error } = useSelector(
    (state) => state.company
  );

  useEffect(() => {
    dispatch(fetchEmployerDashboard());
  }, [dispatch]);

  if (status === "loading" && !dashboard) {
    return <Spinner className="py-24" />;
  }

  if (status === "succeeded" && !dashboard?.company) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState
          icon={FiBriefcase}
          title="Register your company first"
          description="You'll need a company profile before you can post jobs and view your dashboard."
          action={
            <Link
              to="/employer/company/register"
              className="btn-primary px-5 py-2.5 text-sm"
            >
              Register company
            </Link>
          }
        />
      </div>
    );
  }

  const { company, stats, recentApplications } = dashboard || {};

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="stamp text-gray-mid mb-1">{company?.name}</p>
          <h1 className="font-display text-3xl sm:text-4xl">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/employer/jobs" className="btn-outline px-4 py-2.5 text-sm">
            My jobs
          </Link>
          <Link
            to="/employer/jobs/new"
            className="btn-primary px-4 py-2.5 text-sm flex items-center gap-1.5"
          >
            <FiPlus size={15} /> Post job
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total jobs"
          value={stats?.totalJobs || 0}
          icon={FiBriefcase}
        />
        <StatCard
          label="Applications"
          value={stats?.totalApplications || 0}
          icon={FiInbox}
        />
        <StatCard
          label="Accepted"
          value={stats?.applicationsByStatus?.accepted || 0}
          icon={FiCheckCircle}
        />
        <StatCard
          label="Pending review"
          value={stats?.applicationsByStatus?.pending || 0}
          icon={FiUsers}
        />
      </div>

      <h2 className="font-display text-xl mb-4">Recent applicants</h2>
      {!recentApplications?.length ? (
        <EmptyState
          icon={FiInbox}
          title="No applications yet"
          description="Once candidates start applying, they'll show up here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {recentApplications.map((app) => (
            <div
              key={app._id}
              className="border border-line p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {app.applicant?.fullName}
                </p>
                <p className="text-xs text-gray-mid truncate">
                  Applied for {app.job?.title}
                </p>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployerDashBoardPage;
