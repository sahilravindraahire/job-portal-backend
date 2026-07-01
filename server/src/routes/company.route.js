import express from "express"
import {verifyJwt} from "../middleware/auth.middleware.js"
import {upload} from "../middleware/multer.middleware.js"
import {registerCompany, updateCompany, deleteCompany, getMyCompany, getCompanyById, getAllCompanies, getEmployerDashboard} from "../controllers/company.controller.js"

const companyRouter = express.Router()

companyRouter.post("/register", verifyJwt, upload.single("companyProfileImage"), registerCompany)
companyRouter.patch("/:companyId", verifyJwt, upload.single("companyProfileImage"), updateCompany)
companyRouter.delete("/:companyId", verifyJwt, deleteCompany)
companyRouter.get("/employer/my-company", verifyJwt, getMyCompany)
companyRouter.get("/:companyId", getCompanyById)
companyRouter.get("/", getAllCompanies)
companyRouter.get("/employer/dashboard", verifyJwt, getEmployerDashboard)

export default companyRouter