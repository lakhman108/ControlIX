// components/OrganizationSelector.tsx
import React, { useEffect, useState } from "react";


interface Organization {
  _id: string;
  name: string;
  bio: string;
  address: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
  createdBy: [{
    name: string;
    email: string;
  }];
  locations: {
    _id: string;
    name: string;
    description: string;
    devices: {
      _id: string;
      name: string;
      deviceId: string;
      deviceType: string;
      description: string;
    }[];
  }[];
  users: {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
}

type Props = {
  isOpen: boolean;
  onSelect: (_org: Organization) => void;
};

export default function OrganizationSelector({ isOpen, onSelect }: Props) {
if (!isOpen) return null;
  const [organizations, setOrganizations] = useState<Organization []>([]);
  const [hoveredOrg, setHoveredOrg] = useState<Organization | null>(null);
  const fetchOrganizations = async (page: number = 1) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}organization?page=${page}&limit=10`, {
        credentials: "include"
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch organizations");
      }
      setOrganizations(data.data)
    } catch (error) {
      console.error("Error fetching organizations:", error);
    } 
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  return (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg w-96 shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">Select an Organization</h2>
        
        <div className="space-y-3">
          {organizations.map((org) => (
            <button
              key={org._id}
              onClick={() => onSelect(org)}
              onMouseEnter={() => setHoveredOrg(org)}
              onMouseLeave={() => setHoveredOrg(null)}
              className={`block w-full px-6 py-3 rounded-md text-left transition-all duration-200 ${
                hoveredOrg === org
                  ? 'bg-gray-900 text-white shadow-lg transform -translate-y-1' 
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg">{org.name}</span>
                <svg 
                  className={`h-5 w-5 transition-opacity duration-200 ${hoveredOrg === org ? 'opacity-100' : 'opacity-0'}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
