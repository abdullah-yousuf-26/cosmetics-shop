"use client";
import React from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion"; // Add this!

const QuickMenuBar = () => {
  const { scrollYProgress } = useScroll(); // This must be inside the component

  const menuItems = [
    { name: "Home", slug: "/" },
    { name: "All Products", slug: "/shop" },
    { name: "Makeup", slug: "/category/lips" }, // slug matches the key in page.js
    { name: "Perfume", slug: "/category/perfume" },
    { name: "Skin Care", slug: "/category/body-care" },
    { name: "Hair Care", slug: "/category/hair-care" },
  ];
  return (
<>
      {/* 1. Progress Bar - Positioned exactly below the Navbar */}
      <motion.div
        className="fixed left-0 right-0 h-1 bg-purple-300 origin-left z-50"
        style={{ 
          scaleX: scrollYProgress,
          top: "70px" 
        }}
      />

      {/* 2. Your Quick Menu Bar */}
      <div className="w-full bg-[#E91E63] text-white sticky top-[70px] z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-2 py-2 overflow-x-auto whitespace-nowrap no-scrollbar">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.slug}
                  className="relative px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 ease-in-out hover:bg-white/10 active:scale-95 flex items-center justify-center group"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-xl transition-transform duration-300 ease-out -z-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default QuickMenuBar;