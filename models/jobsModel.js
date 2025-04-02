const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      maxlength: [50, "Company name can't be more than 50 letters"],
    },
    position: {
      type: String,
      required: [true, "Please provide a position"],
      maxlength: [100, "Position can't be more than 100 letters"],
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an user"],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("jobs", jobSchema);

module.exports = Job;
