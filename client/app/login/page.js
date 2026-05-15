"use client";
import { Suspense } from "react";
import LoginForm from "./LoginForm"; // We will create this below

export default function LoginPage() {
    return (
        // Suspense boundary tells Vercel: "Don't worry about the searchParams during build!"
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-rose-50">
                <div className="animate-pulse font-black text-rose-400 uppercase tracking-widest">
                    Sporsho Loading...
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}