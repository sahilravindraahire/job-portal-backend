import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch, FiInbox } from "react-icons/fi";
import CompanyCard from "../components/company/CompanyCard";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import { fetchAllCompanies } from "../features/company/companySlice.js";

function CompaniesListPage() {
  const dispatch = useDispatch();
  const { companies, pagination, status } = useSelector(
    (state) => state.company,
  );
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    dispatch(fetchAllCompanies({ page: 1, limit: 12 }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchAllCompanies({ keyword, page: 1, limit: 12 }));
  };

  const handlePageChange = (page) => {
    dispatch(fetchAllCompanies({ keyword, page, limit: 12 }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-3xl sm:text-4xl mb-8">
        Companies hiring
      </h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-md">
        <div className="flex-1 flex items-center gap-2 input-field px-3.5 py-2.5">
          <FiSearch size={16} className="text-gray-mid" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search companies"
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
        <button type="submit" className="btn-primary px-4 py-2.5 text-sm">
          Search
        </button>
      </form>

      {status === "loading" ? (
        <Spinner className="py-20" />
      ) : companies.length === 0 ? (
        <EmptyState icon={FiInbox} title="No companies found" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <CompanyCard key={company._id} company={company} />
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

export default CompaniesListPage;
