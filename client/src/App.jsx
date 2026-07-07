import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import MainLayout from "./components/layout/MainLayout"
import ProtectedRoute from "./routes/ProtectedRoute"
import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import VerifyOtpPage from "./pages/VerifyOtpPage"
import LoginPage from "./pages/LoginPage"
import JobsListPage from "./pages/JobListPage"
import JobDetailPage from "./pages/JobDetailPage"
import CompaniesListPage from "./pages/CompaniesListPage"
import CompanyDetailPage from "./pages/CompanyDetailsPage"
import ProfilePage from "./pages/ProfilePage"
import MyApplicationsPage from "./pages/MyApplicationPage"
import EmployerDashboardPage from "./pages/EmployerDashBoardPage"
import CompanyRegisterPage from "./pages/CompanyRegisterPage"
import PostJobPage from "./pages/PostJobPage"
import MyPostedJobsPage from "./pages/MyPostedJobs"
import JobApplicantsPage from "./pages/JobApplicantPage"
import NotFoundPage from "./pages/NotFoundPage"
import {fetchProfile, setCredentialFromStorage} from "./features/auth/authSlice.js"

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCredentialFromStorage());
    if (localStorage.getItem("accessToken")) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-otp" element={<VerifyOtpPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="jobs" element={<JobsListPage />} />
        <Route path="jobs/:jobId" element={<JobDetailPage />} />
        <Route path="companies" element={<CompaniesListPage />} />
        <Route path="companies/:companyId" element={<CompanyDetailPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["employe"]} />}>
          <Route path="my-applications" element={<MyApplicationsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["employer"]} />}>
          <Route path="employer/dashboard" element={<EmployerDashboardPage />} />
          <Route path="employer/company/register" element={<CompanyRegisterPage />} />
          <Route path="employer/jobs" element={<MyPostedJobsPage />} />
          <Route path="employer/jobs/new" element={<PostJobPage />} />
          <Route path="employer/jobs/:jobId/applicants" element={<JobApplicantsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
