import React, { useState, useEffect, useRef } from "react";
import { Power,
  DoorClosed,
  Lightbulb,
  Snowflake,
  Lock,
  Fan,
  SwitchCamera,
  Thermometer,
  Waves,
  Trash2,
  Edit,
  Settings,
  Eye,
  AlertTriangle
} from "lucide-react";
import { useDispatch } from "react-redux";
import { toggleDevicePower, deleteDevice } from "../../../../_lib/slices/deviceSlice";
import { categoryComponentMap } from "../../../../_types/device";
import { Device } from "../page";


// Device type icons mapping using category codes
const deviceTypeIcons: Record<string, React.ReactElement> = {
  bulb: <Lightbulb className="h-5 w-5" />,
  ac: <Snowflake className="h-5 w-5" />,
  lock: <Lock className="h-5 w-5" />,
  fan: <Fan className="h-5 w-5" />,
  switch: <SwitchCamera className="h-5 w-5" />,
  sensor: <Waves className="h-5 w-5" />,
  heater: <Thermometer className="h-5 w-5" />,
};

interface DeviceCardProps {
  device: Device;
  onClick: (_device: Device) => void;
  isAdmin?: boolean;
  onDelete?: (_deviceId: string) => void;
  _onEdit?: (_device: Device) => void;
  isDeleting?: boolean;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onClick,
  isAdmin = false,
  onDelete,
  _onEdit,
  isDeleting = false
}) => {
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    setShowDropdown(false);
    setShowDeleteModal(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    setShowEditModal(true);
  };

  const handleShowMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    onClick(device);
  };

  const handleConfirmDelete = () => {
    console.log("Deleting device:", device);
    if (onDelete) {
      onDelete(device.id);
    } else {
      dispatch(deleteDevice(device.id));
    }
    setShowDeleteModal(false);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleTogglePower = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Dispatch action to toggle device power
    dispatch(toggleDevicePower(device.id));
  };

  return (
    <>
      <div
        className={`w-full card bg-base-100 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg cursor-pointer border ${
          device.status === "online" ? "border-green-200" : "border-gray-200"
        } ${device.isOn ? "ring-1 ring-green-100" : ""}`}
        onClick={() => onClick(device)}
      >
        <div className="card-body p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h2 className="card-title text-lg font-semibold truncate">{device.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <DoorClosed className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{device.name}</span>
              </p>
            </div>

            {/* Settings Icon - Visible only in Admin mode */}
            {isAdmin && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleMenuToggle}
                  disabled={isDeleting}
                  className="btn btn-ghost btn-sm btn-square text-gray-500 hover:bg-gray-100 ml-2 flex-shrink-0"
                  title="Settings"
                >
                  <Settings className="h-5 w-5" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px]">
                    <div className="py-1">
                      <button
                        onClick={handleShowMoreClick}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Show more
                      </button>
                      <button
                        onClick={handleEditClick}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className={`h-4 w-4 ${isDeleting ? 'opacity-50' : ''}`} />
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="divider my-2" />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">

              {deviceTypeIcons[categoryComponentMap[device.categoryCode]]}
              <span className="capitalize">{categoryComponentMap[device.categoryCode]}</span>
            </div>

            {/* Status indicator and power toggle */}
            <div className="flex items-center gap-3">
              {/* Status dot */}
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${device.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
                <span className="text-xs text-muted-foreground capitalize">{device.status}</span>
              </div>

              {/* Power toggle button */}
              <button
                onClick={handleTogglePower}
                className={`p-1 rounded-full transition-colors ${
                  device.isOn
                    ? "text-green-500 hover:bg-green-50"
                    : "text-gray-400 hover:bg-gray-50"
                }`}
                title={device.isOn ? "Turn off" : "Turn on"}
              >
                <Power className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Device</h3>
            <p className="text-gray-600 mb-6">
              Editing functionality for "{device.name}" will be implemented here.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

  {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-sm sm:max-w-md mx-auto">
            {/* Header with icon and title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-error/10 p-3 rounded-full">
                <Trash2 className="h-6 w-6 text-error" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-base-content">Delete Device</h3>
                <p className="text-sm text-base-content/60">This action is permanent</p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 mb-6">
              <p className="text-base-content/80 text-sm sm:text-base">
                Are you sure you want to delete <span className="font-semibold text-base-content">"{device.name}"</span>?
              </p>
              <div className="alert alert-warning">
                <AlertTriangle className="stroke-current shrink-0 h-5 w-5" />
                <span className="text-sm">This action cannot be undone.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-action flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-ghost order-2 sm:order-1"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className={`btn btn-error order-1 sm:order-2 ${isDeleting ? 'loading' : ''}`}
              >
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete Device'
                )}
              </button>
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="modal-backdrop"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          >
            <button className="cursor-default">close</button>
          </div>
        </div>
      )}

    </>
  );
};
