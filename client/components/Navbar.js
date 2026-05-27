"use client";
import { useState } from "react"; // Added useState import
import Link from "next/link";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import { useRouter } from "next/navigation";
import { ShoppingCart, LogOut, LayoutDashboard, Search, User, UserCircle } from "lucide-react";

export default function Navbar() {
  const { userInfo, logout } = useAuthStore();
  const { cart, toggleDrawer } = useCartStore();
  const router = useRouter();
  
  // 1. Local state to handle query inputs
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // 2. Submission engine to route to your new shop page parameter
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-3xl font-black bg-gradient-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent tracking-tighter cursor-pointer active:scale-95 transition-transform">
          Sporsho
        </Link>

        {/* ✅ FIXED: Changed from <div> to <form> and attached onSubmit handling */}
        <form 
          onSubmit={handleSearch} 
          className="hidden md:flex flex-1 max-w-xl mx-8 bg-gray-100/50 border border-gray-400 rounded-2xl px-4 py-2 items-center focus-within:bg-white focus-within:border-rose-200 transition-all"
        >
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search for beauty..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Capture typography values
            className="bg-transparent border-none outline-none ml-2 w-full text-gray-900 placeholder:text-gray-400 font-medium" 
          />
        </form>

        <div className="flex items-center gap-6">
          {/* CART OPTION */}
          <button 
            onClick={toggleDrawer} 
            className="relative text-rose-700 hover:text-yellow-500 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-90"
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                {cart.length}
              </span>
            )}
          </button>

          {userInfo ? (
            <div className="flex items-center gap-4">
              {/* Admin Link */}
              {userInfo.isAdmin && (
                <Link href="/admin" className="text-gray-700 hover:text-rose-500 flex items-center gap-1 transition-all cursor-pointer">
                  <LayoutDashboard size={20} />
                  <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider">Admin</span>
                </Link>
              )}

              {/* Profile Link */}
              <Link href="/profile" className="text-rose-700 hover:text-green-500 flex items-center gap-1 transition-all cursor-pointer">
                <UserCircle size={21} />
                <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider">Profile</span>
              </Link>
              
              {/* Greeting & LOGOUT OPTION */}
              <div className="flex items-center gap-3 border-l pl-4 border-gray-200">
                <span className="text-sm font-semibold text-rose-800 hidden sm:inline">
                  Hi, {userInfo.name.split(' ')[0]}
                </span>
                <button 
                  onClick={handleLogout} 
                  className="text-rose-800 hover:text-rose-600 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-90 p-1"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 bg-rose-900 text-white px-5 py-2 rounded-xl hover:bg-rose-500 transition-all font-bold text-sm cursor-pointer shadow-md hover:shadow-rose-200">
              <User size={18} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 