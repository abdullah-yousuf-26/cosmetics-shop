"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { motion } from "framer-motion";

// 1. Define ScrollReveal as its own reusable component outside
export const ScrollReveal = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const NewArrivals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        const latest = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 8);
        setProducts(latest);
      } catch (error) {
        console.error("Error fetching arrivals:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal> {/* 2. Wrap the header in the reveal effect */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-rose-400 font-bold uppercase tracking-widest text-[10px] block mb-2">
                You may love..
              </span>
              <h2 className="text-4xl font-black text-gray-900">Featured Beauty</h2>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            // 3. Wrap each card or the whole grid in a reveal
            <ScrollReveal key={product._id}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;