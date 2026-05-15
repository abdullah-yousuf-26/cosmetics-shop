"use client";
import { useEffect, useState } from "react";
import { fetchProducts } from "../utils/api";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import Brands from "../components/Brands";
import NewArrivals from "../components/NewArrivals";
import AdSection from "../components/AdSection";
import Footer from "../components/Footer";
import QuickMenuBar from "../components/QuickMenuBar";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#fafafa]">
      
      <Hero />
      <Categories />

      {/* --- BANNER AD SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* Added 'group' class here so the zoom works */}
        <div className="relative group overflow-hidden bg-gradient-to-r from-[#E91E63]/10 to-[#9C27B0]/10 h-[250px] rounded-[2rem] shadow-sm transition-all duration-500 hover:shadow-xl">   
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-in-out group-hover:scale-110" 
                 style={{ backgroundImage: "url('/Ads/31.png')" }} 
            />
            {/* Added a subtle overlay so if you add text later, it's readable */}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
        </div>
      </section>

      <Brands />
      
      {/* New Arraival */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-100/50">
        <h2 className="text-4xl font-extrabold mb-10 tracking-tighter">
          <span className="text-blue-400">New</span> <span className="text-rose-400">Arraival</span>
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-gray-200 animate-pulse rounded-[2.5rem]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* SIDE-BY-SIDE ADS */}
      <AdSection />

      {/* NEW ARRIVALS */}
      <NewArrivals />
      
      {/* GLOBAL FOOTER */}
      <Footer />
    </main>
  );
}