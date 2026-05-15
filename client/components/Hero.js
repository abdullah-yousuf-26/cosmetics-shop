"use client";
import { useState, useEffect } from "react";

const Hero = () => {

  const banners = [
    {
      id: 1,
      image: "/6.png", // Place these in your /public folder
      
    },
    {
      id: 2,
      image: "/5.png",
      subtitle: "GLOW SPECIALIST",
      title: "Luxury Meets",
      highlight: "Pure Care",
      description: "Experience the fusion of organic extracts and advanced skincare technology."
    },
    {
      id: 3,
      image: "/7.png",
      
    },
        {
      id: 4,
      image: "/10.png",
      
    },    {
      id: 5,
      image: "/11.png",
      
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Logical Step: The Auto-Slide effect set to 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000); // 3-second interval

    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-[#FFF0F0]">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Banner Image Placeholder */}
          <div className="absolute inset-0">
            <img 
              src={banner.image} 
              alt={banner.highlight}
              className="w-full h-full object-cover"
            />
            {/* The Gradient Overlay to match your pink aesthetic */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF0F0] via-[#FFF0F0]/1 to-transparent" />
          </div>

          {/* Content Area */}
          <div className="relative h-full max-w-7xl mx-auto flex items-center px-12">
            <div className="max-w-xl">
              <span className="text-[#E91E63] font-black tracking-widest uppercase text-xs mb-4 block">
                {banner.subtitle}
              </span>
              <h1 className="text-7xl font-black text-[#1A1F2B] leading-tight mb-2">
                {banner.title} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E91E63] to-[#9C27B0]">
                  {banner.highlight}
                </span>
              </h1>
              <p className="text-gray-500 text-lg mb-10 font-medium max-w-md">
                {banner.description}
              </p>

            </div>
          </div>
        </div>
      ))}

      {/* Progress Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 transition-all duration-300 rounded-full ${
              idx === currentIndex ? "w-8 bg-[#E91E63]" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;