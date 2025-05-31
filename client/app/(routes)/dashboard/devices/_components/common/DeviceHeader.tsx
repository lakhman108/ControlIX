import Link from "next/link";
import { ArrowLeft, Wifi, WifiOff } from "lucide-react";
import { ReactNode } from "react";

interface DeviceHeaderProps {
  name: string;
  type: string;
  status: "online" | "offline";
  statusLabel?: string;
  extraMetrics?: { label: string; value: string | number }[];
  icon: ReactNode;
  backUrl: string;
}

export const DeviceHeader = ({
  name,
  type,
  status,
  statusLabel,
  extraMetrics = [],
  icon,
  backUrl,
}: DeviceHeaderProps) => {
  return (
    <div className="border-b border-base-300 backdrop-blur-xl bg-base-100/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href={backUrl}>
            <button className="btn btn-ghost btn-circle text-base-content/70 hover:text-base-content">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                {icon}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-base-content">{name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    {status === "online" ? (
                      <Wifi className="h-4 w-4 text-green-400" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-400" />
                    )}
                    <span
                      className={`text-xs font-medium ${status === "online" ? "text-green-400" : "text-red-400"}`}
                    >
                      {status === "online" ? "Connected" : "Disconnected"}
                    </span>
                  </div>
                  {statusLabel && (
                    <>
                      <div className="text-base-content/60">•</div>
                      <span className="text-sm text-base-content/60">
                        {statusLabel}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {extraMetrics.length > 0 && (
            <div className="flex items-center gap-2">
              {extraMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="bg-base-100/50 backdrop-blur-xl border border-base-300 rounded-xl p-3"
                >
                  <div className="text-xs text-base-content/60">
                    {metric.label}
                  </div>
                  <div className="text-lg font-semibold text-base-content">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
