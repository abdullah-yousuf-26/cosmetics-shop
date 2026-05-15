"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"; // Import Link for navigation
import axios from "axios";
import ProductCard from "../../../components/ProductCard";
import SkeletonCard from "../../../components/SkeletonCard";
import Footer from "../../../components/Footer";

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const slugToCategory = {
    "lips": "Makeup",
    "perfume": "Fragrance",
    "body-care": "Skincare",
    "hair-care": "Haircare"
  };

  const displayTitles = {
    "Makeup": "Premium Makeup",
    "Fragrance": "Luxury Perfumes",
    "Skincare": "Advanced Skin Care",
    "Haircare": "Professional Hair Care"
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const categoryName = slugToCategory[slug];
        const { data } = await axios.get(`http://localhost:5000/api/products?category=${categoryName}`);
        setProducts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCategoryData();
  }, [slug]);

  const categoryLabel = slugToCategory[slug] || "Collection";

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        
        {/* --- BREADCRUMB SECTION --- */}
        <nav className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#E91E63]">{categoryLabel}</span>
        </nav>
        {/* ------------------------- */}

        <div className="mb-16">
          <span className="text-[#E91E63] font-bold uppercase tracking-widest text-[10px]">
            Sporsho {categoryLabel}
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mt-2">
            {displayTitles[categoryLabel] || "Our Products"}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              No items found in {categoryLabel} yet.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default CategoryPage;