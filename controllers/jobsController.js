const Job = require("../models/jobsModel");
const catchAsync = require("../middleware/catchAsync");
const { StatusCodes } = require("http-status-codes");
const {
  NotFoundError,
  UnauthenticatedError,
  BadRequestError,
} = require("../errors/customError");

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.find({ createdBy: req.user.id }).sort("createdAt");
  res.status(StatusCodes.OK).json({
    status: "success",
    nbHits: jobs.length,
    jobs,
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  //-- Method 1
  // const {
  //   user: userId,
  //   params: { id: jobId },
  // } = req;
  // const job = await Job.findOne({ _id: jobId, createdBy: userId });

  //-- Method 2 -security (restrict jobs to their owners)
  const job = await Job.findById(req.params.id);
  if (job.createdBy.toString() !== req.user) {
    return next(new UnauthenticatedError("Not allowed to view this job"));
  }
  if (!job) {
    return next(new NotFoundError("There is no matched job!"));
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    job,
  });
});

exports.createJob = catchAsync(async (req, res, next) => {
  const job = await Job.create({ createdBy: req.user.id, ...req.body });
  res.status(StatusCodes.CREATED).json({
    status: "success",
    job,
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const { company, position } = req.body;
  //-- Checking for front-end part
  //-- Convert null/undefined to empty string
  if (company?.trim() === "" || position?.trim() === "") {
    return next(
      new BadRequestError("Company or position fields cannot be empty")
    );
  }
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (job.createdBy.toString() !== req.user) {
    return next(new UnauthenticatedError("Not allowed to update this job!"));
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    job,
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    return next(new NotFoundError("There is no matched job!"));
  }
  if (job.createdBy.toString() !== req.user) {
    return next(new UnauthenticatedError("Not allowed to delete this job!"));
  }
  res.status(StatusCodes.OK).json({
    status: "success",
  });
});
