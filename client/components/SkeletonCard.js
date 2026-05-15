"use client";
import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 overflow-hidden">
      {/* Image Placeholder */}
      <div className="w-full h-64 bg-gray-200 animate-pulse rounded-[2rem]" />
      
      {/* Content Placeholders */}
      <div className="mt-6 space-y-3">
        {/* Category Label Placeholder */}
        <div className="h-3 bg-gray-200 animate-pulse rounded-full w-1/4" />
        
        {/* Title Placeholder */}
        <div className="h-5 bg-gray-200 animate-pulse rounded-full w-full" />
        
        {/* Price & Button Placeholder */}
        <div className="flex justify-between items-center mt-6">
          <div className="h-6 bg-gray-200 animate-pulse rounded-full w-1/3" />
          <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
