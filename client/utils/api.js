import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// These are the only things your frontend needs to know
export const fetchProducts = () => API.get('/products');

export const uploadImage = (formData) => API.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export default API;