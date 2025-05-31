const express = require("express");
const router = express.Router();

const userR = require("../routes/userRoutes/route");
const deviceR = require("../routes/deviceRoutes/route");
const locationR = require("../routes/locationRoutes/route");
const adminR = require("../routes/adminRoutes/route");
const organizationR = require("../routes/organizationRoutes/route")
router.use("/user", userR);
router.use("/device", deviceR);
router.use("/location", locationR);
router.use("/admin", adminR);
router.use("/organization", organizationR);
module.exports = router;
