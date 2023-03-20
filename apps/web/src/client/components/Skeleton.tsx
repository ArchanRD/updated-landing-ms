import React from "react";

const Skeleton = React.memo(() => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6 animate-pulse mt-6 max-w-4xl">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="sm:w-64 h-4 bg-gray-200 rounded-lg"></div>
          <div className="sm:w-32 h-4 bg-gray-200 rounded-lg mt-2"></div>
        </div>
      </div>
      <div className="flex flex-row items-center space-x-4">
        <div className="w-32 h-6 bg-gray-200 rounded-lg"></div>
        <div className="w-32 h-6 bg-gray-200 rounded-lg"></div>
        <div className="w-32 h-6 bg-gray-200 rounded-lg"></div>
        <div className="w-32 h-6 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-lg"></div>
      <div className="w-full h-4 bg-gray-200 rounded-lg"></div>
      <div className="w-full h-4 bg-gray-200 rounded-lg"></div>
    </div>
  );
});

export default Skeleton;
