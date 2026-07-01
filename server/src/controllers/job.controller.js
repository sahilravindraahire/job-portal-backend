import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { Application } from "../models/application.model.js";
import { Company } from "../models/company.model.js";
import mongoose, { isValidObjectId } from "mongoose";

export const postJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    salary,
    experienceLevel,
    location,
    jobType,
    vacencies,
  } = req.body;

  // if([title, description, salary, experienceLevel, location, jobType, vacencies].some((f) => f.undefined || f === "")){
  //     throw new ApiError(400, "All fields are required")
  // }

  if (
    [
      title,
      description,
      salary,
      experienceLevel,
      location,
      jobType,
      vacencies,
    ].some((field) => field === undefined || field === null || field === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (req.user.role !== "employer") {
    throw new ApiError(403, "Only employers can post jobs");
  }

  const company = await Company.findOne({ userId: req.user._id });

  if (!company) {
    throw new ApiError(403, "Register a company before posting jobs");
  }

  const parsedRequirements = Array.isArray(requirements)
    ? requirements
    : requirements
        ?.split(",")
        .map((r) => r.trim())
        .filter(Boolean) || [];

  const job = await Job.create({
    title,
    description,
    requirements: parsedRequirements,
    salary,
    experienceLevel,
    location,
    jobType,
    vacencies,
    postedBy: req.user._id,
    company: company._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, job, "Job posted successfully"));
});

export const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!isValidObjectId(jobId)) {
    throw new ApiError(400, "Invalid job ID");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this job");
  }

  const allowedFields = [
    "title",
    "description",
    "requirements",
    "salary",
    "experienceLevel",
    "location",
    "jobType",
    "vacencies",
  ];

  const updateFields = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateFields[field] = req.body[field];
    }
  }

  if (updateFields.requirements && !Array.isArray(updateFields.requirements)) {
    updateFields.requirements = updateFields.requirements
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
  }

  const updatedJob = await Job.findByIdAndUpdate(
    jobId,
    { $set: updateFields },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedJob, "Job updated successfully"));
});

export const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!isValidObjectId(jobId)) {
    throw new ApiError(400, "Invalid job ID");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this job");
  }

  await Application.deleteMany({ job: jobId });
  await Job.findByIdAndDelete(jobId);

  return res.status(200).json(new ApiResponse(200, "Job deleted successfully"));
});

/*

In getAllJobs

i need 2 things:

the actual jobs data
the total number of jobs matching the filters (for pagination)

*  const [jobs, totalCount] = ......  *

So you run both together using Promise.all():

*/

export const getAllJobs = asyncHandler(async (req, res) => {
  const {
    keyword,
    location,
    jobType,
    minSalary,
    maxSalary,
    experienceLevel,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const matchStage = {};

  if (keyword) {
    matchStage.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { requirements: { $elemMatch: { $regex: keyword, $options: "i" } } },
    ];
  }

  if (location) matchStage.location = { $regex: location, $options: "i" };

  if (jobType) matchStage.jobType = { $regex: jobType, $options: "i" };

  if (experienceLevel)
    matchStage.experienceLevel = { $lte: Number(experienceLevel) }; // $lte stands for "Less Than or Equal to"

  if (minSalary || maxSalary) {
    matchStage.salary = {};
    if (minSalary) matchStage.salary.$gte = Number(minSalary); // $gte stands for "greater than or equal to"
    if (maxSalary) matchStage.salary.$lte = Number(maxSalary);
  }

  const sortOrder = order === "asc" ? 1 : -1;

  const skip = (Number(page) - 1) * Number(limit);

  const [jobs, totalCount] = await Promise.all([
    Job.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "postedBy",
          foreignField: "_id",
          as: "postedBy",
          pipeline: [
            {
              $lookup: {
                from: "Companys",
                localField: "_id",
                foreignField: "userId",
                as: "company",
              },
            },
            { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                fullName: 1,
                email: 1,
                company: { name: 1, compnayProfileImage: 1, location: 1 },
              },
            },
          ],
        },
      },
      { $unwind: { path: "$postedBy", preserveNullAndEmptyArrays: true } },
      { $addFields: { applicationCount: { $size: "$applications" } } },
      { $project: { applications: 0 } },
      { $sort: { [sortBy]: sortOrder } },
      { $skip: skip },
      { $limit: Number(limit) },
    ]),
    Job.countDocuments(matchStage),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs,
        pagination: {
          total: totalCount,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(totalCount / Number(limit)),
        },
      },
      "Jobs fetched successfully",
    ),
  );
});

export const getJobById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (!isValidObjectId(jobId)) {
    throw new ApiError(400, "Invalid job ID");
  }

  const job = await Job.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(jobId) } },
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
              as: "company",
            },
          },
          { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
          { $project: { fullName: 1, email: 1, company: 1 } },
        ],
      },
    },
    { $unwind: { path: "$postedBy", preserveNullAndEmptyArrays: true } },
    { $addFields: { applicationCount: { $size: "$applications" } } },
    { $project: { applications: 0 } },
  ]);

  if (!job.length) {
    throw new ApiError(404, "Job not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, job[0], "Job fetched successfully"));
});

export const getMyPostedJobs = asyncHandler(async (req, res) => {
  if (req.user.role !== "employer") {
    throw new ApiError(403, "Only employers can access this");
  }

  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [jobs, total] = await Promise.all([
    Job.aggregate([
      { $match: { postedBy: new mongoose.Types.ObjectId(req.user._id) } },
      { $addFields: { applicationCount: { $size: "$applications" } } },
      { $project: { applications: 0 } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: Number(limit) },
    ]),
    Job.countDocuments({ postedBy: req.user._id }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        jobs,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      "Your posted jobs fetched",
    ),
  );
});
