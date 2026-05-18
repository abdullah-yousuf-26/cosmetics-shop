"use client";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-blue-200 border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1: Brand Story */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-3xl font-black text-rose-500">Sporsho<span className="text-[#E91E63]">.</span></h2>
          <p className="mt-6 text-gray-800 text-sm leading-relaxed">
            Premium cosmetics curated for your natural glow. Experience luxury at your fingertips.
          </p>
          
          <div className="flex gap-4 mt-8">
            <a href="#" className="text-gray-900 hover:text-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="text-gray-900 hover:text-[#E91E63] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>

        {/* Column 2: Categories (Now mapped exactly to your folder routes!) */}
        <div>
          <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">Categories</h4>
          <ul className="space-y-4 text-sm text-gray-500 font-bold">
            <li><Link href="/category/body-care" className="hover:text-[#E91E63] transition-colors">Skincare</Link></li>
            <li><Link href="/category/lips" className="hover:text-[#E91E63] transition-colors">Makeup</Link></li>
            <li><Link href="/category/hair-care" className="hover:text-[#E91E63] transition-colors">Haircare</Link></li>
            <li><Link href="/category/perfume" className="hover:text-[#E91E63] transition-colors">Fragrance</Link></li>
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div>
          <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">Account</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><Link href="/profile" className="hover:text-[#E91E63] transition-colors">My Profile</Link></li>
            <li><Link href="/checkout" className="hover:text-[#E91E63] transition-colors">Checkout</Link></li>
            <li><Link href="/admin" className="hover:text-[#E91E63] transition-colors">Admin Login</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h4 className="font-black text-gray-900 mb-6 uppercase text-xs tracking-widest">Contact Us</h4>
          <ul className="space-y-4 text-sm text-gray-500">
            <li className="flex items-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E91E63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
               Moghbazar, Dhaka
            </li>
            <li className="flex items-center gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E91E63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
               +880 1234 56789
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-800">© 2026 Sporsho. All rights reserved.</p>
        <p className="text-xs text-gray-800">Developed by <span className="font-bold text-green-600">TouchPad Solutions</span></p>
      </div>
    </footer>
  );
};

export default Footer;