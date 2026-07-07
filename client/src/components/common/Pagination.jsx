import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="stamp flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:opacity-70"
      >
        <FiChevronLeft size={14} /> Prev
      </button>
      <span className="font-mono text-sm">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="stamp flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:opacity-70"
      >
        Next <FiChevronRight size={14} />
      </button>
    </div>
  );
}

export default Pagination;
