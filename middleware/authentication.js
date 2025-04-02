const { UnauthenticatedError } = require("../errors/customError");
const catchAsync = require("../middleware/catchAsync");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");

const protectRoute = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    return next(
      new UnauthenticatedError("Please log in to access this route.")
    );
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userID).select("-password");
    req.user = user;
    next();
  } catch (err) {
    return next(new UnauthenticatedError("Authentication invalid"));
  }
});

module.exports = protectRoute;
