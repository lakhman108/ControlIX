const Organization = require("../../models/organization");
const User = require("../../models/user");
const Location = require("../../models/location");
const Device = require("../../models/device");
const mongoose = require("mongoose");
const { addDataToLogs, ActivityTypes } = require("../log/controller");

const organizationController = {
  // Create new organization
  createOrganization: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { name, bio, address, contact } = req.body;

      const organization = new Organization({
        name,
        bio,
        address,
        contact,
        createdBy: req.rootUser._id,
      });

      await organization.save({ session });

      await addDataToLogs(
        ActivityTypes.ORGANIZATION_CREATED,
        organization._id,
        `Organization ${name} created`,
        session,
        req.rootUser._id
      );

      await session.commitTransaction();
      res.status(201).json({
        message: "Organization created successfully",
        data: organization,
      });
    } catch (err) {
      await session.abortTransaction();
      res.status(500).json({ error: err.message || "Something went wrong!" });
    } finally {
      session.endSession();
    }
  },

  // Get organization details
  getOrganization: async (req, res) => {
    try {
      const organizationDetails = await Organization.aggregate([
        {
          $match: { _id: req.organization._id },
        },
        {
          $lookup: {
            from: "locations",
            let: { orgId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$organization", "$$orgId"] },
                },
              },
              {
                $lookup: {
                  from: "devices",
                  let: { locationId: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ["$location", "$$locationId"] },
                      },
                    },
                  ],
                  as: "devices",
                },
              },
            ],
            as: "locations",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
          },
        },
        {
          $lookup: {
            from: "users",
            let: { orgId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$organization", "$$orgId"] },
                },
              },
            ],
            as: "users",
          },
        },
        {
          $project: {
            name: 1,
            bio: 1,
            address: 1,
            contact: 1,
            createdAt: 1,
            updatedAt: 1,
            "createdBy.name": 1,
            "createdBy.email": 1,
            locations: {
              _id: 1,
              name: 1,
              description: 1,
              devices: {
                _id: 1,
                name: 1,
                deviceId: 1,
                deviceType: 1,
                description: 1,
              },
            },
            users: {
              _id: 1,
              name: 1,
              email: 1,
              role: 1,
              createdAt: 1,
            },
          },
        },
      ]);

      if (!organizationDetails.length) {
        return res.status(404).json({ error: "Organization not found" });
      }

      res.json({
        message: "Organization details retrieved successfully",
        data: organizationDetails[0],
      });
    } catch (err) {
      res.status(500).json({ error: err.message || "Something went wrong!" });
    }
  },

  // Update organization
  updateOrganization: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { name, bio, address, contact } = req.body;
      const { orgId } = req.params;

      const organization = await Organization.findByIdAndUpdate(
        orgId,
        {
          $set: {
            name,
            bio,
            address,
            contact,
            updatedAt: Date.now(),
          },
        },
        { new: true, session }
      );

      if (!organization) {
        throw new Error("Organization not found");
      }

      await addDataToLogs(
        ActivityTypes.ORGANIZATION_UPDATED,
        organization._id,
        `Organization ${name} updated with fields: ${JSON.stringify({ name, bio, address, contact })}`,
        session,
        req.rootUser._id
      );

      await session.commitTransaction();
      res.json({
        message: "Organization updated successfully",
        data: organization,
      });
    } catch (err) {
      await session.abortTransaction();
      res.status(500).json({ error: err.message || "Something went wrong!" });
    } finally {
      session.endSession();
    }
  },

  // Delete organization
  deleteOrganization: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { orgId } = req.params;
      const organization = await Organization.findById(orgId).session(session);

      if (!organization) {
        throw new Error("Organization not found");
      }

      try {
        // 1. Update all users associated with this organization
        await User.updateMany(
          { organization: orgId },
          {
            $set: {
              organization: null,
              role: "newbie",
            },
          },
          { session }
        );

        // 2. Find all locations associated with this organization
        const locations = await Location.find(
          { organization: orgId },
          { _id: 1 },
          { session }
        );

        // 3. Delete all devices associated with these locations
        await Device.deleteMany(
          {
            $or: [
              { organization: orgId },
              { location: { $in: locations.map((loc) => loc._id) } },
            ],
          },
          { session }
        );

        // 4. Delete all locations
        await Location.deleteMany({ organization: orgId }, { session });

        // 5. Finally delete the organization
        await Organization.findByIdAndDelete(orgId, { session });
        await addDataToLogs(
          ActivityTypes.ORGANIZATION_DELETED,
          organization._id,
          `Organization ${organization.name} deleted along with all associated data`,
          session,
          req.rootUser._id
        );
        // Commit the transaction
        await session.commitTransaction();
        res.json({
          message: "Organization and all associated data deleted successfully",
        });
      } catch (error) {
        // If any error occurs, abort the transaction
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } catch (err) {
      res.status(500).json({ error: err.message || "Something went wrong!" });
    } finally {
      session.endSession();
    }
  },

  // Get all organizations
  getAllOrganizations: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const [organizations, total] = await Promise.all([
        Organization.find()
          .populate("createdBy", "name email")
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        Organization.countDocuments(),
      ]);

      const totalPages = Math.ceil(total / limit);

      res.json({
        message: "Organizations retrieved successfully",
        data: organizations,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message || "Something went wrong!" });
    }
  },
};

module.exports = organizationController;
