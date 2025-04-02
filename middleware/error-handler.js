const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors/customError");

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new BadRequestError(`Invalid data: ${errors.join(". ")}`);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : "unknown";
  return new BadRequestError(
    `Duplicate fields value: ${value}. Please use another value!`
  );
};

const handleCastErrorDB = (err) => {
  return new BadRequestError(`Invalid ${err.path}: ${err.value}`);
};

const sendErrorResponse = (err, res, isDev) => {
  const response = {
    status: err.status || "error",
    message: err.message || "Something went wrong",
  };
  if (isDev) {
    response.error = err;
    response.stack = err.stack;
  }
  res
    .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json(response);
};

module.exports = (err, req, res, next) => {
  let error = Object.create(Object.getPrototypeOf(err));
  Object.assign(error, err, { message: err.message });

  error.statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  error.status = error.status || "error";

  if (err.name === "ValidationError") error = handleValidationErrorDB(err);
  if (err.code === 11000) error = handleDuplicateErrorDB(err);
  if (err.name === "CastError") error = handleCastErrorDB(err);

  sendErrorResponse(error, res, process.env.NODE_ENV === "development");
};
