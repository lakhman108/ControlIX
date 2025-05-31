import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
};

export default function IneligiblePopup({ isOpen }: Props) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 w-80 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-800 dark:text-gray-200 mb-6">
          You are not eligible to access the dashboard.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
