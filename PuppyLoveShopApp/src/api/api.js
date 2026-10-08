import axios from "axios";
import { Platform } from "react-native";
import Constants from "expo-constants";

// En Expo Go tomamos la IP del mismo servidor que sirve la app.
const expoHost = Constants.expoConfig?.hostUri?.split(":")[0];
const developmentHost =
  Platform.OS === "web" && typeof window !== "undefined"
    ? window.location.hostname
    : expoHost || "192.168.1.17";
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || `http://${developmentHost}:4000/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: true, // el backend usa cookie httpOnly (authCookie) para sesión
});

// --- Auth (Clients) ---
// Backend real: POST /api/registerClient  { fullName, email, password, phoneNumber }
export const registerClient = (data) => api.post("/registerClient", data);
// Backend real: POST /api/loginClient  { email, password } -> setea cookie httpOnly
// y responde { message, id, fullName }
export const loginClient = (data) => api.post("/loginClient", data);
export const requestPasswordReset = (email) => api.post("/password-recovery/request", { email });
export const resetPassword = (data) => api.post("/password-recovery/reset", data);
export const logout = () => api.post("/logout");

// --- Products ---
// Campos reales: productName, images[], description, productType, categories[],
// variants: [{ size, color, stock }], price, supplierId
export const getProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);

// --- Reviews (ProductReview) ---
// Campos reales: rating, title, experienceType, details, userId, productId, certifiedPurchase
export const getAllReviews = () => api.get("/productReview");
export const getReviewsByProduct = (productId) =>
  api.get(`/productReview/product/${productId}`);
export const createReview = (data) => api.post("/productReview", data);
// PUT solo actualiza: rating, title, experienceType, details, active
export const updateReview = (id, data) => api.put(`/productReview/${id}`, data);
export const deleteReview = (id) => api.delete(`/productReview/${id}`);

// --- ShoppingCart ---
// No existe "un carrito por cliente" con endpoint propio: se listan todos y se filtra por userId.
// products: [{ productId, amount, subtotal }], total, discount, totalWithDiscount
export const getMyCart = () => api.get("/shoppingCart/mine");
export const createCart = (data) => api.post("/shoppingCart", data);
export const updateCart = (cartId, data) => api.put(`/shoppingCart/${cartId}`, data);
export const deleteCart = (cartId) => api.delete(`/shoppingCart/${cartId}`);

// --- Sales ---
// Se crea a partir de un carrito ya existente: shoppingCartId, deliveryAddress, paymentMethod
export const getAllSales = () => api.get("/sales");
export const createSale = (data) => api.post("/sales", data);
export const startWompiPayment = (data) => api.post("/wompi/card-payment", data);

export default api;
