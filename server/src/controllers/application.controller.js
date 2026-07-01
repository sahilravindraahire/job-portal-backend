import {Application} from "../models/application.model.js"
import { Company } from "../models/company.model.js"
import {Job} from "../models/job.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {sendResponseEmail} from "../utils/sendEmail.js"
import mongoose, {isValidObjectId, mongo} from "mongoose"

export const applyForJob = asyncHandler(async(req, res) => {
    const {jobId} = req.params

    if(!isValidObjectId(jobId)){
        throw new ApiError(400, "Invalid job ID")
    }

    if(req.user.role !== "employe"){
        throw new ApiError(403, "Only employees can apply for jobs")
    }

    const job = await Job.findById(jobId)

    if(!job){
        throw new ApiError(404, "Job not found")
    }

    if(job.postedBy.toString() === req.user._id.toString()){
        throw new ApiError(400, "You cannot apply to your own job posting")
    }

    const alreadyApplied = await Application.findOne({
        job: jobId,
        applicant: req.user._id
    })

    if(alreadyApplied){
        throw new ApiError(409, "You have already applied for this job")
    }

    const application = await Application.create({
        job: jobId,
        applicant: req.user._id
    })

    await Job.findByIdAndUpdate(jobId, {
        /*

        $addToSet instead of $push ===> 
        $push : Always adds the value, even if it's already present
        $addTOSet : Adds the value only if it doesn't already exist

        */
        $addToSet: {applications: application._id}
    })

    return res
    .status(201)
    .json(new ApiResponse(201, application, "Application submitted successfully"))
})

export const withdrawApplication = asyncHandler(async(req, res) => {
    const {applicationId} = req.params

    if(!isValidObjectId(applicationId)){
        throw new ApiError(400, "Invalid application ID")
    }

    const application = await Application.findById(applicationId)

    if(!application){
        throw new ApiError(404, "Application not found")
    }

    if(application.applicant.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You can only withdraw your own application")
    }

    if(application.status !== "pending"){
        throw new ApiError(400, `Cannot withdraw an application that is already ${application.status}`)
    }

    await Job.findByIdAndUpdate(application.job, {
        $pull: {applications: applicationId}
    })

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Application withdrawn successfully"))
})

export const getMyApplications = asyncHandler(async(req, res) => {
    if(req.user.role !== "employe"){
        throw new ApiError(403, "Only employees can view their applications")
    }

    const {status, page = 1, limit = 10} = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const matchStage = {applicant: new mongoose.Types.ObjectId(req.user._id)}

    if(status && ["pending", "accepted", "rejected"].includes(status)){
        matchStage.status = status
    }

    const [applications, total] = await Promise.all([
        Application.aggregate([
            {$match: matchStage},
            {
                $lookup: {
                    from: "jobs",
                    localField: "job",
                    foreignField: "_id",
                    as: "job",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "postedBy",
                                foreignField: "_id",
                                as: "postedBy",
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "companys",
                                            localField: "_id",
                                            foreignField: "userId",
                                            as: "company"
                                        }
                                    },
                                    {$unwind: {path: "$company", preserveNullAndEmptyArrays: true}},
                                    {$project: {fullName: 1, Company: {name: 1, compnayProfileImage: 1}}}
                                ]
                            }
                        },
                        {$unwind: {path: "$postedBy", preserveNullAndEmptyArrays: true}},
                        {$sort: {createdAt: -1}},
                        {$skip: skip},
                        {$limit: Number(limit)}
                    ]
                }
            }
        ]),
        Application.countDocuments(matchStage)
    ])

    return res.status(200)
    .json(new ApiResponse(200, {
        applications,
        pagination: {
            total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit))
        }
    }, "Your applications fetched"))
})

export const getJobApplicants = asyncHandler(async(req, res) => {
    const {jobId} = req.params

    if(!isValidObjectId(jobId)){
        throw ApiError(400, "Invalid job ID")
    }

    if(req.user.role !== "employer"){
        throw new ApiError(403, "Only employers can view applicants")
    }

    const job = await Job.findById(jobId)

    if(!job){
        throw new ApiError(404, "Job not found")
    }

    if(job.postedBy.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You can only view applicants for your own job")
    }

    const {status, page = 1, limit = 10} = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const matchStage = {job: new mongoose.Types.ObjectId(jobId)}

    if(status && ["pending", "accepted", "rejected"].includes(status)){
        matchStage.status = status
    }

    const [applications, total] = await Promise.all([
        Application.aggregate([
            {$match: matchStage},
            {
                $lookup: {
                    from: "users",
                    localField: "applicant",
                    foreignField: "_id",
                    as: "applicant",
                    pipeline: [
                        {$project: {password: 0, refreshToken: 0}}
                    ]
                }
            },
            {$unwind: {path: "$applicant", preserveNullAndEmptyArrays: true}},
            {$sort: {createdAt: -1}},
            {$skip: skip},
            {$limit: Number(limit)}
        ]),
        Application.countDocuments(matchStage)
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, {
        applications,
        pagination: {total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total/Number(limit))}
    }, "Applicants fetched successfully"))
})

export const updateApplicationStatus = asyncHandler(async(req, res) => {
    const {applicationId} = req.params
    const {status} = req.body

    if(!isValidObjectId(applicationId)){
        throw new ApiError(400, "Invalid application ID")
    }

    if(!["pending", "accepted", "rejected"].includes(status)){
        throw new ApiError(400, "status must be 'pending', 'accepted', or 'rejected'")
    }

    if(req.user.role !== "employer"){
        throw new ApiError(403, "Only employers can update application status")
    }

    const application = await Application.findById(applicationId).populate("job applicant")

    if(!application){
        throw new ApiError(404, "Application not found")
    }

    if(application.job.postedBy.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You can only update status for applicants on your own jobs")
    }

    application.status = status
    await application.save()

    if(status === "accepted"){
        const company = await Company.findOne({userId: req.user._id})

        await sendResponseEmail(
            application.applicant.email,
            application.applicant.fullName,
            company?.name || "The company"
        )
    }

    return res
    .status(200)
    .json(new ApiResponse(200, application, `Appliction ${status} successfully`))
})

export const getJobApplicationStats = asyncHandler(async(req, res) => {
    const {jobId} = req.params

    if(!isValidObjectId(jobId)){
        throw new ApiError(400, "Invalid job ID")
    }

    if(req.user.role !== "employer"){
        throw new ApiError(403, "Only employers can view stats")
    }

    const job = await Job.findById(jobId)

    if(!job){
        throw new ApiError(404, "Job not found")
    }

    if(job.postedBy.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Access denied")
    }

    const stats = await Application.aggregate([
        {$match: {job: new mongoose.Types.ObjectId(jobId)}},
        {
            $group: {
                _id: "$status",
                count: {$sum: 1}
            }
        }
    ])

    const formatted = {pending: 0, accepted: 0, rejected: 0}

    stats.forEach(({_id, count}) => {formatted[_id] = count})

    formatted.total = formatted.pending + formatted.accepted + formatted.rejected

    return res
    .status(200)
    .json(new ApiResponse(200, formatted, "Application stats fetched"))
})