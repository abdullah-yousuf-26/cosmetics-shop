"use client";
import { useState, useEffect } from "react";

const Hero = () => {
  const banners = [
    { id: 1, image: "/6.png" },
    { id: 2, image: "/5.png", subtitle: "GLOW SPECIALIST", title: "Luxury Meets", highlight: "Pure Care", description: "Experience the fusion of organic extracts." },
    { id: 3, image: "/7.png" },
    { id: 4, image: "/10.png" },
    { id: 5, image: "/11.png" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    // FIX: Changed h-[90vh] to h-[60vh] on mobile and h-[85vh] on desktop
    <section className="relative h-[60vh] md:h-[85vh] w-full overflow-hidden bg-[#FFF0F0]">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="absolute inset-0">
            <img 
              src={banner.image} 
              alt={banner.highlight}
              className="w-full h-full object-cover object-center" // Added object-center
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF0F0]/80 md:from-[#FFF0F0] via-transparent to-transparent" />
          </div>

          {/* FIX: Adjusted padding and font sizes for mobile */}
          <div className="relative h-full max-w-7xl mx-auto flex items-center px-6 md:px-12">
            <div className="max-w-xl">
              <span className="text-[#E91E63] font-black tracking-widest uppercase text-[10px] md:text-xs mb-2 md:mb-4 block">
                {banner.subtitle}
              </span>
              {/* FIX: Text scaled from 4xl on mobile to 7xl on desktop */}
              <h1 className="text-4xl md:text-7xl font-black text-[#1A1F2B] leading-tight mb-2">
                {banner.title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E91E63] to-[#9C27B0]">
                  {banner.highlight}
                </span>
              </h1>
              <p className="text-gray-500 text-sm md:text-lg mb-6 md:mb-10 font-medium max-w-xs md:max-w-md">
                {banner.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Progress Dots: Adjusted bottom spacing */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 md:h-2 transition-all duration-300 rounded-full ${
              idx === currentIndex ? "w-6 md:w-8 bg-[#E91E63]" : "w-1.5 md:w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
