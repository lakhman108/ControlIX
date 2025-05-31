export const getTuyaDeviceState=async(deviceId:string)=>{
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}device/tuya/devices/currentStatus/${deviceId}`,
   {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }

  );
  return response.json();
}

export const getDeviceProperties = async (deviceId: string) => {
  try {
    console.log("calling this fuction",deviceId);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}device/tuya/device/${deviceId}/properties`,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch device properties: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching device properties:", error);
    throw error; // Re-throw to let caller handle it
  }
};

export const getDeviceStates = async (deviceIds: string[]) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}device/tuya/devices/state`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ deviceIds }),
    }
  );
  return response.json();
};

export const controlDevice = async (
  deviceId: string,
  command: { code: string; value: boolean }
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}device/tuya/device/${deviceId}/control`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(command), // Send code and value dynamically
    }
  );
  
  return response.json();
};

export const getDeviceCurrentStatus = async (deviceIds: string[]) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}device/tuya/devices/currentStatus`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ deviceIds }),
    }
  );
  return response.json();
};
