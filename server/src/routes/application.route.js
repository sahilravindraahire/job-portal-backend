import express from "express"
import {verifyJwt} from "../middleware/auth.middleware.js"
import {applyForJob, withdrawApplication, getMyApplications, getJobApplicants, updateApplicationStatus, getJobApplicationStats} from "../controllers/application.controller.js"

const applicationRouter = express.Router()

applicationRouter.post("/:jobId/apply", verifyJwt, applyForJob)
applicationRouter.delete("/:applicationId/withdraw", verifyJwt, withdrawApplication)
applicationRouter.get("/my-applications", verifyJwt, getMyApplications)
applicationRouter.get("/job/:jobId/applicants", verifyJwt, getJobApplicants)
applicationRouter.patch("/:applicationId/status", verifyJwt, updateApplicationStatus)
applicationRouter.get("/job/:jobId/stats", verifyJwt, getJobApplicationStats)

export default applicationRouter