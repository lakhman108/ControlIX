const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { hasAccessToOrganization, canManageOrganization } = require("../../middlewares/organizationMiddleware");
const organizationController = require("../../controllers/organization/controller");

// Create new organization (Admin only)
router.post("/", 
  auth, 
  canManageOrganization, 
  organizationController.createOrganization
);

// Get organization details with locations and devices
router.get("/:orgId", 
  auth, 
  hasAccessToOrganization, 
  organizationController.getOrganization
);

// Update organization (Admin only)
router.put("/:orgId", 
  auth, 
  canManageOrganization, 
  organizationController.updateOrganization
);

// Delete organization (Admin only)
router.delete("/:orgId", 
  auth, 
  canManageOrganization, 
  organizationController.deleteOrganization
);

// Get all organizations (Admin only)
router.get("/", 
  auth, 
  canManageOrganization, 
  organizationController.getAllOrganizations
);

module.exports = router;