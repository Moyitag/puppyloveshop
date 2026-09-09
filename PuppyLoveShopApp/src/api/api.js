import axios from "axios";

// Cambia esto por la IP local de tu PC (donde corre "npm start" del backend) y el puerto 4000
export const API_URL = "http://192.168.1.100:4000/api";

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
export const logout = () => api.post("/logout");

// --- Products ---
// Campos reales: productName, images[], description, productType, categories[],
// variants: [{ size, color, stock }], price, supplierId
export const getProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);

// --- Reviews (ProductReview) ---
// Campos reales: rating, title, experienceType, details, userId, productId, certifiedPurchase
export const getReviewsByProduct = (productId) =>
  api.get(`/productReview/product/${productId}`);
export const createReview = (data) => api.post("/productReview", data);

// --- ShoppingCart ---
// No existe "un carrito por cliente" con endpoint propio: se listan todos y se filtra por userId.
// products: [{ productId, amount, subtotal }], total, discount, totalWithDiscount
export const getAllCarts = () => api.get("/shoppingCart");
export const createCart = (data) => api.post("/shoppingCart", data);
export const updateCart = (cartId, data) => api.put(`/shoppingCart/${cartId}`, data);
export const deleteCart = (cartId) => api.delete(`/shoppingCart/${cartId}`);

// --- Sales ---
// Se crea a partir de un carrito ya existente: shoppingCartId, deliveryAddress, paymentMethod
export const getAllSales = () => api.get("/sales");
export const createSale = (data) => api.post("/sales", data);

export default api;
