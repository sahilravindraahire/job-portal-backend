import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiMenu, FiX, FiUser, FiLogOut, FiGrid } from "react-icons/fi";
import useAuth from "../../hooks/useAuth.js";
import { logoutUser } from "../../features/auth/authSlice.js";

const navLinkClass = ({ isActive }) =>
  `stamp px-1 pb-1 border-b-2 transition-colors ${
    isActive
      ? "border-ink text-ink"
      : "border-transparent text-gray-mid hover:text-ink"
  }`;

function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isEmployer, user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-paper border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="font-display text-xl tracking-tight">
          JOB<span className="tag-highlight px-1">POST</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/jobs" className={navLinkClass}>
            Listings
          </NavLink>
          <NavLink to="/companies" className={navLinkClass}>
            Companies
          </NavLink>
          {isAuthenticated && isEmployer && (
            <NavLink to="/employer/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
          {isAuthenticated && !isEmployer && (
            <NavLink to="/my-applications" className={navLinkClass}>
              My Applications
            </NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm font-medium hover:opacity-70"
              >
                <FiUser size={16} />
                {user?.fullName?.split(" ")[0] || "Profile"}
              </Link>
              <button
                onClick={handleLogout}
                className="btn-outline flex items-center gap-2 px-3.5 py-2 text-sm cursor-pointer"
              >
                <FiLogOut size={14} />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="stamp text-gray-mid hover:text-ink">
                Log in
              </Link>
              <Link to="/register" className="btn-primary px-4 py-2 text-sm">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 cursor-pointer"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-paper animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-4">
            <NavLink
              to="/jobs"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Listings
            </NavLink>
            <NavLink
              to="/companies"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Companies
            </NavLink>
            {isAuthenticated && isEmployer && (
              <NavLink
                to="/employer/dashboard"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavLink>
            )}
            {isAuthenticated && !isEmployer && (
              <NavLink
                to="/my-applications"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                My Applications
              </NavLink>
            )}
            <div className="h-px bg-line my-1" />
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-sm font-medium"
                  onClick={() => setOpen(false)}
                >
                  <FiUser size={16} /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-danger cursor-pointer"
                >
                  <FiLogOut size={16} /> Log out
                </button>
              </>
            ) : (
              <>
              <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="btn-primary px-4 py-2.5 text-sm text-center"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
