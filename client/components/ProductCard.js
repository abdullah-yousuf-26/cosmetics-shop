"use client";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();

  const displayImage = product.images && product.images[0] 
    ? product.images[0] 
    : (product.image || "https://via.placeholder.com/300");

  // Safety check to ensure we have a valid ID
  const productId = product._id || product.id;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10 }}
      className="group relative backdrop-blur-md bg-white/40 border border-white/60 rounded-[2.5rem] p-4 shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      {/* 1. Wrap ONLY the visual parts in the Link */}
      <Link href={`/product/${productId}`} className="cursor-pointer">
        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-6 left-6 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full z-20">
            {product.discount}% OFF
          </span>
        )}

        {/* Image Container */}
        <div className="relative h-64 w-full rounded-[2rem] overflow-hidden bg-gray-50">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white p-3 rounded-full text-gray-700 hover:bg-rose-500 hover:text-white transition-colors shadow-lg">
              <Heart size={20} />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-6 px-2 pb-2">
          <p className="text-xs text-rose-400 font-bold uppercase tracking-widest mb-1">
            {product.brand}
          </p>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {product.name}
          </h3>
        </div>
      </Link>

      {/* 2. Price and Cart Button (Separated from the Link) */}
      <div className="px-2 pb-2">
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-xl font-bold text-gray-900">৳{product.price}</span>
            {product.oldPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">৳{product.oldPrice}</span>
            )}
          </div>
          
          <button 
            onClick={(e) => {
              e.preventDefault(); 
              e.stopPropagation(); // CRITICAL: Stops the click from triggering the Link
              addToCart(product);
            }}
            className="bg-rose-500 text-white p-3 rounded-2xl hover:bg-purple-500 cursor-pointer transition-colors shadow-md active:scale-90 relative z-30"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}