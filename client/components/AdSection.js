"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const AdSection = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-7xl mx-auto px-4 py-8 md:py-12"
    >
      {/* FIX: grid-cols-1 for mobile ensures cards stack vertically */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        
        {/* Left Ad */}
        <div className="relative group overflow-hidden rounded-[2rem] h-[250px] md:h-[400px] bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
            style={{ backgroundImage: "url('/Ads/27.png')" }} 
          />
          
          {/* Mobile Overlay: Text is always visible on mobile, animated on desktop */}
          <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 bg-gradient-to-r from-white/40 via-transparent to-transparent">
              <span className="hidden md:inline-block text-blue-600 font-black text-[10px] uppercase tracking-widest bg-white/80 w-fit px-3 py-1 rounded-full shadow-sm">
                New Collection
              </span>
              
              <h3 className="text-2xl md:text-4xl font-black text-gray-900 mt-2 md:mt-4 leading-tight">
                Care your <br /> <span className="text-rose-900">Skin...</span>
              </h3>

              <div className="mt-6 md:mt-12 md:transform md:translate-x-12 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-700">
                <Link 
                    href="/products?category=Skincare" 
                    className="inline-flex items-center gap-2 text-gray-900 font-black uppercase text-xs md:text-sm tracking-tighter hover:text-rose-500"
                >
                    Explore More <ArrowRight size={18} />
                </Link>
              </div>
          </div>
        </div>

        {/* Right Ad */}
        <div className="relative group overflow-hidden rounded-[2rem] h-[250px] md:h-[400px] bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl"> 
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
            style={{ backgroundImage: "url('/Ads/30.png')" }} 
          />
          <div className="relative z-10 h-full flex flex-col justify-end pb-8 md:pb-16 px-6 md:px-12 bg-gradient-to-t from-black/20 to-transparent"> 
              <div className="md:transform md:translate-x-12 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-700">
                <Link 
                    href="/products?category=Fragrance" 
                    className="inline-flex items-center gap-2 text-white md:text-gray-900 font-black uppercase text-xs md:text-sm tracking-tighter hover:text-rose-400"
                >
                    Explore More <ArrowRight size={18} />
                </Link>
              </div>
          </div>
        </div>

      </div>
    </motion.section>
  );
};

export default AdSection;