"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import axios from "axios";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// 1. We move the form logic into its own component
function RegisterForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";
    const { userInfo, setUserInfo } = useAuthStore();

    useEffect(() => {
        if (userInfo) {
            router.push(redirect);
        }
    }, [userInfo, redirect, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match!", {
                style: { borderRadius: '15px', fontWeight: '600' }
            });
        }

        setLoading(true);

        // Use the live API URL from environment variables
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const registerRequest = axios.post(`${apiUrl}/api/users`, { name, email, password })
            .then((res) => {
                setUserInfo(res.data);
                return res.data;
            });

        toast.promise(
            registerRequest,
            {
                loading: 'Creating your Sporsho account...',
                success: (data) => `Welcome to Sporsho, ${data.name.split(' ')[0]}! ✨`,
                error: (err) => err.response?.data?.message || "Registration failed",
            },
            {
                style: { borderRadius: '20px', background: '#333', color: '#fff' },
                success: { duration: 5000, iconTheme: { primary: '#F43F5E', secondary: '#fff' } },
            }
        ).finally(() => {
            setLoading(false);
        });
    };

    return (
        <main className="min-h-screen bg-purple-100 flex items-center justify-center p-6 pt-32">
            <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-xl border border-rose-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-gray-900 flex items-center justify-center gap-2">
                         Join <span className="text-3xl font-black text-rose-500">Sporsho</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Start your beauty journey with us</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                        <input 
                            required 
                            type="text" 
                            placeholder="Full Name" 
                            className="w-full p-4 pl-12 bg-gray-50 border-2 border-gray-100 text-gray-900 placeholder:text-gray-400 rounded-2xl outline-none transition-all focus:bg-white focus:border-rose-300 focus:shadow-lg focus:shadow-rose-100/50"
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>

                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                        <input 
                            required 
                            type="email" 
                            placeholder="Email Address" 
                            className="w-full p-4 pl-12 bg-gray-50 border-2 border-gray-100 text-gray-900 placeholder:text-gray-400 rounded-2xl outline-none transition-all focus:bg-white focus:border-rose-300 focus:shadow-lg focus:shadow-rose-100/50"
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                        <input 
                            required 
                            type="password" 
                            placeholder="Password" 
                            className="w-full p-4 pl-12 bg-gray-50 border-2 border-gray-100 text-gray-900 placeholder:text-gray-400 rounded-2xl outline-none transition-all focus:bg-white focus:border-rose-300 focus:shadow-lg focus:shadow-rose-100/50"
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500 transition-colors" size={18} />
                        <input 
                            required 
                            type="password" 
                            placeholder="Confirm Password" 
                            className="w-full p-4 pl-12 bg-gray-50 border-2 border-gray-100 text-gray-900 placeholder:text-gray-400 rounded-2xl outline-none transition-all focus:bg-white focus:border-rose-300 focus:shadow-lg focus:shadow-rose-100/50"
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                    </div>

                    <button 
                        disabled={loading} 
                        className="w-full bg-rose-500 cursor-pointer text-white p-5 rounded-2xl font-bold hover:bg-rose-600 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-500 text-sm">
                    Already have an account? <Link href="/login" className="text-rose-500 font-bold hover:underline">Login here</Link>
                </p>
            </div>
        </main>
    );
}

// 2. The main page component wraps the form in Suspense
export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-purple-50 font-black text-rose-400 animate-pulse">
                PREPARING SPORSHO...
            </div>
        }>
            <RegisterForm />
        </Suspense>
    );
}