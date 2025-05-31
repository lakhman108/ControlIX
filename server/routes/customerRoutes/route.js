const auth = require("../../middlewares/auth");
const express = require("express");
const router = express.Router();
const customerController = require("../../controllers/customer/controller");
const Location = require("../../models/location");
const hasAccessToManagerCustomer = async (req, res, next) => {
  try {
    const user = req.rootUser;

    // Admin and helper have access to all locations
    if (["admin", "helper"].includes(user.role)) {
      return next();
    }
    if (user.role != "manager") {
      return res.status(403).json({ error: "Not allowed to access these resources" });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

// create function of has access of location where we have the location id in the req.body and then we will get location object and then we will chck organizatoin from location.organization and req.rootUSerrorganization
const hasAccessToLocation = async (req, res, next) => {
  try {
    const { locationId } = req.body;
    const location = await Location.findById(locationId);
    if (!location) return res.status(404).json({ error: 'Location not found' });
    if (["admin", "helper"].includes(req.rootUser.role)) {
      return next();
    }
    if (location.organization.toString() != req.rootUser.organization.toString()) {
      return res.status(403).json({ error: "Not allowed to access these resources" });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
}
// Guest Routes
router.post("/", auth, hasAccessToManagerCustomer, hasAccessToLocation, customerController.createCustomer);
router.delete("/:customerId", auth, hasAccessToManagerCustomer, hasAccessToLocation, customerController.deleteCustomer);
router.put("/:customerId", auth, hasAccessToManagerCustomer, hasAccessToLocation, customerController.updateCustomer);

module.exports = router;