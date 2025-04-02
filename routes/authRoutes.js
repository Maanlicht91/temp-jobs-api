const { Router } = require("express");
const { register, login, dashboard } = require("../controllers/authController");
const protectRoute = require("../middleware/authentication");

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/dashboard").get(protectRoute, dashboard);

module.exports = router;
