import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import administratorRoutes from "./src/routes/administrator.js";
import loginAdministratorRoutes from "./src/routes/loginAdministrator.js";
import clientsRoutes from "./src/routes/clients.js";
import registerClientRoutes from "./src/routes/registerClient.js";
import loginClientRoutes from "./src/routes/loginClient.js";
import logoutRoutes from "./src/routes/logout.js";
import suppliersRoutes from "./src/routes/suppliers.js";
import productsRoutes from "./src/routes/products.js";
import shoppingCartRoutes from "./src/routes/shoppingCart.js";
import salesRoutes from "./src/routes/sales.js";
import productReviewRoutes from "./src/routes/productReview.js";
import wompiRoutes from "./src/routes/wompi.js";

import limiter from "./src/middlewares/rateLimiter.js";
import { validateAuthCookie } from "./src/middlewares/authMiddleware.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(limiter);

//Autenticación
app.use("/api/loginAdministrator", loginAdministratorRoutes);
app.use("/api/registerClient", registerClientRoutes);
app.use("/api/loginClient", loginClientRoutes);
app.use("/api/logout", logoutRoutes);

//Administrator: creación abierta (bootstrap), lectura/edición/borrado protegidas por ruta
app.use("/api/administrator", administratorRoutes);

//Suppliers: solo administradores gestionan proveedores
app.use("/api/suppliers", validateAuthCookie(["admin"]), suppliersRoutes);

//Clients: un administrador gestiona (lista/edita/elimina) clientes
app.use("/api/clients", validateAuthCookie(["admin"]), clientsRoutes);

//Products: lectura pública, escritura solo administradores
app.use("/api/products", productsRoutes);

//ShoppingCart, Sales y ProductReview: uso funcional abierto para clientes/administradores
app.use("/api/shoppingCart", shoppingCartRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/productReview", productReviewRoutes);
app.use("/api/wompi", wompiRoutes);

export default app;
