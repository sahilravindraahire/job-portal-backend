import React from 'react'
import {Link} from "react-router-dom"

function Footer() {
  return (
    <footer className="border-t border-line mt-20">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row justify-between gap-6">
      <div>
        <p className="font-display text-lg">
          JOB<span className="tag-highlight px-1">POST</span>
        </p>
        <p className="text-gray-mid text-sm mt-2 max-w-xs">
          A classifieds-style board connecting employers and job seekers,
          nothing more, nothing less.
        </p>
      </div>
      <div className="flex gap-10">
        <div className="flex flex-col gap-2 text-sm">
          <span className="stamp text-gray-soft mb-1">Browse</span>
          <Link to="/jobs" className="hover:opacity-70">
            Listings
          </Link>
          <Link to="/companies" className="hover:opacity-70">
            Companies
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="stamp text-gray-soft mb-1">Account</span>
          <Link to="/login" className="hover:opacity-70">
            Log in
          </Link>
          <Link to="/register" className="hover:opacity-70">
            Sign up
          </Link>
        </div>
      </div>
    </div>
    <div className="border-t border-line">
      <p className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-gray-soft font-mono">
        © {new Date().getFullYear()} JobPost. Built for demonstration purposes.
      </p>
    </div>
  </footer>
  )
}

export default Footer
