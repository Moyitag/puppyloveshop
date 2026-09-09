import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cambia esto por la URL real de tu backend (IP local en desarrollo, dominio en producción)
export const API_URL = "http://192.168.1.100:4000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Adjunta el JWT guardado a cada request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("puppy_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth ---
export const loginClient = (data) => api.post("/clients/login", data);
export const registerClient = (data) => api.post("/clients/register", data);

// --- Products ---
export const getProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);
export const getSubCategories = () => api.get("/subcategory");
export const getProductsBySubCategory = (subCategoryId) =>
  api.get(`/products?subCategoryId=${subCategoryId}`);

// --- Reviews ---
export const getReviewsByProduct = (productId) =>
  api.get(`/productreview/product/${productId}`);
export const createReview = (data) => api.post("/productreview", data);

// --- Cart ---
export const getCart = (clientId) => api.get(`/shoppingcart/${clientId}`);
export const addToCart = (data) => api.post("/shoppingcart", data);
export const updateCartItem = (id, data) => api.put(`/shoppingcart/${id}`, data);
export const removeFromCart = (id) => api.delete(`/shoppingcart/${id}`);

// --- Sales (checkout) ---
export const createSale = (data) => api.post("/sales", data);
export const getSalesByClient = (clientId) => api.get(`/sales/client/${clientId}`);

export default api;
