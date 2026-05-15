"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link"; // Added for Breadcrumbs
import axios from "axios";
import Navbar from "../../../components/Navbar"; 
import { ShoppingCart, Star, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { useCartStore } from "../../../store/useCartStore";
import toast from "react-hot-toast"; // Fixed: Added missing import

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Could not load product details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-rose-500" size={48} />
      </div>
    );
  }

  if (!product) return <div className="min-h-screen flex items-center justify-center font-black text-rose-500">Product Not Found</div>;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* --- BREADCRUMBS --- */}
        <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 mb-8 uppercase tracking-[0.2em]">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.category?.toLowerCase()}`} className="hover:text-gray-900 transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-rose-500">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Image Section */}
          <div className="relative group">
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
              <img 
                src={product.images?.[0] || product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right: Details Section */}
          <div className="flex flex-col justify-center">
            <p className="text-rose-400 font-black uppercase tracking-[0.3em] mb-4 text-sm">{product.brand}</p>
            <h1 className="text-5xl font-black text-gray-900 leading-tight mb-6">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor"/>)}
              </div>
              <span className="text-gray-400 font-bold text-sm border-l pl-4">4.8 (120 Reviews)</span>
            </div>

            <p className="text-gray-500 leading-relaxed text-lg mb-10 font-medium">{product.description}</p>

            <div className="flex items-center gap-6 mb-12">
              <span className="text-4xl font-black text-gray-900">৳{product.price}</span>
              {product.countInStock > 0 ? (
                <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-xs font-black uppercase">In Stock</span>
              ) : (
                <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-xs font-black uppercase">Out of Stock</span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-8">
              <label className="font-black text-gray-900 uppercase text-xs tracking-widest">Quantity:</label>
              <div className="flex items-center border-2 border-gray-100 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2 hover:bg-rose-50 cursor-pointer font-black text-xl text-rose-500 transition-colors"
                > - </button>
                <span className="px-6 py-2 font-black text-gray-900 min-w-[50px] text-center border-x-2 border-gray-100">
                  {qty}
                </span>
                <button 
                  onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                  className="px-4 py-2 hover:bg-rose-50 cursor-pointer font-black text-xl text-rose-500 transition-colors"
                > + </button>
              </div>
            </div>

            <button 
              disabled={product.countInStock === 0}
              onClick={() => { 
                addToCart({ ...product, qty }); 
                toast.success(`${qty} ${product.name} added to cart! 🌸`, {
                  style: { borderRadius: '20px', border: '1px solid #FDA4AF' }
                }); 
              }}
              className="w-full bg-gray-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-rose-500 transition-all active:scale-95 shadow-2xl shadow-rose-100 disabled:bg-gray-300 disabled:shadow-none"
            >
              <ShoppingCart size={24} strokeWidth={3} /> Add to Cart
            </button>

            <div className="grid grid-cols-2 gap-4 mt-12 border-t pt-12">
              <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                <ShieldCheck className="text-rose-400" size={16} /> 100% Authentic
              </div>
              <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                <Truck className="text-rose-400" size={16} /> Fast Delivery
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}