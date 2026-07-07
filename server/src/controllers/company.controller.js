import {Company} from "../models/company.model.js"
import {Job} from "../models/job.model.js"
import {Application} from "../models/application.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js"
import mongoose, {isValidObjectId} from "mongoose"

export const registerCompany = asyncHandler(async(req, res) => {
    const {name, description, location, website} = req.body

    if(!name?.trim()){
        throw new ApiError(400, "Company name is required")
    }

    if(req.user.role !== "employer"){
        throw new ApiError(403, "Only employers can register a company")
    }

    const existing = await Company.findOne({userId: req.user._id})

    if(existing){
        throw new ApiError(409, "You already have a registered company")
    }

    const nameConflict = await Company.findOne({
        name: {$regex: `^${name.trim()}$`, $options: "i"}
    })

    if(nameConflict){
        throw new ApiError(409, "A company with this name already exists")
    }

    let companyProfileImage = ""
    let companyProfileImagePublicId = ""

    if(req.file){
        const uploadRes = await uploadOnCloudinary(req.file.path)

        if(!uploadRes){
            throw new ApiError(500, "Failed to upload company image")
        }

        companyProfileImage = uploadRes.secure_url
        companyProfileImagePublicId = uploadRes.public_id
    }

    const company = await Company.create({
        name: name.trim(),
        description: description || "",
        location: location || "",
        website: website || "",
        companyProfileImage,
        companyProfileImagePublicId,
        userId: req.user._id
    })

    await User.findByIdAndUpdate(req.user._id, {$set: {company: company._id}})

    return res
    .status(200)
    .json(new ApiResponse(201, company, "Company registered successfully"))
})

export const updateCompany = asyncHandler(async(req, res) => {
    const {companyId} = req.params

    if(!isValidObjectId(companyId)){
        throw new ApiError(400, "Invalid company ID")
    }

    if(req.user.role !== "employer"){
        throw new ApiError(403, "Only employers can update company details")
    }

    const company = await Company.findById(companyId)

    if(!company){
        throw new ApiError(404, "Company not found")
    }

    if(company.userId.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this company")
    }

    const {description, location, website} = req.body

    const updateFields = {}

    if(description !== undefined) updateFields.description = description

    if(location !== undefined) updateFields.location = location

    if(website !== undefined) updateFields.website =  website

    if(req.file){
        if(company.companyProfileImagePublicId){
            await deleteFromCloudinary(company.companyProfileImagePublicId)
        }

        const uploadRes = await uploadOnCloudinary(req.file.path)

        if(!uploadRes){
            throw new ApiError(500, "Failed to upload company image")
        }

        updateFields.companyProfileImage = uploadRes.secure_url
        updateFields.companyProfileImagePublicId = uploadRes.public_id
    }

    const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        {$set: updateFields},
        {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedCompany, "Company updated successfully"))
})

export const deleteCompany = asyncHandler(async(req, res) => {
    const {companyId} = req.params

    if(!isValidObjectId(companyId)){
        throw new ApiError(400, "Invalid company ID")
    }

    if(req.user.role !== "employer"){
        throw new ApiError(403, "Only employers can delete a company")
    }

    const company = await Company.findById(companyId)

    if(!company){
        throw new ApiError(404, "Company not found")
    }

    if(company.userId.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this company")
    }

    const jobs = await Job.find({postedBy: req.user._id}).select("_id")

    const jobIds = jobs.map((j) => j._id)

    if(jobIds.length){
        await Application.deleteMany({job: {$in: jobIds}})
        await Job.deleteMany({postedBy: req.user._id})
    }

    if(company.companyProfileImagePublicId){
        await deleteFromCloudinary(company.companyProfileImagePublicId)
    }

    await Company.findByIdAndDelete(companyId)

    await User.findByIdAndUpdate(req.user._id, {$unset: {company: 1}})

    return res
    .status(200)
    .json(new ApiResponse(200, null, "Company deleted successfully"))
})

export const getMyCompany = asyncHandler(async(req, res) => {
    if(req.user.role !== "employer"){
        throw new ApiError(403, "Only employers can access this")
    }

    const company = await Company.findOne({userId: req.user._id})

    if(!company){
        throw new ApiError(404, "No company registered yet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, company, "Company details fetched"))
})

// export const getCompanyById = asyncHandler(async(req, res) => {
//     const {companyId} = req.params

//     if(!isValidObjectId(companyId)){
//         throw new ApiError(400, "Invalid company ID")
//     }

//     const company = await Company.aggregate([
//         {$match: {_id: new  mongoose.Types.ObjectId(companyId)}},
//         {
//             $lookup: {
//                 from: "users",
//                 localField: "userId",
//                 foreignField: "_id",
//                 as: "owner",
//                 pipeline: [
//                     {$project: {fullName: 1, email: 1, profileImage: 1}}
//                 ]
//             }
//         },
//         {$unwind: {path: "$owner", preserveNullAndEmptyArrays: true}},
//         {
//             $lookup: {
//                 form: "jobs",
//                 localField: "userId",
//                 foreignField: "postedBy",
//                 as: "activeJobs",
//                 pipeline: [
//                     {$project: {title: 1, location: 1, jobType: 1, salary: 1, createdAt: 1}},
//                     {$sort: {createdAt: -1}},
//                     {$limit: 5}
//                 ]
//             }
//         },
//         {$addFields: {totalJobs: {$size: "$activeJobs"}}}
//     ])

//     if(!company.length){
//         throw new ApiError(404, "Company not found")
//     }

//     return res
//     .status(200)
//     .json(new ApiResponse(200, company[0], "Company fetched successfully"))
// })

export const getCompanyById = asyncHandler(async(req, res) => {
    const {companyId} = req.params

    if(!isValidObjectId(companyId)){
        throw new ApiError(400, "Invalid company ID")
    }

    const company = await Company.findById(companyId)

    if(!company){
        throw new ApiError(404, "Company not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, company, "Company fetched successfully"))
})

export const getAllCompanies = asyncHandler(async(req, res) => {
    const {keyword, location, page = 1, limit = 10} = req.query

    const skip = (Number(page) - 1) * Number(limit)

    const matchStage = {}

    if(keyword) matchStage.name = {$regex: keyword, $options: "i"}
    if(location) matchStage.location = {$regex: location, $options: "i"}

    const [companies, total] = await Promise.all([
        Company.aggregate([
            {$match: matchStage},
            {
                $lookup: {
                    from: "jobs",
                    localField: "userId",
                    foreignField: "postedBy",
                    as: "jobs"
                }
            },
            {$addFields: {jobcount: {$size: "$jobs"}}},
            {$project: {jobs: 0}},
            {$sort: {createdAt: -1}},
            {$skip: skip},
            {$limit: Number(limit)}
        ]),
        Company.countDocuments(matchStage)
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, {
        companies,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total/Number(limit))
        }
    }, "Companies fetched successfully"))
})

export const getEmployerDashboard = asyncHandler(async(req, res) => {
    if(req.user.role !== "employer"){
        throw new ApiError(403, "Only employers can access the dashboard")
    }

    const employerId = new mongoose.Types.ObjectId(req.user._id)

    const [company, jobStats, applicationStats, recentApplications] = await Promise.all([
        Company.findOne({userId: req.user._id}),

        Job.aggregate([
            {$match: {postedBy: employerId}},
            {
                $group: {
                    _id: null,
                    totalJobs: {$sum: 1},
                    totalVacencies: {$sum: "$vacencies"},
                    totalApplications: {$sum: {$size: "$applications"}}
                }
            }
        ]),
        Application.aggregate([
            {
                $lookup: {
                    from: "jobs",
                    localField: "job",
                    foreignField: "_id",
                    as: "job"
                }
            },
            {$unwind: "$job"},
            {$match : {"job.postedBy": employerId}},
            {$group: {_id: "$status", count: {$sum: 1}}}
        ]),
        Application.aggregate([
            {
                $lookup: {
                    from: "jobs",
                    localField: "job",
                    foreignField: "_id",
                    as: "job"
                }
            },
            {$unwind: "$job"},
            {$match: {"job.postedBy": employerId}},
            {
                $lookup: {
                    from: "users",
                    localField: "applicant",
                    foreignField: "_id",
                    as: "applicant",
                    pipeline: [
                        {$project: {fullName: 1, email: 1, profileImage: 1, skills: 1, resume: 1}}
                    ]
                }
            },
            {$unwind: "$applicant"},
            {$sort: {createdAt: -1}},
            {$limit: 5},
            {$project: {"job.applications": 0}}
        ])
    ])

    const statusMap = {pending: 0, accepted: 0, rejected: 0}

    applicationStats.forEach(({_id, count}) => {statusMap[_id] = count})

    const stats = jobStats[0] || {totalJobs: 0, totalVacencies: 0, totalApplications: 0}

    return res
    .status(200)
    .json(new ApiResponse(200, {
        company,
        stats: {...stats, applicationsByStatus: statusMap},
        recentApplications
    }, "Dashboard data fetched"))
})