"use client";
import { useState, useEffect, useMemo } from "react";
import { 
    Plus, X, Upload, Loader2, Package, Users, 
    DollarSign, Trash2, Edit3, CheckCircle2, ArrowRight, ShieldAlert, User 
} from "lucide-react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useAuthStore } from "../../store/useAuthStore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import toast from "react-hot-toast";

export default function AdminPage() {
    const { userInfo } = useAuthStore();
    
    // --- 1. States ---
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("inventory");
    const [showDrawer, setShowDrawer] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);

    const initialState = {
        name: "", description: "", price: "", discountPrice: "", 
        brand: "", category: "Skincare", countInStock: 1, image: ""
    };
    const [formData, setFormData] = useState(initialState);

    // --- 2. Memoized Analytics (Fixes ReferenceErrors) ---
    const totalPhysicalStock = useMemo(() => {
        return products?.reduce((acc, p) => acc + Number(p.countInStock || 0), 0) || 0;
    }, [products]);

    const totalRevenue = useMemo(() => {
        return orders?.reduce((acc, order) => acc + (order.isDelivered ? order.totalPrice : 0), 0) || 0;
    }, [orders]);

    const salesData = useMemo(() => {
        return orders ? orders.reduce((acc, order) => {
            const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const existingDate = acc.find(item => item.date === date);
            if (existingDate) { existingDate.sales += order.totalPrice; } 
            else { acc.push({ date, sales: order.totalPrice }); }
            return acc;
        }, []).slice(-7) : [];
    }, [orders]);

    const customerData = useMemo(() => {
        return users.reduce((acc, user) => {
            const date = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const existing = acc.find(item => item.date === date);
            if (existing) { existing.count += 1; } 
            else { acc.push({ date, count: 1 }); }
            return acc;
        }, []).slice(-7);
    }, [users]);

    const orderVolumeData = useMemo(() => {
        return orders.reduce((acc, order) => {
            const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const existing = acc.find(item => item.date === date);
            if (existing) { existing.orders += 1; } 
            else { acc.push({ date, orders: 1 }); }
            return acc;
        }, []).slice(-7);
    }, [orders]);

    // --- 3. Data Fetching ---
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/products");
            setProducts(data);
        } catch (err) { console.error(err); }
    };

    const fetchOrders = async () => {
        try {
            if (!userInfo?.token) return;
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get("http://localhost:5000/api/orders", config);
            setOrders(data);
        } catch (err) { console.error("Order fetch failed:", err.response?.status); }
    };

    const fetchUsers = async () => {
        try {
            if (!userInfo?.token) return;
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get("http://localhost:5000/api/users", config);
            setUsers(data);
        } catch (err) { console.error("User fetch failed."); }
    };

    useEffect(() => { fetchProducts(); }, []);
    useEffect(() => { 
        if (activeTab === "orders") fetchOrders();
        if (activeTab === "users") fetchUsers();
    }, [activeTab]);

    // --- 4. Handlers with Modern Toast Promises ---

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "sporsho_preset");
        setUploading(true);

        const uploadPromise = axios.post(`https://api.cloudinary.com/v1_1/dyllddujf/image/upload`, data)
            .then(res => {
                setFormData({ ...formData, image: res.data.secure_url });
                return res.data;
            });

        toast.promise(uploadPromise, {
            loading: 'Uploading to Cloudinary...',
            success: 'Image ready! 📸',
            error: 'Upload failed',
        }, { style: { borderRadius: '15px' } }).finally(() => setUploading(false));
    };

    const deliverHandler = async (id) => {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        setLoading(true);

        const deliverPromise = axios.put(`http://localhost:5000/api/orders/${id}/deliver`, {}, config)
            .then(async () => {
                const { data } = await axios.get("http://localhost:5000/api/orders", config);
                setOrders(data); 
                setShowOrderModal(false);
            });

        toast.promise(deliverPromise, {
            loading: 'Updating order status...',
            success: 'Order Fulfilled! 🚚',
            error: 'Action failed',
        }).finally(() => setLoading(false));
    };

    const deleteOrderHandler = async (id) => {
        if (window.confirm("Delete this order record permanently?")) {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const deletePromise = axios.delete(`http://localhost:5000/api/orders/${id}`, config)
                .then(() => fetchOrders());

            toast.promise(deletePromise, {
                loading: 'Removing order record...',
                success: 'Order deleted successfully.',
                error: (err) => err.response?.data?.message || "Delete failed",
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const finalData = { ...formData, images: [formData.image], skinType: ["All"], concern: ["Glow"] };
        
        const submitPromise = isEditing 
            ? axios.put(`http://localhost:5000/api/products/${currentId}`, finalData, config)
            : axios.post("http://localhost:5000/api/products", finalData, config);

        toast.promise(submitPromise, {
            loading: isEditing ? 'Updating product...' : 'Saving new product...',
            success: () => {
                setShowDrawer(false);
                setFormData(initialState);
                fetchProducts();
                return isEditing ? "Product Updated! ✨" : "Product Added! 🌸";
            },
            error: (err) => err.response?.data?.message || "Action failed",
        }).finally(() => setLoading(false));
    };

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure?")) {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const deletePromise = axios.delete(`http://localhost:5000/api/products/${id}`, config)
                .then(() => fetchProducts());

            toast.promise(deletePromise, {
                loading: 'Deleting beauty product...',
                success: 'Product removed from Sporsho.',
                error: 'Delete failed',
            });
        }
    };

    const deleteUserHandler = async (id) => {
        if (window.confirm("Are you sure you want to remove this user?")) {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const deletePromise = axios.delete(`http://localhost:5000/api/users/${id}`, config)
                .then(() => fetchUsers());

            toast.promise(deletePromise, {
                loading: 'Removing user account...',
                success: 'User deleted successfully.',
                error: (err) => err.response?.data?.message || "Delete failed",
            });
        }
    };

    const toggleRoleHandler = async (id) => {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const rolePromise = axios.put(`http://localhost:5000/api/users/${id}/role`, {}, config)
            .then(() => fetchUsers());

        toast.promise(rolePromise, {
            loading: 'Updating permissions...',
            success: 'User role changed! 🔑',
            error: 'Role update failed',
        });
    };

    const openEditDrawer = (product) => {
        setIsEditing(true);
        setCurrentId(product._id);
        setFormData({
            name: product.name, description: product.description, price: product.price,
            discountPrice: product.discountPrice || "", brand: product.brand,
            category: product.category, countInStock: product.countInStock, image: product.images[0]
        });
        setShowDrawer(true);
    };

return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-12 px-6">
        <Navbar />
            <div className="max-w-7xl mx-auto">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between">
                        <div><p className="text-gray-900 text-xs font-bold uppercase tracking-widest mb-1">Revenue</p><h2 className="text-3xl text-blue-600 font-black">৳{totalRevenue}</h2></div>
                        <div className="p-4 bg-rose-50 text-rose-500 rounded-3xl"><DollarSign /></div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-900 text-xs font-bold uppercase tracking-widest mb-1">Total Stock</p>
                            <h2 className="text-3xl text-green-900 font-black">{totalPhysicalStock} Units</h2>
                        </div>
                        <div className="p-4 bg-blue-50 text-blue-500 rounded-3xl"><Package /></div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between">
                        <div><p className="text-gray-900 text-xs font-bold uppercase tracking-widest mb-1">Customers</p><h2 className="text-3xl text-purple-600 font-black">{users.length} Total</h2></div>
                        <div className="p-4 bg-purple-50 text-purple-500 rounded-3xl"><Users /></div>
                    </div>
                </div>


    {/* Main Stats Wrapper */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Left Side: Revenue Area Chart */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="text-lg font-black text-gray-800 mb-4 uppercase tracking-tighter">Revenue Growth</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 10}} />
                        <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="sales" stroke="#ec4899" strokeWidth={4} fill="url(#colorSales)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Right Side: Two Mini Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            
            {/* Total Orders Bar Chart */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-pink-500 font-black text-[10px] uppercase tracking-widest">Total Orders</p>
                        <h2 className="text-3xl font-black text-gray-900">{orders?.length || 0}</h2>
                    </div>
                    <div className="p-3 bg-pink-50 text-pink-500 rounded-2xl"><Package size={20}/></div>
                </div>
                <div className="h-[100px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={orderVolumeData}>
                            <Bar dataKey="orders" fill="#ec4899" radius={[6, 6, 0, 0]} />
                            <Tooltip cursor={{fill: '#fdf2f8'}} content={() => null} /> 
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

                {/* Customers Area Chart */}
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-500 font-black text-[10px] uppercase tracking-widest">Total Customers</p>
                            <h2 className="text-3xl font-black text-gray-900">{users?.length || 0}</h2>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl"><Users size={20}/></div>
                    </div>
                    <div className="h-[100px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={customerData}>
                                <Area type="stepAfter" dataKey="count" stroke="#3b82f6" fill="#eff6ff" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
            </div>
        </div>


                {/* Tab Switcher */}
                <div className="flex gap-4 mb-8 bg-white p-2 rounded-3xl w-fit border border-gray-100">
                    <button onClick={() => setActiveTab("inventory")} className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === "inventory" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-900 cursor-pointer"}`}>Inventory</button>
                    <button onClick={() => setActiveTab("orders")} className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === "orders" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-900 cursor-pointer"}`}>Orders</button>
                    <button onClick={() => setActiveTab("users")} className={`px-8 py-3 rounded-2xl font-bold transition-all ${activeTab === "users" ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-900 cursor-pointer"}`}>Users</button>
                </div>



                {/* --- INVENTORY VIEW --- */}
                {activeTab === "inventory" && (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Product List</h1>
                            <button onClick={() => { setIsEditing(false); setFormData(initialState); setShowDrawer(true); }} className="bg-green-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-500 transition-all shadow-lg active:scale-95">
                                <Plus size={20} /> New Product
                            </button>
                        </div>
                        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden text-gray-900 font-black">
                            <table className="w-full text-left">
                                <thead className="bg-blue-100 text-gray-800 text-[18px] font-black uppercase tracking-widest">
                                    <tr>
                                        <th className="p-6">Product</th>
                                        <th className="p-6">Brand</th>
                                        <th className="p-6">Price</th>
                                        <th className="p-6">Stock</th>
                                        <th className="p-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {products.map((p) => (
                                        <tr key={p._id} className="hover:bg-rose-50/10 transition-colors">
                                            <td className="p-6 flex items-center gap-4">
                                                <img src={p.images?.[0]} className="w-12 h-12 rounded-xl object-cover bg-gray-100" alt={p.name} />
                                                <span className="font-black text-gray-900">{p.name}</span>
                                            </td>
                                            <td className="p-6 font-black text-gray-900">{p.brand}</td>
                                            <td className="p-6 font-black text-gray-900">৳{p.price}</td>
                                            <td className="p-6">
                                                <span className={`px-3 py-1 rounded-full text-[12px] font-black ${p.countInStock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {p.countInStock} QTY
                                                </span>
                                            </td>
                                            <td className="p-6 text-right space-x-2">
                                                <button onClick={() => openEditDrawer(p)} className="p-2 text-gray-400 hover:text-blue-500 rounded-xl transition-all"><Edit3 size={18} /></button>
                                                <button onClick={() => deleteHandler(p._id)} className="p-2 text-gray-400 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* --- ORDERS VIEW --- */}
                {activeTab === "orders" && (
                    <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden text-gray-900">
                        <table className="w-full text-left">
                            <thead className="bg-green-100 text-[15px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="p-6">Order ID</th>
                                    <th className="p-6">Date</th>
                                    <th className="p-6">Total</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6 text-right">Details</th>
                                    <th className="p-6 text-right">Action</th> {/* Keep this header */}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.length > 0 ? orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-all font-black">
                                        <td className="p-6">#{order._id.slice(-6)}</td>
                                        <td className="p-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-6">৳{order.totalPrice}</td>
                                        <td className="p-6 font-black text-gray-900">
                                            {order.isDelivered ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[12px] uppercase font-black">Delivered</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[12px] uppercase font-black">Pending</span>
                                            )}
                                        </td>
                                        
                                        {/* DETAILS COLUMN */}
                                        <td className="p-6 text-right">
                                            <button 
                                                onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}
                                                className="p-2 text-gray-800 hover:text-blue-500 cursor-pointer rounded-2xl transition-all"
                                            >
                                                <ArrowRight size={18} strokeWidth={3} />
                                            </button>
                                        </td>

                                        {/* ACTION COLUMN - NEW TD HERE */}
                                        <td className="p-6 text-right">
                                            {order.isDelivered && (
                                                <button 
                                                    onClick={() => deleteOrderHandler(order._id)}
                                                    className="p-2 text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                                                    title="Delete Order Record"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6" className="p-10 text-center text-gray-400">No orders yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* --- USERS VIEW --- */}
                {activeTab === "users" && (
                    <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden text-gray-900">
                        <table className="w-full text-left">
                            <thead className="bg-purple-100 text-[15px] font-black uppercase tracking-widest text-purple-900">
                                <tr>
                                    <th className="p-6">User</th>
                                    <th className="p-6">Email</th>
                                    <th className="p-6">Joined</th>
                                    <th className="p-6">Role</th>
                                    <th className="p-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-purple-50/30 transition-all font-black">
                                        <td className="p-6 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-black">
                                                {user.name.charAt(0)}
                                            </div>
                                            {user.name}
                                        </td>
                                        <td className="p-6 text-gray-500 font-medium">{user.email}</td>
                                        <td className="p-6 font-medium">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="p-6">
                                        <button 
                                            onClick={() => toggleRoleHandler(user._id)}
                                            className="hover:cursor-pointer scale-105 transition-transform"
                                        >
                                            {user.isAdmin ? (
                                            <span className="flex items-center gap-1 text-[10px] bg-yellow-100 px-3 py-1 rounded-full w-fit uppercase font-black text-yellow-700 hover:bg-yellow-200">
                                                <ShieldAlert size={12} /> Admin
                                            </span>
                                            ) : (
                                            <span className="flex items-center gap-1 text-gray-400 text-[10px] bg-gray-100 px-3 py-1 rounded-full w-fit uppercase font-black hover:bg-purple-100 hover:text-purple-600 transition-colors">
                                                <User size={12} /> Customer
                                            </span>
                                            )}
                                        </button>
                                        </td>
                                        <td className="p-6 text-right">
                                        {!user.isAdmin && (
                                            <button 
                                            onClick={() => deleteUserHandler(user._id)}
                                            className="text-red-400 hover:cursor-pointer text-red-600 p-2 transition-colors"
                                            >
                                            <Trash2 size={18} />
                                            </button>
                                        )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

                {/* ORDER MODAL (IMPORTANT: PLACED OUTSIDE THE TABLE) */}
                {showOrderModal && selectedOrder && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
                        <div onClick={() => setShowOrderModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-md" />
                        <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden p-10 text-gray-900">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black italic">Order Details #{selectedOrder._id.slice(-6)}</h2>
                                <button onClick={() => setShowOrderModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</p><p className="font-bold">{selectedOrder.user?.name || "Guest"}</p></div>
                                <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</p><p className="text-sm font-medium">{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}</p></div>
                            </div>
                            <div className="border-t border-b border-gray-100 py-6 mb-8 max-h-48 overflow-y-auto">
                                {selectedOrder.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center mb-3">
                                        <span className="font-bold">{item.qty}x {item.name}</span>
                                        <span className="font-black">৳{item.price * item.qty}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <div><p className="text-xs font-black text-gray-400">Total Price</p><p className="text-3xl font-black">৳{selectedOrder.totalPrice}</p></div>
                                {!selectedOrder.isDelivered ? (
                                    <button onClick={() => deliverHandler(selectedOrder._id)} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase hover:bg-rose-500 transition-all">
                                        Mark as Delivered
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-600 font-black uppercase bg-green-50 px-6 py-3 rounded-2xl">
                                        <CheckCircle2 size={20} /> Delivered
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* PRODUCT DRAWER */}
                <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[100] transform transition-transform duration-500 p-10 overflow-y-auto ${showDrawer ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="flex justify-between items-center mb-10 text-gray-900">
                        <h2 className="text-2xl font-black">{isEditing ? "Edit Product" : "Add to Collection"}</h2>
                        <button onClick={() => setShowDrawer(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative h-44 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden group cursor-pointer">
                            {formData.image ? <img src={formData.image} className="w-full h-full object-cover" alt="preview" /> : <div className="flex flex-col items-center text-gray-400"><Upload size={32} /><span className="text-xs font-black mt-2">Upload Photo</span></div>}
                            <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-rose-500" /></div>}
                        </div>
                        <div className="space-y-4">
                            <div><label className="text-[11px] font-black text-rose-400 uppercase ml-1 block">Product Name</label><input value={formData.name} required className="w-full p-4 border-2 border-black-400 text-gray-600 rounded-2xl font-black" onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                            <div><label className="text-[11px] font-black text-rose-400 uppercase ml-1 block">Brand</label><input value={formData.brand} required className="w-full p-4 border-2 border-black-400 text-gray-600 rounded-2xl font-black" onChange={(e) => setFormData({...formData, brand: e.target.value})} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[11px] font-black text-rose-400 uppercase ml-1 block">Price</label><input value={formData.price} required type="number" className="w-full p-4 border-2 border-black-400 text-gray-600 rounded-2xl font-black" onChange={(e) => setFormData({...formData, price: e.target.value})} /></div>
                                <div><label className="text-[11px] font-black text-rose-400 uppercase ml-1 block">Discount</label><input value={formData.discountPrice} type="number" className="w-full p-4 border-2 border-black-400 text-gray-600 rounded-2xl font-black" onChange={(e) => setFormData({...formData, discountPrice: e.target.value})} /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-[11px] font-black text-rose-400 uppercase ml-1 block">Stock Qty</label><input value={formData.countInStock} required type="number" className="w-full p-4 border-2 border-black-400 text-gray-600 rounded-2xl font-black" onChange={(e) => setFormData({...formData, countInStock: e.target.value})} /></div>
                                <div><label className="text-[11px] font-black text-rose-400 uppercase ml-1 block">Category</label><select value={formData.category} className="w-full p-4 border-2 border-black-400 text-gray-600 rounded-2xl font-black" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                    <option value="Skincare">Skincare</option><option value="Makeup">Makeup</option><option value="Haircare">Haircare</option><option value="Fragrance">Fragrance</option>
                                </select></div>
                            </div>
                            <div><label className="text-[11px] font-black text-rose-400 uppercase ml-1 block">Description</label><textarea value={formData.description} required className="w-full p-4 border-2 border-black-400 text-gray-600 rounded-2xl font-black" onChange={(e) => setFormData({...formData, description: e.target.value})} /></div>
                        </div>
                        <button disabled={loading || uploading} className="w-full bg-gray-800 text-white p-5 rounded-2xl font-black uppercase active:scale-95 hover:bg-gray-400 cursor-pointer">
                            {loading ? <Loader2 className="animate-spin mx-auto" /> : (isEditing ? "Update Product" : "Confirm Product")}
                        </button>
                    </form>
                </div>
                {showDrawer && <div onClick={() => setShowDrawer(false)} className="fixed inset-0 bg-black/10 backdrop-blur-sm z-[90]" />}
            </main>
    );
}