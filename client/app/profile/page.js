"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "next/navigation";
import { Loader2, User, Package, ChevronRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import axios from "axios";

export default function ProfilePage() {
    const { userInfo } = useAuthStore();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // 1. Protect the route: If not logged in, go to login
    useEffect(() => {
        if (!userInfo) {
            router.push("/login");
        }
    }, [userInfo, router]);

    // 2. Fetch Orders logic
    useEffect(() => {
        const fetchMyOrders = async () => {
            if (!userInfo?.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get(`${API_URL}/api/orders/mine`, config);
                setOrders(data);
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, [userInfo]);

    
    if (!userInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-rose-50/20">
                <Loader2 className="animate-spin text-rose-500" size={40} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-purple-300 pb-20 pt-32 px-6 transition-colors duration-500">
            <Navbar />
            <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-rose-100 text-center mb-10">
                    <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                        <User size={48} />
                    </div>
                    {/* Safe access using optional chaining or our guard above */}
                    <h2 className="text-3xl font-black text-gray-900">{userInfo.name}</h2>
                    <p className="text-gray-400 mt-2 mb-6">{userInfo.email}</p>
                    
                    <div className="inline-block bg-rose-50 text-rose-600 py-2 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest">
                        {userInfo.isAdmin ? "Verified Admin" : "Premium Member"}
                    </div>
                </div>

                {/* Orders Section */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 ml-4">
                        <Package className="text-rose-500" /> My Orders ({orders.length})
                    </h3>

                    {loading ? (
                        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-rose-300" /></div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white p-12 rounded-[2.5rem] text-center border border-dashed border-gray-200">
                            <p className="text-gray-400">You haven't placed any orders yet. 🌸</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl text-rose-500 font-bold">
                                        #{order._id.slice(-6)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">৳{order.totalPrice}</p>
                                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {order.isPaid ? 'Paid' : 'Pending Payment'}
                                    </span>
                                    <ChevronRight className="text-gray-300" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}