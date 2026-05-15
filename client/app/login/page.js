"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import axios from "axios";
import { Mail, Lock, Loader2, LogIn } from "lucide-react";
import toast from "react-hot-toast"; // 1. Added missing import

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        setLoading(true);

        // 2. Wrap the axios call in a promise toast
        const loginRequest = axios.post("http://localhost:5000/api/users/login", { email, password })
            .then((res) => {
                setUserInfo(res.data);
                return res.data;
            });

        toast.promise(
            loginRequest,
            {
                loading: 'Authenticating...',
                success: (data) => `Welcome back, ${data.name || 'User'}! ✨`,
                error: (err) => err.response?.data?.message || "Login failed. Check your credentials.",
            },
            {
                style: {
                    borderRadius: '20px',
                    background: '#333',
                    color: '#fff',
                },
                success: {
                    duration: 4000,
                    iconTheme: { primary: '#F43F5E', secondary: '#fff' }, // Rose-500 matches your theme
                },
            }
        ).finally(() => {
            setLoading(false);
        });
    };

    return (
        <main className="min-h-screen bg-rose-50 flex items-center justify-center p-6 pt-32">
            <div className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-xl border border-rose-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-gray-900 flex items-center justify-center gap-2">
                        <LogIn className="text-rose-500" /> Welcome Back
                    </h1>
                    <p className="text-gray-400 mt-2">Sign in to your Sporsho account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                            required 
                            type="email" 
                            placeholder="Email Address" 
                            className="w-full p-4 pl-12 bg-gray-50 border border-transparent focus:border-rose-200 focus:bg-white rounded-2xl outline-none transition-all text-gray-900"
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                            required 
                            type="password" 
                            placeholder="Password" 
                            className="w-full p-4 pl-12 bg-gray-50 border border-transparent focus:border-rose-200 focus:bg-white rounded-2xl outline-none transition-all text-gray-900"
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>

                    <button 
                        disabled={loading} 
                        // 3. Changed bg-blue-400 to bg-rose-500 for better brand consistency
                        className="w-full bg-rose-500 text-white p-5 rounded-2xl font-bold hover:bg-rose-600 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-50 text-center space-y-4">
                    <p className="text-gray-500 text-sm">
                        New to Sporsho? <Link href={`/register?redirect=${redirect}`} className="text-rose-500 font-bold hover:underline">Create an account</Link>
                    </p>
                    <Link href="/" className="block text-gray-400 text-xs hover:text-gray-600 transition-colors">
                        ← Back to home
                    </Link>
                </div>
            </div>
        </main>
    );
}