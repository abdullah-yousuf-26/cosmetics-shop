import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: '${API_URL}/api',
});

// These are the only things your frontend needs to know
export const fetchProducts = () => API.get('/products');

export const uploadImage = (formData) => API.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default API;