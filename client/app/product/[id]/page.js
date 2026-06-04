"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Navbar from "../../../components/Navbar"; 
import Footer from "../../../components/Footer"; 
import ProductCard from "../../../components/ProductCard"; // ✅ Imported ProductCard for the recommendations row
import { ShoppingCart, Star, ShieldCheck, Truck, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useCartStore } from "../../../store/useCartStore";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(""); 
  const [activeSection, setActiveSection] = useState("description"); 
  const [quantity, setQuantity] = useState(1); 
  const [relatedProducts, setRelatedProducts] = useState([]); // ✅ State for recommendations

  const addToCart = useCartStore((state) => state.addToCart);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        // 1. Fetch current product data
        const { data: currentProduct } = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(currentProduct);
        setActiveImage(currentProduct.images?.[0] || currentProduct.image);

        // 2. Fetch all products to calculate smart recommendations
        const { data: allProducts } = await axios.get(`${API_URL}/api/products`);
        
        // 3. Filter out the current item, match by exact category string
        let matches = allProducts.filter(
          (p) => p.category === currentProduct.category && p._id !== currentProduct._id
        );

        // 4. If more than 4 items match, sort them by absolute price differences (closest first)
        if (matches.length > 4) {
          matches.sort((a, b) => 
            Math.abs(a.price - currentProduct.price) - Math.abs(b.price - currentProduct.price)
          );
        }

        // 5. Slice down to show exactly 1 row of up to 4 items max
        setRelatedProducts(matches.slice(0, 4));

      } catch (error) {
        console.error("Error fetching product ecosystems:", error);
        toast.error("Could not load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductAndRelated();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-rose-500" size={48} />
      </div>
    );
  }

  if (!product) return <div className="min-h-screen flex items-center justify-center font-black text-rose-500">Product Not Found</div>;

  const imageGallery = product.images?.length > 0 ? product.images : [product.image, product.image, product.image];

  return (
    <main className="min-h-screen bg-white"> {/* ✅ Standardized to crisp white background */}
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-[10px] font-black text-gray-400 mb-8 uppercase tracking-[0.2em]">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gray-900 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-rose-500">{product.name}</span>
        </nav>

        {/* MAIN DISPLAY CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: MULTI-IMAGE CAROUSEL SECTION (6 COLS) */}
          <div className="lg:col-span-6 space-y-4 sticky top-32">
            <div className="aspect-square w-full rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 shadow-sm">
              <img 
                src={activeImage} 
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            
            {/* THUMBNAILS LIST */}
            <div className="flex gap-4 overflow-x-auto py-2">
              {imageGallery.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-white border-2 flex-shrink-0 transition-all ${
                    activeImage === imgUrl ? "border-rose-500 scale-95 shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: CONFIGURATION & TEXT CONSOLE (6 COLS) */}
          <div className="lg:col-span-6 bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
            <div>
              <p className="text-rose-500 font-black uppercase tracking-[0.3em] text-xs mb-2">{product.brand}</p>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">{product.name}</h1>
            </div>
            
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor"/>)}
              </div>
              <span className="text-gray-400 font-bold text-xs border-l pl-4">4.8 (120 Authentic Reviews)</span>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-3xl font-black text-gray-900">৳{product.price}</span>
              {product.countInStock > 0 ? (
                <span className="bg-green-50 text-green-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">In Stock</span>
              ) : (
                <span className="bg-red-50 text-red-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Out of Stock</span>
              )}
            </div>

            {/* PRODUCT SPECIFICATION ACCORDION */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden text-gray-800">
              {/* Description Tab */}
              <div className="border-b border-gray-100">
                <button 
                  onClick={() => setActiveSection(activeSection === "description" ? "" : "description")}
                  className="w-full flex justify-between items-center p-4 font-bold text-sm text-gray-800 bg-gray-50/50"
                >
                  Product Information
                  {activeSection === "description" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {activeSection === "description" && (
                  <p className="p-4 text-sm text-gray-500 leading-relaxed font-medium">{product.description}</p>
                )}
              </div>
              
              {/* Delivery Tab */}
              <div>
                <button 
                  onClick={() => setActiveSection(activeSection === "delivery" ? "" : "delivery")}
                  className="w-full flex justify-between items-center p-4 font-bold text-sm text-gray-800 bg-gray-50/50"
                >
                  Shipping & Returns
                  {activeSection === "delivery" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {activeSection === "delivery" && (
                  <p className="p-4 text-sm text-gray-500 leading-relaxed font-medium">
                    Fast delivery inside Dhaka within 24-48 Hours (৳65). Nationwide distribution takes 3-5 days (৳120). Easy cash on delivery payments available.
                  </p>
                )}
              </div>
            </div>

            {/* QUANTITY CONSOLE CONTROLLER */}
            <div className="flex items-center gap-4 pt-4">
              <label className="font-black text-gray-900 uppercase text-[10px] tracking-widest">Quantity:</label>
              <div className="flex items-center border-2 border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-rose-100 cursor-pointer font-black text-lg text-rose-500 transition-colors"
                > - </button>
                <span className="px-6 py-2 font-black text-gray-900 min-w-[50px] text-center">
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                  className="px-4 py-2 hover:bg-rose-100 cursor-pointer font-black text-lg text-rose-500 transition-colors"
                > + </button>
              </div>
            </div>

            {/* PRIMARY CONVERT BUTTON */}
            <button 
              disabled={product.countInStock === 0}
              onClick={() => { 
                addToCart({ ...product, quantity }); 
                toast.success(`${quantity} x ${product.name} added to cart! 🌸`, {
                  style: { borderRadius: '20px', border: '1px solid #FDA4AF', background: '#1A1F2B', color: '#fff' }
                }); 
              }}
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-rose-500 transition-all active:scale-[0.98] shadow-xl disabled:bg-gray-300 disabled:shadow-none"
            >
              <ShoppingCart size={20} strokeWidth={3} /> Add to Cart
            </button>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                <ShieldCheck className="text-rose-500" size={16} /> 100% Authentic Product
              </div>
              <div className="flex items-center gap-3 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                <Truck className="text-rose-500" size={16} /> Fast Track Logistics
              </div>
            </div>
          </div>

        </div>

        {/* Add my NEW DESIGN  PRODUCTS ROW */}
        {relatedProducts.length > 0 && (
          <section className="py-16 border-t border-gray-100 mt-20">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 gap-2">
              <div>
                <span className="text-rose-500 font-black tracking-widest text-[10px] uppercase block mb-2">
                  Complete Your Routine
                </span>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">You May Also Like</h2>
              </div>
              <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider w-fit">
                Similar Price Options
              </span>
            </div>

            {/* Responsive Recommended Grid Array */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        )}

      </div>
      <Footer />
    </main>
  );
}