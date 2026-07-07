import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiMapPin, FiGlobe } from "react-icons/fi";
import Spinner from "../components/common/Spinner"
import {fetchCompanyById} from "../features/company/companySlice.js"

function CompanyDetailsPage() {

    const { companyId } = useParams();
    const dispatch = useDispatch();
    const { currentCompany, status } = useSelector((state) => state.company);

    useEffect(() => {
    dispatch(fetchCompanyById(companyId));
  }, [companyId, dispatch]);

  if (status === "loading" || !currentCompany) {
    return <Spinner className="py-24" />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 shrink-0 rounded-full bg-paper-dim border border-line flex items-center justify-center font-display text-xl overflow-hidden">
          {currentCompany.companyProfileImage ? (
            <img
              src={currentCompany.companyProfileImage}
              alt={currentCompany.name}
              className="w-full h-full object-cover"
            />
          ) : (
            currentCompany.name?.[0]?.toUpperCase()
          )}
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">{currentCompany.name}</h1>
          {currentCompany.location && (
            <p className="flex items-center gap-1.5 text-sm text-gray-mid mt-1">
              <FiMapPin size={13} /> {currentCompany.location}
            </p>
          )}
        </div>
      </div>

      {currentCompany.website && (
        <a
          href={currentCompany.website}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm underline underline-offset-2 mb-6 w-fit"
        >
          <FiGlobe size={13} /> {currentCompany.website}
        </a>
      )}

      {currentCompany.description && (
        <p className="text-sm text-gray-mid leading-relaxed">
          {currentCompany.description}
        </p>
      )}
    </div>
  )
}

export default CompanyDetailsPage
