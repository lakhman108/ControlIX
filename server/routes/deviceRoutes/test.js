require('dotenv').config();

const Tuya = require("@tuya/tuya-connector-nodejs");
const CLIENT_ID = "hg7c5cuaf7e98kptyjcr";
const TUYA_CLIENT_SECRET = "291cc71c89e7458a8195bd3213935be4";
const TUYA_BASE_URL = "https://openapi.tuyain.com";

const data = async () => {
  const tuya = new Tuya.TuyaContext({
    baseUrl: TUYA_BASE_URL,
    accessKey: CLIENT_ID,
    secretKey: TUYA_CLIENT_SECRET,
  });

  const deviceId = "d7f9e9be26050cfebfunyd";

  try {
    // Get device current status
    const deviceStatus = await tuya.deviceStatus.status({
      device_id: deviceId,
    });

    // Log the full status with proper formatting
    console.log("\n" + "=".repeat(50));
    console.log("🔍 DEVICE STATUS (FULL RESPONSE)");
    console.log("=".repeat(50));
    console.log(JSON.stringify(deviceStatus.result, null, 4));

    // Extract specific properties
    console.log("\n" + "=".repeat(50));
    console.log("📋 DEVICE STATUS (FORMATTED LIST)");
    console.log("=".repeat(50));

    deviceStatus.result.forEach((status, index) => {
      console.log(`${index + 1}. 📌 Code: ${status.code} | Value: ${status.value} | Type: ${typeof status.value}`);
    });

    // Create a more readable object
    const statusObject = {};
    deviceStatus.result.forEach(status => {
      statusObject[status.code] = status.value;
    });

    console.log("\n" + "=".repeat(50));
    console.log("📊 DEVICE STATUS (CLEAN OBJECT FORMAT)");
    console.log("=".repeat(50));
    console.log(JSON.stringify(statusObject, null, 4));
    console.log("=".repeat(50) + "\n");

  } catch (err) {
    console.error("Error:", err);
  }
};

const controlDevice = async () => {
  const tuya = new Tuya.TuyaContext({
    baseUrl: TUYA_BASE_URL,
    accessKey: CLIENT_ID,
    secretKey: TUYA_CLIENT_SECRET,
  });

  // Hardcoded values for testing
  const deviceId = "d7f9e9be26050cfebfunyd"; // Same device as above
  const code = "switch_led"; // Common command for lights
  const value = true; // Turn on the device

  console.log("\n" + "=".repeat(50));
  console.log("🎮 TESTING DEVICE CONTROL");
  console.log("=".repeat(50));
  console.log(`Device ID: ${deviceId}`);
  console.log(`Command Code: ${code}`);
  console.log(`Command Value: ${value}`);
  console.log("=".repeat(50));

  try {
    const data = await tuya.request({
      method: "POST",
      path: `/v1.0/iot-03/devices/${deviceId}/commands`,
      body: {
        commands: [
          {
            code, // Command code (e.g., switch_led)
            value, // Command value (e.g., true or false)
          },
        ],
      },
    });

    console.log("\n" + "=".repeat(50));
    console.log("✅ DEVICE CONTROL RESPONSE");
    console.log("=".repeat(50));
    console.log(JSON.stringify(data, null, 4));
    console.log("=".repeat(50));

    if (data.success) {
      console.log("🎉 Device control command sent successfully!");
    } else {
      console.log("❌ Device control command failed!");
    }

  } catch (error) {
    console.log("\n" + "=".repeat(50));
    console.log("❌ ERROR IN DEVICE CONTROL");
    console.log("=".repeat(50));
    console.error("Error controlling device:", error);
    console.log("=".repeat(50));
  }
};


// Test different commands
const testMultipleCommands = async () => {
  const tuya = new Tuya.TuyaContext({
    baseUrl: TUYA_BASE_URL,
    accessKey: CLIENT_ID,
    secretKey: TUYA_CLIENT_SECRET,
  });

  const deviceId = "d7f9e9be26050cfebfunyd";

  // Array of test commands
  const testCommands = [
    { code: "switch_led", value: true, description: "Turn on the light" },
    { code: "switch_led", value: false, description: "Turn off the light" },
    { code: "bright_value_v2", value: 50, description: "Set brightness to 50%" },
    { code: "temp_value_v2", value: 0, description: "Set color temperature" }
  ];

  console.log("\n" + "=".repeat(60));
  console.log("🔄 TESTING MULTIPLE DEVICE COMMANDS");
  console.log("=".repeat(60));

  for (let i = 0; i < testCommands.length; i++) {
    const { code, value, description } = testCommands[i];

    console.log(`\n${i + 1}. ${description}`);
    console.log(`   Command: ${code} = ${value}`);

    try {
      const data = await tuya.request({
        method: "POST",
        path: `/v1.0/iot-03/devices/${deviceId}/commands`,
        body: {
          commands: [{ code, value }],
        },
      });

      console.log(`   Result: ${data.success ? '✅ Success' : '❌ Failed'}`);
      if (!data.success) {
        console.log(`   Error: ${JSON.stringify(data, null, 2)}`);
      }

      // Wait 2 seconds between commands to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.log(`   Result: ❌ Exception - ${error.message}`);
    }
  }

  console.log("\n" + "=".repeat(60));
};

// Run all tests
const runAllTests = async () => {
  console.log("🚀 Starting device tests...\n");

  // Test 1: Get device status
  await data();

  // Test 2: Control device with single command
  await controlDevice();

  // Test 3: Test multiple commands
  await testMultipleCommands();

  console.log("\n🏁 All tests completed!");
};

// Uncomment the line below to run all tests
// runAllTests();

// Or run individual tests:
// Original function

// controlDevice(); // Single control test

// testMultipleCommands(); // Multiple commands test




const turnOnAndChangeColor = async () => {
  const tuya = new Tuya.TuyaContext({
    baseUrl: TUYA_BASE_URL,
    accessKey: CLIENT_ID,
    secretKey: TUYA_CLIENT_SECRET,
  });

  const deviceId = "d7f9e9be26050cfebfunyd";

  console.log("\n" + "=".repeat(60));
  console.log("🎨 TURN ON LIGHT AND CHANGE COLOR");
  console.log("=".repeat(60));

  try {
    // Step 1: Turn on the light
    console.log("1️⃣ Turning on the light...");
    const turnOnResponse = await tuya.request({
      method: "POST",
      path: `/v1.0/iot-03/devices/${deviceId}/commands`,
      body: {
        commands: [
          {
            code: "switch_led",
            value: true,
          },
        ],
      },
    });

    console.log(`   Result: ${turnOnResponse.success ? '✅ Light turned ON' : '❌ Failed to turn on'}`);

    if (!turnOnResponse.success) {
      console.log(`   Error: ${JSON.stringify(turnOnResponse, null, 2)}`);
      return;
    }

    // Wait 2 seconds for the device to process the first command
    console.log("⏳ Waiting 2 seconds...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Switch to color mode
    console.log("2️⃣ Switching to color mode...");
    const colorModeResponse = await tuya.request({
      method: "POST",
      path: `/v1.0/iot-03/devices/${deviceId}/commands`,
      body: {
        commands: [
          {
            code: "work_mode",
            value: "colour",
          },
        ],
      },
    });

    console.log(`   Result: ${colorModeResponse.success ? '✅ Color mode activated' : '❌ Failed to switch mode'}`);

    if (!colorModeResponse.success) {
      console.log(`   Error: ${JSON.stringify(colorModeResponse, null, 2)}`);
      return;
    }

    // Wait 1 second
    console.log("⏳ Waiting 1 second...");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Set a beautiful blue color
    console.log("3️⃣ Setting color to blue...");
    const colorData = {
      h: 240,    // Hue: 240 = Blue
      s: 800,    // Saturation: 800/1000 = 80%
      v: 700     // Value/Brightness: 700/1000 = 70%
    };

    const setColorResponse = await tuya.request({
      method: "POST",
      path: `/v1.0/iot-03/devices/${deviceId}/commands`,
      body: {
        commands: [
          {
            code: "colour_data_v2",
            value: JSON.stringify(colorData),
          },
        ],
      },
    });

    console.log(`   Result: ${setColorResponse.success ? '✅ Color set to blue' : '❌ Failed to set color'}`);

    if (!setColorResponse.success) {
      console.log(`   Error: ${JSON.stringify(setColorResponse, null, 2)}`);
      return;
    }

    console.log("\n🎉 Successfully turned on light and changed color to blue!");
    console.log(`   Hue: ${colorData.h}° (Blue)`);
    console.log(`   Saturation: ${Math.round((colorData.s / 1000) * 100)}%`);
    console.log(`   Brightness: ${Math.round((colorData.v / 1000) * 100)}%`);

  } catch (error) {
    console.log("\n" + "=".repeat(60));
    console.log("❌ ERROR IN TURN ON AND CHANGE COLOR");
    console.log("=".repeat(60));
    console.error("Error:", error);
  }

  console.log("=".repeat(60) + "\n");
};

// Function to test different colors
const turnOnAndCycleColors = async () => {
  const tuya = new Tuya.TuyaContext({
    baseUrl: TUYA_BASE_URL,
    accessKey: CLIENT_ID,
    secretKey: TUYA_CLIENT_SECRET,
  });

  const deviceId = "d7f9e9be26050cfebfunyd";

  console.log("\n" + "=".repeat(60));
  console.log("🌈 TURN ON LIGHT AND CYCLE THROUGH COLORS");
  console.log("=".repeat(60));

  // Color presets
  const colors = [
    { name: "Red", h: 0, s: 1000, v: 800 },
    { name: "Orange", h: 30, s: 1000, v: 800 },
    { name: "Yellow", h: 60, s: 1000, v: 800 },
    { name: "Green", h: 120, s: 1000, v: 800 },
    { name: "Blue", h: 240, s: 1000, v: 800 },
    { name: "Purple", h: 270, s: 1000, v: 800 },
    { name: "Pink", h: 300, s: 1000, v: 800 },
  ];

  try {
    // Step 1: Turn on the light
    console.log("Turning on the light...");
    await tuya.request({
      method: "POST",
      path: `/v1.0/iot-03/devices/${deviceId}/commands`,
      body: {
        commands: [{ code: "switch_led", value: true }],
      },
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 2: Switch to color mode
    console.log("2️⃣ Switching to color mode...");
    await tuya.request({
      method: "POST",
      path: `/v1.0/iot-03/devices/${deviceId}/commands`,
      body: {
        commands: [{ code: "work_mode", value: "colour" }],
      },
    });

    await new Promise(resolve => setTimeout(resolve, 10000));

    // Step 3: Cycle through colors
    console.log("Cycling through colors...");
    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      console.log(`   Setting color to ${color.name}...`);

      await tuya.request({
        method: "POST",
        path: `/v1.0/iot-03/devices/${deviceId}/commands`,
        body: {
          commands: [
            {
              code: "colour_data_v2",
              value: JSON.stringify({ h: color.h, s: color.s, v: color.v }),
            },
          ],
        },
      });

      // Wait 3 seconds between color changes
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log("\n🎉 Color cycling completed!");

  } catch (error) {
    console.error("Error in color cycling:", error);
  }
};

// Run the functions
console.log("🚀 Starting color control test...\n");

// Option 1: Turn on and set single color
// turnOnAndChangeColor();
turnOnAndCycleColors()
// Option 2: Turn on and cycle through multiple colors (uncomment to use)
// turnOnAndCycleColors();
