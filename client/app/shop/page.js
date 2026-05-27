"use client";
import { useState, useEffect, useMemo, Suspense } from "react"; // 1. Added Suspense
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// 2. Move your main shop logic into a sub-component
function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentSortBy = searchParams.get("sortBy") || "newest"; 

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products`);
        setAllProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    getAllProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((product) => {
      const matchesCategory = !currentCategory || product.category.toLowerCase() === currentCategory.toLowerCase();
      const matchesBrand = !currentBrand || product.brand.toLowerCase() === currentBrand.toLowerCase();
      const matchesPrice = !currentMaxPrice || product.price <= Number(currentMaxPrice);
      
      const matchesSearch = !currentSearch || 
        product.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
        product.brand.toLowerCase().includes(currentSearch.toLowerCase()) ||
        product.description.toLowerCase().includes(currentSearch.toLowerCase());

      return matchesCategory && matchesBrand && matchesPrice && matchesSearch;
    });

    if (currentSortBy === "priceLow") {
      result.sort((a, b) => a.price - b.price);
    } else if (currentSortBy === "priceHigh") {
      result.sort((a, b) => b.price - a.price);
    } else if (currentSortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [allProducts, currentCategory, currentSearch, currentBrand, currentMaxPrice, currentSortBy]);

  const updateFilters = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8 pb-20">
      {/* LEFT SIDEBAR: FILTERS */}
      <aside className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 h-fit space-y-6 text-gray-900">
        <div>
          <h3 className="font-black text-sm uppercase tracking-wider text-gray-400 mb-3">Categories</h3>
          <div className="flex flex-col gap-2 font-bold">
            {["Skincare", "Makeup", "Haircare", "Fragrance"].map((cat) => (
              <button 
                key={cat} 
                onClick={() => updateFilters("category", currentCategory === cat ? "" : cat)}
                className={`text-left px-3 py-2 rounded-xl transition-all ${currentCategory === cat ? "bg-rose-500 text-white" : "hover:bg-rose-50 text-gray-700"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-black text-sm uppercase tracking-wider text-gray-400 mb-3">Max Price</h3>
          <input 
            type="range" min="0" max="10000" step="100"
            value={currentMaxPrice || 10000}
            onChange={(e) => updateFilters("maxPrice", e.target.value)}
            className="w-full accent-rose-500"
          />
          <p className="text-right font-black text-rose-500 mt-1">৳{currentMaxPrice || 10000}</p>
        </div>

        {(currentCategory || currentSearch || currentBrand || currentMaxPrice || currentSortBy !== "newest") && (
          <button 
            onClick={() => router.push("/shop")}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-rose-600 transition-all text-xs uppercase tracking-widest"
          >
            Clear All Filters
          </button>
        )}
      </aside>

      {/* RIGHT SIDEGRID: PRODUCT DISPLAY */}
      <section className="lg:col-span-3">
        <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-gray-900">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              {currentSearch ? `Search Results for "${currentSearch}"` : "Our Collection"}
            </h2>
            <p className="text-gray-400 font-bold text-sm mt-0.5">{filteredProducts.length} Products Found</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Sort By:</span>
            <select
              value={currentSortBy}
              onChange={(e) => updateFilters("sortBy", e.target.value)}
              className="bg-white border border-gray-200 text-gray-800 font-bold text-sm px-4 py-2.5 rounded-xl outline-none focus:border-rose-300 shadow-sm transition-all cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => <div key={n} className="h-96 bg-gray-200 animate-pulse rounded-[2.5rem]" />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100">
            <p className="text-gray-400 font-black text-lg">No matches found. Try clearing your filters!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// 3. Keep the default export clean, wrapping the content in a Suspense boundary
export default function ShopPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-32">
      <Navbar />
      <Suspense fallback={
        <div className="text-center py-20 font-black text-rose-500 animate-pulse tracking-widest uppercase">
          Loading Sporsho Collection...
        </div>
      }>
        <ShopContent />
      </Suspense>
      <Footer />
    </main>
  );
}