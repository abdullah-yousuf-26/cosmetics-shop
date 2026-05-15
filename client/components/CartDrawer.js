"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, Trash2, ShoppingBag, Plus, Minus } from "lucide-react"; // Added Plus/Minus icons
import { useCartStore } from "../store/useCartStore";

export default function CartDrawer() {
  const router = useRouter();
  // Ensure updateQty is destructured from your store
  const { cart, isDrawerOpen, toggleDrawer, setDrawerOpen, removeFromCart, updateQty } = useCartStore();

  // Unified logic: using item.qty
  const subtotal = cart.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);

  const handleCheckout = () => {
    setDrawerOpen(false);
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleDrawer}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white/90 backdrop-blur-2xl shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="text-rose-500" /> Your Bag
              </h2>
              <button onClick={toggleDrawer} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag size={60} strokeWidth={1} />
                  <p className="text-lg">Your cart is empty</p>
                  <button onClick={toggleDrawer} className="text-rose-500 font-bold">Start Shopping</button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item._id} className="flex gap-4 group items-center">
                    <div className="w-20 h-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                      <img 
                        src={item.images?.[0] || item.image} 
                        className="w-full h-full object-cover" 
                        alt={item.name} 
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{item.brand}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-gray-700 hover:text-red-500 cursor-pointer transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className="font-black text-rose-500 text-lg">৳{item.price * (item.qty || 1)}</span>
                        
                        {/* Quantity Selector inside Drawer */}
                        <div className="flex items-center bg-white-100 border-3 border-rose-100 rounded-xl px-1">
                          <button 
                            onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))} 
                            className="p-1 text-gray-800 hover:text-rose-500  cursor-pointer transition-colors"
                          >
                            <Minus size={14} strokeWidth={3} />
                          </button>
                          <span className="px-3 text-rose-500 text-sm">{item.qty || 1}</span>
                          <button 
                            onClick={() => updateQty(item._id, item.qty + 1)} 
                            className="p-1 text-gray-800 hover:text-green-600 cursor-pointer transition-colors"
                          >
                            <Plus size={14} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-gray-100 bg-white/50 space-y-6">
                
                {/* Notes Section */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]  text-gray-400 uppercase tracking-tighter">
                    <span>* Delivery charge will be added with total bill</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-rose-400 uppercase tracking-tighter">
                    <span>* VAT is not included</span>
                  </div>
                </div>

                <div className="flex justify-between text-2xl font-black text-gray-900">
                  <span>Subtotal</span>
                  <span>৳{subtotal}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-rose-500 text-white text-center p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-green-500 cursor-pointer transition-all shadow-xl active:scale-[0.98]"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}