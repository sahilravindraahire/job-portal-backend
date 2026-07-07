import React from "react";
import { useSelector } from "react-redux";

function useAuth() {
  const { user, isAuthenticated, status } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    isLoading: status === "loading",
    role: user?.role,
    isEmployer: user?.role === "employer",
    isEmployee: user?.role === "employe",
  };
}

export default useAuth;
