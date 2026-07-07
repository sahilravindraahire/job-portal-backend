import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiSearch, FiUsers, FiBriefcase } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      keyword ? `/jobs?keyword=${encodeURIComponent(keyword)}` : "/jobs",
    );
  };

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-14 sm:pt-24 sm:pb-20">
        <p className="stamp text-gray-mid mb-4">Issue No. 001 — Now hiring</p>
        <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] max-w-3xl">
          The classifieds board for people who actually{" "}
          <span className="tag-highlight px-2">get hired.</span>
        </h1>
        <p className="text-gray-mid text-base sm:text-lg mt-6 max-w-xl">
          No noise, no algorithms guessing what you want. Just a straight list
          of open roles from employers who are actively reviewing applicants.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 mt-9 max-w-xl"
        >
          <div className="flex-1 flex items-center gap-2 border-1.5 border-ink px-4 py-3 bg-paper">
            <FiSearch size={18} className="text-gray-mid shrink-0" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Frontend engineer, designer, sales..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            className="btn-primary px-6 py-3 flex items-center justify-center gap-2"
          >
            Search jobs <FiArrowRight size={16} />
          </button>
        </form>
        <div className="flex flex-wrap gap-x-8 gap-y-3 mt-10 font-mono text-xs text-gray-mid">
          <span>NO SPAM APPLICATIONS</span>
          <span>·</span>
          <span>VERIFIED EMPLOYERS</span>
          <span>·</span>
          <span>DIRECT MESSAGING ON OFFER</span>
        </div>
      </section>

      <div className="border-t border-line" />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-2 gap-6">
        <div className="border border-line p-8 flex flex-col">
          <FiBriefcase size={26} className="mb-4" />
          <h2 className="font-display text-2xl mb-2">Looking for work</h2>
          <p className="text-gray-mid text-sm mb-6 flex-1">
            Browse open roles, apply in one click, and track every application
            from a single dashboard.
          </p>
          <Link to="/jobs" className="btn-outline px-5 py-2.5 text-sm w-fit">
            Browse listings
          </Link>
        </div>
        <div className="border border-line p-8 flex flex-col">
          <FiUsers size={26} className="mb-4" />
          <h2 className="font-display text-2xl mb-2">Hiring talent</h2>
          <p className="text-gray-mid text-sm mb-6 flex-1">
            Register your company, post a role in minutes, and manage every
            applicant without the clutter.
          </p>
          <Link to="/register" className="btn-outline px-5 py-2.5 text-sm w-fit">
            Post a job
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
