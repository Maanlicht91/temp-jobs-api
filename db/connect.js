const mongoose = require("mongoose");

const connectDB = async (uri, password) => {
  const dbUri = uri.replace("<PASSWORD>", password);
  try {
    await mongoose.connect(dbUri, { dbName: "jobsapi" });
    console.log("✅Connected to MongoDB");
  } catch (err) {
    console.log("❌Failed to connect MongoDB");
    process.exit(1);
  }
};

module.exports = connectDB;
