import express from "express"
import {verifyJwt} from "../middleware/auth.middleware.js"
import {postJob, updateJob, deleteJob, getAllJobs, getJobById, getMyPostedJobs} from "../controllers/job.controller.js"

const jobRouter = express.Router()

jobRouter.post("/", verifyJwt, postJob)
jobRouter.patch("/:jobId", verifyJwt, updateJob)
jobRouter.delete("/:jobId", verifyJwt, deleteJob)
jobRouter.get("/", getAllJobs)
jobRouter.get("/:jobId", getJobById)
jobRouter.get("/employer/my-jobs", verifyJwt, getMyPostedJobs)

export default jobRouter