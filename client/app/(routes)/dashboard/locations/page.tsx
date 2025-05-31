"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  Search,
  DoorClosed,
  Settings2,
  FilterX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/app/_lib/store";
import axios from "axios";

interface Device {
  id: string;
  name: string;
  deviceType: string;
  deviceId: string;
}

interface Location {
  _id: string;
  name: string;
  description?: string;
  floor?: string;
  devices: Device[];
}

export default function RoomsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [floorFilter, setFloorFilter] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchLocations();
  }, [currentPage, userInfo?.organization]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}location/organization/${userInfo?.organization}`, {
        params: {
          page: currentPage,
          limit: 9
        },
        withCredentials: true
      });
      setLocations(response.data.locations);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique floor values
  const uniqueFloors = Array.from(
    new Set(locations.map(location => location.floor).filter(Boolean))
  );

  const filteredRooms = locations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (floorFilter === "" || location.floor === floorFilter)
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Locations</h1>
        {
            (userInfo?.role == "admin" || userInfo?.role == "helper") && (
        <Link href="/dashboard/locations/new">
          <Button>
            <PlusCircle className="h-4 w-4" />
            Add Location
          </Button>
        </Link>
            )
        }
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search locations..."
            className="input input-bordered w-full !pl-10 py-2 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 items-center w-full sm:w-auto">
          <select
            className="select select-bordered w-full"
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
          >
            <option value="">All Floors</option>
            {uniqueFloors.map(floor => (
              <option key={floor} value={floor}>{floor}</option>
            ))}
          </select>

          {(searchQuery || floorFilter) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setFloorFilter("");
              }}
            >
              <FilterX className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((location) => (
              <div
                key={location._id}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => router.push(`/dashboard/locations/${location._id}`)}
              >
                <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all rounded-lg cursor-pointer border border-base-300">
                  <div className="card-body space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="card-title text-lg font-semibold">{location.name}</h2>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Settings2 className="h-4 w-4" />
                          {location.devices.length} {location.devices.length === 1 ? 'device' : 'devices'}
                        </p>
                      </div>
                      <DoorClosed className="h-5 w-5 text-primary" />
                    </div>

                    <div className="divider my-1" />

                    {/* Device Section with consistent height */}
                    <div className="min-h-[45px]">
                      {location.devices.length > 0 ? (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {location.devices.slice(0, 3).map((device) => (
                              <div key={device.id} className="badge badge-outline gap-1 text-xs py-2">
                                <Settings2 className="h-3 w-3" />
                                {device.name}
                              </div>
                            ))}
                            {location.devices.length > 3 && (
                              <div className="badge badge-outline text-xs py-2">+{location.devices.length - 3}</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground italic">
                          No devices in this location
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRooms.length === 0 && (
            <div className="text-center py-10 space-y-2">
              <span className="text-6xl">🕵️‍♂️</span>
              <p className="text-lg text-muted-foreground">No locations found matching your search</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="py-2 px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
