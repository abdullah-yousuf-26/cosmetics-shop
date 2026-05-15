"use client";
import React from "react";


const Brands = () => {
  
  const brands = [
    { id: 1, name: "Brand 1", logo: "/logos/Sunsilk.jpg" },
    { id: 2, name: "Brand 2", logo: "/logos/Unilever.jpg" },
    { id: 3, name: "Brand 3", logo: "/logos/PRADA.jpg" },
    { id: 4, name: "Brand 4", logo: "/logos/PONDS.jpg" },
    { id: 5, name: "Brand 5", logo: "/logos/Neutrogena.jpg" },
    { id: 6, name: "Brand 6", logo: "/logos/M.A.C.jpg" },
    { id: 7, name: "Brand 7", logo: "/logos/LOREAL.jpg" },
    { id: 8, name: "Brand 8", logo: "/logos/LAKME.jpg" },
    { id: 9, name: "Brand 9", logo: "/logos/GUCCI.jpg" },
    { id: 10, name: "Brand 10", logo: "/logos/Dove.jpg" },
    { id: 11, name: "Brand 11", logo: "/logos/Dior.jpg" },
    { id: 12, name: "Brand 12", logo: "/logos/GARNIER.jpg" },
    // ... add up to 15
  ];

  // We double the array to ensure the scroll is seamless
  const scrollBrands = [...brands, ...brands];

  return (
    <section className="py-12 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <span className="text-[#E91E63] font-black tracking-widest text-[10px] uppercase block mb-2">
          Trusted Partners
        </span>
        <h2 className="text-3xl font-black text-[#1A1F2B]">Our Featured Brands</h2>
      </div>

      {/* The Scrolling Container */}
      <div className="relative flex overflow-x-hidden group">
        {/* The Animation Wrapper */}
        <div className="flex animate-marquee whitespace-nowrap py-10 group-hover:[animation-play-state:paused] cursor-pointer">
          {scrollBrands.map((brand, index) => (
            <div 
              key={index} 
              className="mx-8 flex flex-col items-center justify-center transition-all duration-500 hover:scale-110"
            >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center p-4 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-100">
            <img 
                src={brand.logo} 
                alt={brand.name} 
                className="max-w-full max-h-full object-cover rounded-full" // This will make the silk backgrounds fill the square
            />
            </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Tailwind Animation Logic */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
          .group:hover .animate-marquee {
          animation-play-state: paused !important;


      `}</style>
    </section>
  );
};

export default Brands;
