"use client";
import { useState } from "react";
import axios from "axios";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast"; // Added import

export default function AddProductModal() {
  const { userInfo } = useAuthStore();
  const [formData, setFormData] = useState({ name: "", price: "", brand: "", category: "Makeup", description: "" });
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const data = new FormData();
    data.append("image", file);
    setUploading(true);

    const uploadPromise = axios.post("${API_URL}/api/upload", data, {
      headers: { 
        "Content-Type": "multipart/form-data", 
        Authorization: `Bearer ${userInfo?.token}` 
      }
    }).then(res => {
      setImage(res.data.url);
      return res.data;
    });

    toast.promise(uploadPromise, {
      loading: 'Uploading beauty shot...',
      success: 'Image uploaded successfully! 📸',
      error: 'Upload failed. Are you logged in as Admin?',
    }, {
      style: { borderRadius: '20px', fontWeight: '600' }
    }).finally(() => setUploading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please upload an image first");
    
    setSaving(true);
    const productData = { ...formData, images: [image] };
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

    const savePromise = axios.post("${API_URL}/api/products", productData, config)
      .then(() => {
        // Optional: short delay before reload so they can see the success toast
        setTimeout(() => window.location.reload(), 1500);
      });

    toast.promise(savePromise, {
      loading: 'Publishing to Sporsho catalog...',
      success: 'Product Added Successfully! ✨',
      error: 'Error saving product. Check backend terminal.',
    }, {
      style: { borderRadius: '20px', fontWeight: '600' },
      success: { iconTheme: { primary: '#F43F5E', secondary: '#fff' } }
    }).finally(() => setSaving(false));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">New Product</h2>
      <div className="space-y-3">
        <input required type="text" placeholder="Product Name" className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-rose-300" 
          onChange={(e) => setFormData({...formData, name: e.target.value})} />
        <div className="flex gap-4">
          <input required type="number" placeholder="Price (৳)" className="w-1/2 p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-rose-300" 
            onChange={(e) => setFormData({...formData, price: e.target.value})} />
          <input required type="text" placeholder="Brand" className="w-1/2 p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-rose-300" 
            onChange={(e) => setFormData({...formData, brand: e.target.value})} />
        </div>
        <textarea placeholder="Description" className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 outline-none h-24 focus:ring-2 focus:ring-rose-300" 
          onChange={(e) => setFormData({...formData, description: e.target.value})} />
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-[2rem] cursor-pointer hover:bg-gray-50 transition-all relative overflow-hidden text-gray-900">
          {image ? <img src={image} className="w-full h-full object-cover" alt="Preview" /> : (
            <div className="flex flex-col items-center text-gray-400">
              {uploading ? <Loader2 className="animate-spin" /> : <Upload size={30} />}
              <span className="text-xs mt-2">{uploading ? "Uploading..." : "Click to upload image"}</span>
            </div>
          )}
          <input type="file" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>
      <button disabled={saving || uploading} className="w-full bg-gray-900 text-white p-5 rounded-2xl font-bold hover:bg-rose-600 transition-all disabled:bg-gray-300 flex items-center justify-center gap-2">
        {saving ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
        {saving ? "Saving..." : "Publish Product"}
      </button>
    </form>
  );
}