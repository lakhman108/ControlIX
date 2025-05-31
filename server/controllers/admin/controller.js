const User = require("../../models/user");
const Organization = require("../../models/organization");
const Device = require("../../models/device");
const Location = require("../../models/location");
const { CustomError } = require("../../models/customError");
const mongoose = require("mongoose");
const { addDataToLogs, ActivityTypes } = require("../log/controller");

// Assign organization and set role as manager
const assignOrganizationAndManager = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, organizationId } = req.body;

    if (!userId || !organizationId) {
      throw new CustomError("User ID and Organization ID are required", 400);
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const organization = await Organization.findById(organizationId).session(session);
    if (!organization) {
      throw new CustomError("Organization not found", 404);
    }

    user.organization = organizationId;
    user.role = "manager";
    await user.save({ session });

    await addDataToLogs(
      ActivityTypes.ADMIN_ASSIGN_MANAGER,
      user._id,
      `Admin assigned manager role to user ${user.email} for organization ${organization.name}`,
      session,
      req.userId
    );

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "User assigned to organization as manager successfully",
      data: user.getPublicProfile(),
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Modify user organization and role
const modifyUserOrganizationAndRole = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, organizationId } = req.body;

    if (!userId || !organizationId) {
      throw new CustomError("User ID and Organization ID are required", 400);
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const organization = await Organization.findById(organizationId).session(session);
    if (!organization) {
      throw new CustomError("Organization not found", 404);
    }

    user.organization = organizationId;
    user.role = "manager";
    await user.save({ session });

    await addDataToLogs(
      ActivityTypes.ADMIN_MODIFY_MANAGER,
      user._id,
      `Admin modified user ${user.email} role to manager for organization ${organization.name}`,
      session,
      req.userId
    );

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "User organization and role updated successfully",
      data: user.getPublicProfile(),
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Assign user role as customer
const assignCustomerRole = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId } = req.body;

    if (!userId) {
      throw new CustomError("User ID is required", 400);
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    user.role = "customer";
    await user.save({ session });

    await addDataToLogs(
      ActivityTypes.ADMIN_ASSIGN_CUSTOMER,
      user._id,
      `Admin assigned customer role to user ${user.email}`,
      session,
      req.userId
    );

    await session.commitTransaction();
    res.status(200).json({
      success: true,
      message: "User role updated to customer successfully",
      data: user.getPublicProfile(),
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Search organizations by name
const searchOrganizations = async (req, res) => {
  try {
    const { searchQuery } = req.query;

    if (!searchQuery) {
      throw new CustomError("Search query is required", 400);
    }

    const organizations = await Organization.find({
      name: { $regex: searchQuery, $options: "i" },
    }).select("name bio address contact");

    res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search users by name or email
const searchUsers = async (req, res) => {
  try {
    const { searchQuery } = req.query;

    if (!searchQuery) {
      throw new CustomError("Search query is required", 400);
    }

    const users = await User.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    }).select("name email role organization");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRecentData = async (req, res) => {
  try {
    // Total counts
    const [totalUsers, totalOrganizations, totalDevices, totalLocations] = await Promise.all([
      User.countDocuments(),
      Organization.countDocuments(),
      Device.countDocuments(),
      Location.countDocuments(),
    ]);

    // Recent Users
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select("_id name email organization");

    // Recent Organizations
    const organizations = await Organization.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select("_id name");

    // Recent Locations (populate organization, add device count)
    const locationsRaw = await Location.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select("_id name organization")
      .populate("organization", "_id name");

    // For each location, get device count
    const locations = await Promise.all(
      locationsRaw.map(async (loc) => {
        const deviceCount = await Device.countDocuments({ location: loc._id });
        return {
          _id: loc._id,
          name: loc.name,
          organization: loc.organization,
          deviceCount,
        };
      })
    );

    // Recent Devices (populate organization)
    const devices = await Device.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select("_id name deviceType location organization")
      .populate("organization", "_id name")
      .populate("location", "_id name");

    res.json({
      success: true,
      data: {
        users,
        organizations,
        locations,
        devices,
        totals: {
          users: totalUsers,
          organizations: totalOrganizations,
          devices: totalDevices,
          locations: totalLocations,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch recent entries",
    });
  }
};
// Exporting the functions
// to be used in the routes
module.exports = {
  assignOrganizationAndManager,
  modifyUserOrganizationAndRole,
  assignCustomerRole,
  searchOrganizations,
  searchUsers,
  getRecentData,
};
