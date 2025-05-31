const Location = require("../models/location");

const hasAccessToLocation = async (req, res, next) => {
  try {
    const { locationId } = req.params;
    const user = req.rootUser;

    // Admin and helper have access to all locations
    if (["admin", "helper"].includes(user.role)) {
      const location = await Location.findById(locationId);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      req.location = location;
      return next();
    }

    // Other users can only access locations in their organization
    const location = await Location.findOne({
      _id: locationId,
      organization: user.organization,
    });

    if (!location) {
      return res.status(403).json({ error: "Not allowed to access this location" });
    }

    req.location = location;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};
const hasAccessToLocationForOrganization = async (req, res, next) => {
  try {
    const { organization } = req.params;
    const user = req.rootUser;

    // Admin and helper have access to all locations
    if (["admin", "helper"].includes(user.role)) {
      return next();
    }
    if(user.organization != organization){
      return res.status(403).json({ error: "Not allowed to access these resources" });   
     }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};
const canAddOrDeleteLocation = async (req, res, next) => {
  try {
    const user = req.rootUser;

    if (!["admin", "helper"].includes(user.role)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports = {
  hasAccessToLocationForOrganization,
  hasAccessToLocation,
  canAddOrDeleteLocation,
};