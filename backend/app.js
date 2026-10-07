import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

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
    origin(origin, callback) {
      const isLocalOrigin =
        !origin ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(origin);
      callback(isLocalOrigin ? null : new Error("Origin not allowed by CORS"), isLocalOrigin);
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(
  express.json({
    verify(req, _res, buffer) {
      req.rawBody = buffer;
    },
  })
);
app.use(limiter);
app.use(
  "/uploads",
  express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "uploads"))
);

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

app.use((error, req, res, next) => {
  if (!error) return next();
  console.error(error);
  if (error.name === "MulterError" || error.message === "Only image files are allowed") {
    return res.status(400).json({ message: error.message });
  }
  return res.status(500).json({ message: "Could not upload the image" });
});

export default app;
