const mongoose = require("mongoose");
const Location = require("../../models/location");
const { CustomError } = require("../../models/customError");
const { addDataToLogs, ActivityTypes } = require("../log/controller");

const locationController = {
  // Add Location
  addLocation: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { name, description, organization, floor } = req.body;
      const newLocation = new Location({
        name,
        description,
        organization,
        createdBy: req.userId,
        floor
      });

      await newLocation.save({ session });
      
      await addDataToLogs(
        ActivityTypes.LOCATION_CREATED,
        newLocation._id,
        "",
        session,
        req.userId
      );

      await session.commitTransaction();
      session.endSession();
      return res.status(201).json({
        message: "Location Created Successfully",
        location: newLocation,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        error: error.message || "Internal server error",
      });
    }
  },

  // Remove Location
  removeLocation: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { locationId } = req.params;
      const location = req.location;

      await Location.deleteOne({ _id: locationId }, { session });
      
      await addDataToLogs(
        ActivityTypes.LOCATION_REMOVED,
        location._id,
        `Location: ${location.name}`,
        session,
        req.userId
      );

      await session.commitTransaction();
      res.status(200).json({ message: "Location removed successfully" });
    } catch (error) {
      await session.abortTransaction();
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        error: error.message || "Internal server error",
      });
    } finally {
      session.endSession();
    }
  },

  // Update Location
  updateLocation: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { name, description } = req.body;
      const { locationId } = req.params;

      const location = await Location.findByIdAndUpdate(
        locationId,
        {
          name,
          description,
        },
        { new: true, session }
      );

      if (!location) {
        throw new CustomError("Location not found", 404);
      }

      await addDataToLogs(
        ActivityTypes.LOCATION_UPDATED,
        location._id,
        `Updated fields: ${JSON.stringify(req.body)}`,
        session,
        req.userId
      );

      await session.commitTransaction();
      res.status(200).json({
        message: "Location updated successfully",
        location,
      });
    } catch (error) {
      await session.abortTransaction();
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        error: error.message || "Internal server error",
      });
    } finally {
      session.endSession();
    }
  },

  // Get Location
  getLocation: async (req, res) => {
    try {
      const locationId = req.params.locationId;
      
      const location = await Location.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(locationId) } },
        {
          $lookup: {
            from: 'devices',
            localField: '_id',
            foreignField: 'location',
            as: 'devices'
          }
        },
        {
          $project: {
            name: 1,
            description: 1,
            floor: 1,
            createdAt: 1,
            devices: {
              $map: {
                input: '$devices',
                as: 'device',
                in: {
                  id: '$$device._id',
                  name: '$$device.name',
                  deviceType: '$$device.deviceType',
                  deviceId: '$$device.deviceId'
                }
              }
            }
          }
        }
      ]);

      if (!location || location.length === 0) {
        throw new CustomError("Location not found", 404);
      }

      return res.status(200).json({
        message: "Location retrieved successfully",
        location: location[0],
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        error: error.message || "Internal server error",
      });
    }
  },

  // Get Locations By Organization
  getLocationsByOrg: async (req, res) => {
    try {
      const { organization } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * limit;

      // Use aggregation pipeline to get locations with device details
      const locations = await Location.aggregate([
        { $match: { organization: new mongoose.Types.ObjectId(organization) } },
        {
          $lookup: {
            from: 'devices',
            localField: '_id',
            foreignField: 'location',
            as: 'devices'
          }
        },
        {
          $project: {
            name: 1,
            description: 1,
            floor: 1,
            createdAt: 1,
            devices: {
              $map: {
                input: '$devices',
                as: 'device',
                in: {
                  id: '$$device._id',
                  name: '$$device.name',
                  deviceType: '$$device.deviceType',
                  deviceId: '$$device.deviceId'
                }
              }
            }
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) }
      ]);

      const total = await Location.countDocuments({ organization });

      return res.status(200).json({
        message: "Locations retrieved successfully",
        locations,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      });
    } catch (error) {
      console.log(error)
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        error: error.message || "Internal server error",
      });
    }
  },
};

module.exports = locationController;