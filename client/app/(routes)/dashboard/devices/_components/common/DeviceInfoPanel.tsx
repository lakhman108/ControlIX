import React from "react";

interface DeviceInfoItem {
  label: string;
  value: string | number | React.ReactNode;
  color?: string; // Optional color for special values
}

interface DeviceInfoPanelProps {
  title?: string;
  items: DeviceInfoItem[];
}

export const DeviceInfoPanel = ({
  title = "Device Information",
  items,
}: DeviceInfoPanelProps) => {
  return (
    <div className="bg-base-100/80 backdrop-blur-xl border border-base-300 rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-base-content">{title}</h2>
      <div className="space-y-3 text-sm">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-base-content/60">{item.label}</span>
            {typeof item.value === "string" ||
            typeof item.value === "number" ? (
              <span className={item.color || "text-base-content"}>
                {item.value}
              </span>
            ) : (
              item.value
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
