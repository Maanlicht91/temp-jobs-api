require("dotenv").config({ path: "./config.env" });
const morgan = require("morgan");
const connectDB = require("./db/connect");
const express = require("express");
const authRouter = require("./routes/authRoutes");
const jobsRouter = require("./routes/jobsRoutes");

//-- Extra security
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss");
const { rateLimit } = require("express-rate-limit");

const app = express();

//-- Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//-- Error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//-- Middlewares
app.use(express.json(), (req, res, next) => {
  //-- Sanitize all incoming request body fields
  for (let key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = xss(req.body[key]);
    }
  }
  next();
});
app.use(helmet()); //-- Set Security HTTP headers
app.use(cors());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  message: "Too many request from this IP. Please try again in a hour!",
});
app.use("/api", limiter); //-- Limit requests from same API
// extra packages

//-- Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//-- Server start
const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.DATABASE, process.env.DATABASE_PASSWORD);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
