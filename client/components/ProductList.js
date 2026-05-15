"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit, ExternalLink } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast"; // Added import

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const { userInfo } = useAuthStore();

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    // Keep the confirm window for safety—deleting is permanent!
    if (window.confirm("Are you sure you want to delete this beauty?")) {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      // Define the delete promise
      const deleteRequest = axios.delete(`http://localhost:5000/api/products/${id}`, config)
        .then(() => fetchProducts()); // Refresh list on success

      toast.promise(
        deleteRequest,
        {
          loading: 'Removing product from catalog...',
          success: 'Product deleted successfully! 🗑️',
          error: 'Could not delete product. Please try again.',
        },
        {
          style: {
            borderRadius: '15px',
            background: '#333',
            color: '#fff',
            fontWeight: '600',
          },
          success: {
            iconTheme: { primary: '#F43F5E', secondary: '#fff' },
          },
        }
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-gray-400 text-sm uppercase tracking-widest">
            <th className="pb-4 pl-4">Product</th>
            <th className="pb-4">Category</th>
            <th className="pb-4">Price</th>
            <th className="pb-4 text-right pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="bg-white hover:bg-rose-50/50 transition-colors group rounded-2xl shadow-sm border border-gray-100">
              <td className="py-4 pl-4 rounded-l-2xl">
                <div className="flex items-center gap-4">
                  <img src={product.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  <span className="font-bold text-gray-800">{product.name}</span>
                </div>
              </td>
              <td className="py-4 text-gray-500 font-medium">{product.brand}</td>
              <td className="py-4 font-bold text-gray-900">৳{product.price}</td>
              <td className="py-4 text-right pr-4 rounded-r-2xl">
                <div className="flex justify-end gap-2">
                  <button onClick={() => deleteHandler(product._id)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}