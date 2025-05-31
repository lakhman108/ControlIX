const auth = require("../../middlewares/auth");
const express = require("express");
const router = express.Router();
const deviceC = require("../../controllers/device/controller");
const {
  hasAccessOfDevice,
  isAdminOrHelper,
  hasAccessOfOrganization,
  hasAccessOfLocation,
  isAdminOrHelperForAddingDevice,
} = require("../../middlewares/deviceMiddleware");
const crypto = require("crypto");
const Tuya = require("@tuya/tuya-connector-nodejs");

const CLIENT_ID = process.env.TUYA_CLIENT_ID;
const TUYA_CLIENT_SECRET = process.env.TUYA_CLIENT_SECRET;
const TUYA_BASE_URL = process.env.TUYA_ROOT_URL;

// Device Routes // Only Body Parameters
router.post("/", auth, isAdminOrHelperForAddingDevice, deviceC.addDevice);
router.delete("/", auth, isAdminOrHelper, deviceC.removeDevice);
router.put("/", auth, isAdminOrHelper, deviceC.updateDevice);
// Only get request, query params
router.get("/:deviceId", auth, hasAccessOfDevice, deviceC.getDevice);
router.get(
  "/organization/:organization",
  auth,
  hasAccessOfOrganization,
  deviceC.getDevicesByOrg
);
router.get(
  "/location/:location",
  auth,
  hasAccessOfLocation,
  deviceC.getDevicesByLocation
);

router.get("/tuya/devices/currentStatus/:deviceId", auth, async (req, res) => {
  const tuya = new Tuya.TuyaContext({
    baseUrl: TUYA_BASE_URL,
    accessKey: CLIENT_ID,
    secretKey: TUYA_CLIENT_SECRET,
  });

  const deviceId = req.params?.deviceId; // Expecting an array of device IDs in the request body

  if (!deviceId) {
    return res.status(400).json({ error: "Invalid or empty deviceIds array" });
  }

  try {
    // Fetch properties for all devices
    const deviceCurrentStatus=await tuya.deviceStatus.status({
         device_id: deviceId,
    })
    console.log(deviceCurrentStatus);
    if (deviceCurrentStatus?.result)
    res.json({ devices: deviceCurrentStatus?.result });
    else
    res.json({ devices: deviceCurrentStatus });
  } catch (error) {
    console.error("Error fetching device properties:", error);
    res.status(500).json({ error: "Failed to fetch device properties" });
  }
});
router.post("/tuya/devices/currentStatus", auth, async (req, res) => {
  const tuya = new Tuya.TuyaContext({
    baseUrl: TUYA_BASE_URL,
    accessKey: CLIENT_ID,
    secretKey: TUYA_CLIENT_SECRET,
  });

  const { deviceIds } = req.body; // Expecting an array of device IDs in the request body

  if (!Array.isArray(deviceIds) || deviceIds.length === 0) {
    return res.status(400).json({ error: "Invalid or empty deviceIds array" });
  }

  try {
    // Fetch properties for all devices
    const deviceCurrentStatuses = await Promise.all(
      deviceIds.map(async (deviceId) => {
        try {
          const response = await tuya.deviceStatus.status({
            device_id: deviceId,
          });
          return {
            deviceId,
            currentStatus: response.result, // Include the full specifications
          };
        } catch (error) {
          console.error(
            `Error fetching properties for device ${deviceId}:`,
            error
          );
          return { deviceId, error: "Failed to fetch properties" };
        }
      })
    );

    res.json({ devices: deviceCurrentStatuses });
  } catch (error) {
    console.error("Error fetching device properties:", error);
    res.status(500).json({ error: "Failed to fetch device properties" });
  }
});

router.post("/tuya/device/:deviceId/control", auth, async (req, res) => {
  const { deviceId } = req.params;
  const { code, value } = req.body; // Accepting code and value dynamically
  const tuya = new Tuya.TuyaContext({
    baseUrl: TUYA_BASE_URL,
    accessKey: CLIENT_ID,
    secretKey: TUYA_CLIENT_SECRET,
  });

  try {
    const data = await tuya.request({
      method: "POST",
      path: `/v1.0/iot-03/devices/${deviceId}/commands`,
      body: {
        commands: [
          {
            code:code, // Command code (e.g., switch_led)
            value:value, // Command value (e.g., true or false)
          },
        ],
      },
    });
    console.log("conrol method called",code,value);
     if (data.success) {
        console.log("data is this",data);
      console.log("🎉 Device control command sent successfully!");
    } else {
      console.log("❌ Device control command failed!");
    }
    res.json({ success: data.success, device: data.result });
  } catch (error) {
    console.error("Error controlling device:", error);
    res.status(500).json({ error: "Failed to control device" });
  }
});

// Endpoint to get device states for multiple devices
router.post("/tuya/devices/state", auth, async (req, res) => {
  const tuya = new Tuya.TuyaContext({
    baseUrl: TUYA_BASE_URL,
    accessKey: CLIENT_ID,
    secretKey: TUYA_CLIENT_SECRET,
  });

  const { deviceIds } = req.body; // Expecting an array of device IDs in the request body
  if (!Array.isArray(deviceIds) || deviceIds.length === 0) {
    return res.status(400).json({ error: "Invalid or empty deviceIds array" });
  }
  try {
    const deviceStates = await Promise.all(
      deviceIds.map(async (deviceId) => {
        try {
          // Use the device.detail method as shown in Tuya documentation
          const deviceDetail = await tuya.device.detail({
            device_id: deviceId,
          });

          // Debug: Log the full response structure
          console.log(`Device detail response for ${deviceId}:`, JSON.stringify(deviceDetail, null, 2));

          // Check if the response has the expected structure
          if (!deviceDetail || !deviceDetail.result) {
            console.error(`Invalid response structure for device ${deviceId}:`, deviceDetail);
            return { deviceId, status: "error" };
          }

          return {
            deviceId,
            status: deviceDetail.result.online ? "online" : "offline",
            categoryCode: deviceDetail?.result?.category ? deviceDetail?.result?.category : "unknown" ,
          };
        } catch (error) {
          console.error(`Error fetching state for device ${deviceId}:`, error);
          return { deviceId, status: "error" };
        }
      })
    );
    console.log("returned response is this",deviceStates);
    res.json({ devices: deviceStates });
  } catch (error) {
    console.error("Error fetching device states:", error);
    res.status(500).json({ error: "Failed to fetch device states" });
  }
});

module.exports = router;
