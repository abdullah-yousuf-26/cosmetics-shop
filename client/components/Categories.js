"use client";
import React from "react";
import Link from "next/link";

const Categories = () => {
  // Your 4-5 main categories
  const categoryData = [
    {
      id: 1,
      name: "Skincare",
      image: "/cat-skincare.jpg", // Ensure these are in your public folder
      color: "bg-rose-50",
      link: "/category/skincare"
    },
    {
      id: 2,
      name: "Makeup",
      image: "/cat-makeup.jpg",
      color: "bg-purple-50",
      link: "/category/makeup"
    },
    {
      id: 3,
      name: "Haircare",
      image: "/cat-haircare.jpg",
      color: "bg-blue-50",
      link: "/category/haircare"
    },
    {
      id: 4,
      name: "Fragrance",
      image: "/cat-fragrance.jpg",
      color: "bg-yellow-50",
      link: "/category/fragrance"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-[#E91E63] font-black tracking-widest text-[10px] uppercase block mb-2">
            Curated For You
          </span>
          <h2 className="text-4xl font-black text-[#1A1F2B]">Shop by Category</h2>
          <div className="w-12 h-1 bg-[#E91E63] mx-auto mt-4 rounded-full" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {categoryData.map((cat) => (
            <Link key={cat.id} href={cat.link} className="group">
              <div className="flex flex-col items-center">
                {/* Image Circle with Hover Effect */}
                <div className={`relative w-40 h-40 md:w-48 md:h-48 rounded-full ${cat.color} p-1 mb-6 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-rose-100`}>
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-inner">
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  
                  {/* Subtle Border Ring */}
                  <div className="absolute inset-0 rounded-full border border-[#E91E63]/10 scale-110 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                </div>

                {/* Category Name */}
                <h3 className="text-lg font-black text-[#1A1F2B] uppercase tracking-widest group-hover:text-[#E91E63] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-all">
                  Explore Collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;