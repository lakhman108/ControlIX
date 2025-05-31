const auth = require("../../middlewares/auth");
const express = require("express");
const router = express.Router();
const locationController = require("../../controllers/location/controller");
const {
  hasAccessToLocation,
  canAddOrDeleteLocation,
  hasAccessToLocationForOrganization
} = require("../../middlewares/locationMiddleware");

// Location Routes
router.post("/", auth, canAddOrDeleteLocation, locationController.addLocation);
router.delete("/:locationId", auth, canAddOrDeleteLocation, locationController.removeLocation);
router.put("/:locationId", auth, hasAccessToLocation, locationController.updateLocation);
router.get("/:locationId", auth, hasAccessToLocation, locationController.getLocation);
router.get("/organization/:organization", auth, hasAccessToLocationForOrganization, locationController.getLocationsByOrg);

module.exports = router;