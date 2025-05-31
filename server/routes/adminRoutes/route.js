const auth = require("../../middlewares/auth");
const express = require("express");
const router = express.Router();
const adminC = require("../../controllers/admin/controller");
const {
  isAdmin
} = require("../../middlewares/adminMiddleware");

// Admin Routes // Only Body Parameters
router.post("/assign-manager-role", auth, isAdmin, adminC.assignOrganizationAndManager);
router.put("/change-manager-role", auth, isAdmin, adminC.modifyUserOrganizationAndRole);
router.post("/assignCustomerRole", auth, isAdmin, adminC.assignCustomerRole);
router.get("/searchUsers", auth, isAdmin, adminC.searchUsers);
router.post("/searchOrganizations", auth, isAdmin, adminC.searchOrganizations);
router.get("/recent",auth, isAdmin, adminC.getRecentData);

module.exports = router;
