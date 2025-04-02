const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../middleware/catchAsync");
const User = require("../models/usersModel");
const {
  UnauthenticatedError,
  BadRequestError,
} = require("../errors/customError");

exports.register = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    status: "success",
    user,
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //-- Check if password and email exists
  if (!email || !password) {
    return next(new BadRequestError("Please provide email or password!"));
  }
  const user = await User.findOne({ email });
  //-- Check if user exists
  if (!user) {
    return next(new UnauthenticatedError("Invalid Credientals"));
  }
  //-- Compare password and verify
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new UnauthenticatedError("Invalid Crediental"));
  }
  //-- Generate token
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    status: "success",
    user: { name: user.username },
    token,
  });
});

exports.dashboard = (req, res, next) => {
  res.send(`Hello ${req.user.username}`);
};
