const { Router } = require("express");
const protectRoute = require("../middleware/authentication");
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobsController");

const router = Router();

router.use(protectRoute);

router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);
router.route("/").get(getAllJobs).post(createJob);

module.exports = router;
