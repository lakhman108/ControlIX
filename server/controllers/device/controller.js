const { CustomError } = require("../../models/customError");
const { addDataToLogs, ActivityTypes } = require("../log/controller");
const mongoose = require("mongoose");
const Device = require("../../models/device");

const deviceController = {
  // Add Device
  addDevice: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        name,
        location,
        deviceId,
        deviceType,
        description,
        organization,
      } = req.body;
      const user = req.rootUser;

      // Check authorization
      if (!["admin", "helper"].includes(user.role)) {
        throw new CustomError("Unauthorized access", 403);
      }

      const newDevice = new Device({
        name,
        location,
        deviceId,
        deviceType,
        description,
        organization,
        createdBy: req.userId,
      });

      await newDevice.save({ session });
      // Create log entry
      await addDataToLogs(
        ActivityTypes.DEVICE_CREATED,
        newDevice._id,
        "",
        session,
        req.userId
      );

      await session.commitTransaction();
      session.endSession();
      return res
        .status(201)
        .json({ message: "Device Created Successfully", device: newDevice });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        error: error.message || "Internal server error",
      });
    }
  },

  // Remove Device
  removeDevice: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { deviceId } = req.body;
      const user = req.rootUser;

      if (!["admin", "helper"].includes(user.role)) {
        throw new CustomError("Unauthorized access", 403);
      }

      const device = await Device.findOne({ deviceId });
      if (!device) {
        throw new CustomError("Device not found", 404);
      }

      await Device.deleteOne({ deviceId }, { session });
      // Create log entry
      await addDataToLogs(
        ActivityTypes.DEVICE_REMOVED,
        device._id,
        `Device Physical Id: ${deviceId}`,
        session,
        req.userId
      );

      await session.commitTransaction();
      res.status(200).json({ message: "Device removed successfully" });
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

  // Update Device
  updateDevice: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { name, location, deviceId, description } = req.body;
      const user = req.rootUser;

      if (!["admin", "helper", "manager"].includes(user.role)) {
        throw new CustomError("Unauthorized access", 403);
      }

      const device = await Device.findOneAndUpdate(
        { deviceId },
        {
          name,
          location,
          description,
          updatedBy: req.userId,
        },
        { new: true, session }
      );

      if (!device) {
        throw new CustomError("Device not found", 404);
      }
      
      await addDataToLogs(
        ActivityTypes.DEVICE_UPDATED,
        device._id,
        `Device Physical Id: ${deviceId} For Updated fields: ${JSON.stringify(req.body)}`,
        session,
        req.userId
      );

      await session.commitTransaction();
      res.status(200).json({ message: "Device updated successfully", device });
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

  // Get Device
  getDevice: async (req, res) => {
    try {
      const user = req.rootUser;
      const device = req.device;
      if (!["admin", "manager", "helper"].includes(user.role)) {
        throw new CustomError("Unauthorized access", 403);
      }

      if (!device) {
        throw new CustomError("Device not found", 404);
      }

      return res
        .status(200)
        .json({ message: "Device retrieved successfully", device });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        error: error.message || "Internal server error",
      });
    }
  },

  // Get Devices By Organization
  getDevicesByOrg: async (req, res) => {
    try {
      const { organization } = req.params; // Changed from req.body to req.params
      const { page = 1, limit = 10 } = req.query; // Pagination params moved to query
      const user = req.rootUser;

      if (!["admin", "manager", "helper"].includes(user.role)) {
        throw new CustomError("Unauthorized access", 403);
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        populate: ["location"],
      };

      const devices = await Device.paginate({ organization }, options);

      return res.status(200).json({
        message: "Devices retrieved successfully",
        devices: devices.docs,
        totalPages: devices.totalPages,
        currentPage: devices.page,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        error: error.message || "Internal server error",
      });
    }
  },

  // Get Devices By Location
  getDevicesByLocation: async (req, res) => {
    try {
      const { location } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const user = req.rootUser;

      if (!["admin", "manager", "customer", "helper"].includes(user.role)) {
        throw new CustomError("Unauthorized access", 403);
      }

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        populate: ["location", "organization"],
      };

      const devices = await Device.paginate({ location }, options);

      return res.status(200).json({
        message: "Devices retrieved successfully",
        devices: devices.docs,
        totalPages: devices.totalPages,
        currentPage: devices.page,
      });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        error: error.message || "Internal server error",
      });
    }
  },
};

module.exports = deviceController;
