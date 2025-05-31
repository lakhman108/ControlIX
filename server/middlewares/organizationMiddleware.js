const Organization = require("../models/organization");

const hasAccessToOrganization = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const user = req.rootUser;

    // Admin and helper have access to all organizations
    if (["admin", "helper"].includes(user.role)) {
      const organization = await Organization.findById(orgId);
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }
      req.organization = organization;
      return next();
    }

    // Other users can only access their own organization
    if (user.organization.toString() !== orgId) {
      return res.status(403).json({ error: "Not allowed to access this organization" });
    }

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return res.status(404).json({ error: "Organization not found" });
    }

    req.organization = organization;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const canManageOrganization = async (req, res, next) => {
  try {
    const user = req.rootUser;

    if (!["admin"].includes(user.role)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports = {
  hasAccessToOrganization,
  canManageOrganization,
};