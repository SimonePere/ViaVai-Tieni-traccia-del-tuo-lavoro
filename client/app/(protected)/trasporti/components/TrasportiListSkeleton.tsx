/** @format */

import React from "react";
import Dashboard from "@/app/components/layout/Dashboard";

const TrasportiListSkeleton: React.FC = () => {
  return (
    <Dashboard>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <div className="space-y-3">
              {/* Header del card */}
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-1/4 skeleton-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 skeleton-pulse"></div>
              </div>

              {/* Contenuto del card */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4 skeleton-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 skeleton-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 skeleton-pulse"></div>
              </div>

              {/* Footer del card */}
              <div className="flex justify-end space-x-2">
                <div className="h-8 bg-gray-200 rounded w-8 skeleton-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-8 skeleton-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton per il pulsante flottante */}
      <div className="fixed bottom-6 right-6">
        <div className="h-12 w-40 bg-gray-200 rounded-full skeleton-pulse"></div>
      </div>
    </Dashboard>
  );
};

export default TrasportiListSkeleton;
