import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import QuickMenuBar from "../components/QuickMenuBar"; 
import CartDrawer from "../components/CartDrawer";
import SmoothScroll from "../components/SmoothScroll";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sporsho | Premium Cosmetics",
  description: "Luxury cosmetics shop by TouchPad Solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Toaster position="bottom-right" reverseOrder={false} />
        <SmoothScroll>
          <Navbar />
          <QuickMenuBar /> {/* 2. Place it here so it appears on all pages */}
          <CartDrawer />         
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}