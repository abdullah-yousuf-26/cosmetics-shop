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
  className="max-w-7xl mx-auto px-4"
>
    <section className="max-w-8xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Ad: Fragrance Focus */}
        <div className="relative group overflow-hidden rounded-[2rem] h-[350px] bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:cursor-pointer">
        
        {/* Full Background Image - Premium Aesthetic */}
        <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-in-out group-hover:scale-110" 
            style={{ backgroundImage: "url('/Ads/27.png')" }} 
        />

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-center px-12 bg-gradient-to-r from-white/30 via-transparent to-transparent">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest bg-white/80 w-fit px-3 py-1 rounded-full shadow-sm">
            New Collection
            </span>
            
            <h3 className="text-4xl font-black text-gray-900 mt-4 leading-tight">
            Care your <br /> <span className="text-rose-900">Skin...</span>
            </h3>

            {/* Minimalist Slide-In Link: No Background, Lower Position */}
            <div className="mt-12 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 ease-out">
            <Link 
                href="/shop" 
                className="inline-flex items-center gap-2 text-gray-900 font-black uppercase text-sm tracking-tighter hover:text-blue-600 transition-colors"
            >
                Explore More 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            </div>
        </div>
        </div>

        {/* Right Ad: Clean Aesthetic Focus */}
        <div className="relative group overflow-hidden rounded-[2rem] h-[350px] bg-white border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:cursor-pointer">              
        <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-in-out group-hover:scale-110" 
            style={{ backgroundImage: "url('/Ads/30.png')" }} 
        />       
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-12 bg-gradient-to-t from-white/20 to-transparent">                     
            <div className="transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 ease-out">
            <Link 
                href="/shop" 
                className="inline-flex items-center gap-2 text-gray-900 font-black uppercase text-sm tracking-tighter hover:text-blue-600 transition-colors"
            >
                Explore More 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            </div>
        </div>
        </div>

      </div>
    </section>
    </motion.section>
  );
 
};


export default AdSection;
