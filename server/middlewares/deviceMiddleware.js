const Device = require("../models/device");
const Location = require("../models/location");

const hasAccessOfDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    var user = req.rootUser;
    // This is for the admin and installation guys who is gonna do the device installation and other things
    // to the devices. i.e. installing devices and repairing the devices
    if (["admin", "helper"].includes(user.role)) {
      const device = await Device.findOne({
        deviceId,
      }).populate("location");
      if (!device) {
        return res.status(403).json({ error: "Not Allowed!" });
      }
      req.device = device;
      next();
    }
    const device = await Device.findOne({
      organization: user.organization,
      deviceId,
    }).populate("location");
    if (!device) {
      return res.status(403).json({ error: "Not Allowed!" });
    }
    req.device = device;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const hasAccessOfOrganization = async (req, res, next) => {
  try {
    const { organization } = req.params;
    var user = req.rootUser;
    console.log(organization);
    console.log(user.organization);
    // This is for the admin and installation guys who is gonna do the device installation and other things
    // to the devices. i.e. installing devices and repairing the devices
    if (["admin", "helper"].includes(user.role)) {
      next();
    }
    if (user.organization.toString() !== organization) {
      return res.status(403).json({ error: "Not Allowed!" });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const hasAccessOfLocation = async (req, res, next) => {
  try {
    const { location } = req.params;
    var user = req.rootUser;

    // This is for the admin and installation guys who is gonna do the device installation and other things
    // to the devices. i.e. installing devices and repairing the devices
    if (["admin", "helper"].includes(user.role)) {
      return next();
    }

    const locationCheck = await Location.findOne({
      _id: location,
      organization: user.organization,
    });

    if (!locationCheck) {
      return res.status(403).json({ error: "Not Allowed!" });
    }
    return next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const isAdminOrHelper = async (req, res, next) => {
  try {
    var user = req.rootUser;
    // This is for the admin and installation guys who is gonna do the device installation and other things
    // to the devices. i.e. installing devices and repairing the devices
    if (!["admin", "helper"].includes(user.role)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    const device = await Device.findOne({
      deviceId: req.body.deviceId,
    });
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }
    req.device = device;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};

const isAdminOrHelperForAddingDevice = async (req, res, next) => {
  try {
    var user = req.rootUser;
    // This is for the admin and installation guys who is gonna do the device installation and other things
    // to the devices. i.e. installing devices and repairing the devices
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
  hasAccessOfDevice,
  isAdminOrHelper,
  hasAccessOfOrganization,
  hasAccessOfLocation,
  isAdminOrHelperForAddingDevice
};
