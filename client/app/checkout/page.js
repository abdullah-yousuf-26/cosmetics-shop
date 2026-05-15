"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { MapPin, Phone, Truck, CreditCard, Banknote, Smartphone, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // Added missing import

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, clearCart } = useCartStore();
    const { userInfo } = useAuthStore();
    
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("Dhaka");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [deliveryCharge, setDeliveryCharge] = useState(65);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const subtotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

    useEffect(() => {
        setDeliveryCharge(city === "Dhaka" ? 65 : 120);
    }, [city]);

    const total = subtotal + deliveryCharge;

    const handlePlaceOrder = async () => {
        if (!address || !phone) return toast.error("Please provide address and phone number");
        if (!userInfo || !userInfo.token) return toast.error("Authentication expired. Please login again.");

        setIsPlacingOrder(true);

        const config = { 
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}` 
            } 
        };

        const formattedOrderItems = cart.map((item) => ({
            name: item.name,
            qty: item.quantity || 1,
            image: item.images?.[0] || item.image, // Ensure we pass a string URL
            price: item.price,
            product: item._id,
        }));

        const orderData = {
            orderItems: formattedOrderItems,
            shippingAddress: { address, city, phone, postalCode: "1000" },
            paymentMethod,
            totalPrice: total,
            deliveryCharge
        };

        // Create the promise for toast
        const orderPromise = axios.post("http://localhost:5000/api/orders", orderData, config)
            .then((res) => {
                clearCart();
                // Delay redirect slightly so they see the success message
                setTimeout(() => router.push("/profile"), 2000);
                return res.data;
            });

        toast.promise(
            orderPromise,
            {
                loading: 'Processing your order...',
                success: 'Order placed successfully! 🌸',
                error: (err) => err.response?.data?.message || "Checkout failed. Please try again.",
            },
            {
                style: {
                    borderRadius: '20px',
                    background: '#1A1F2B',
                    color: '#fff',
                    fontWeight: '600',
                },
                success: {
                    duration: 5000,
                    iconTheme: { primary: '#F43F5E', secondary: '#fff' },
                },
            }
        ).finally(() => {
            setIsPlacingOrder(false);
        });
    };
    return (
        <main className="min-h-screen bg-gray-50 pt-32 pb-20 px-6">
            <Navbar />
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Side: Shipping & Payment */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-8 text-gray-900 flex items-center gap-2">
                            <MapPin className="text-rose-500" /> Shipping Information
                        </h2>
                        <div className="space-y-4">
                            <select 
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-transparent focus:border-rose-200 focus:bg-white rounded-2xl outline-none text-gray-900 font-medium transition-all"
                            >
                                <option value="Dhaka">Dhaka (Inside City)</option>
                                <option value="Other">Outside Dhaka</option>
                            </select>
                            <textarea 
                                placeholder="Full Address (House, Road, Area...)" 
                                className="w-full p-4 bg-gray-50 border border-transparent focus:border-rose-200 focus:bg-white rounded-2xl outline-none h-28 text-gray-900 transition-all"
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <input 
                                type="text" 
                                placeholder="Phone Number" 
                                className="w-full p-4 bg-gray-50 border border-transparent focus:border-rose-200 focus:bg-white rounded-2xl outline-none text-gray-900 transition-all"
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 flex items-center gap-4">
                        <Truck className="text-rose-500" />
                        <p className="text-sm text-rose-800 font-medium">
                            {city === "Dhaka" 
                                ? "Standard Delivery (Inside Dhaka) applied: ৳65" 
                                : "Outside Dhaka Delivery applied: ৳120"}
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-8 text-gray-900 flex items-center gap-2">
                            <CreditCard className="text-rose-500" /> Payment Method
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                                onClick={() => setPaymentMethod("COD")}
                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === "COD" ? "border-rose-500 bg-rose-50" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}
                            >
                                <div className={`p-3 rounded-full ${paymentMethod === "COD" ? "bg-rose-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                                    <Banknote size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Cash on Delivery</p>
                                    <p className="text-xs text-gray-500">Pay when you receive</p>
                                </div>
                            </div>
                            <div 
                                onClick={() => setPaymentMethod("Digital")}
                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === "Digital" ? "border-rose-500 bg-rose-50" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}
                            >
                                <div className={`p-3 rounded-full ${paymentMethod === "Digital" ? "bg-rose-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                                    <Smartphone size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Digital Payment</p>
                                    <p className="text-xs text-gray-500">bKash, Nagad, or Cards</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-32">
                        <h2 className="text-2xl font-bold mb-8">Order Summary</h2>
                        <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item._id} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                        <span className="text-sm font-medium line-clamp-1 text-white">{item.name}</span>
                                    </div>
                                    <span className="text-sm text-gray-400">x{item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 border-t border-gray-800 pt-6">
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Subtotal</span>
                                <span>৳{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Delivery Charge</span>
                                <span>৳{deliveryCharge}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-rose-400 pt-2 border-t border-gray-800">
                                <span>Total Amount</span>
                                <span>৳{total}</span>
                            </div>
                        </div>

                        <button 
                            disabled={isPlacingOrder || cart.length === 0}
                            onClick={handlePlaceOrder}
                            className="w-full bg-rose-400 mt-10 p-5 rounded-2xl font-bold text-lg hover:bg-rose-700 cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            {isPlacingOrder ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                `Confirm Order via ${paymentMethod}`
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}