import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import employeeRoutes from "./src/routes/employeeRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import financialMovementRoutes from "./src/routes/financialMovementRoutes.js";
import planRoutes from "./src/routes/planRoutes.js";
import loginEmployeeRoutes from "./src/routes/loginEmployeeRoutes.js";
import logoutRoutes from "./src/routes/logoutRoutes.js";
import registerEmployeeRoutes from "./src/routes/registerEmployeeRoutes.js";
import validateAuth from "./src/middlewares/validateAuth.js";

const app = express();
//sadf
app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174"],
    credentials:true
}),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Puppy Love Shop API" });
});

app.use("/api/login", loginEmployeeRoutes);
app.use("/api/loginEmployee", loginEmployeeRoutes);
app.use("/api/employees/login", loginEmployeeRoutes);
app.use("/api/registerEmployee", registerEmployeeRoutes);
app.use("/api/employees/register", registerEmployeeRoutes);
app.use("/api/employees/logout", validateAuth, logoutRoutes);
app.use("/api/employees", validateAuth, employeeRoutes);
app.use("/api/products", validateAuth, productRoutes);
app.use("/api/financial-movements", validateAuth, financialMovementRoutes);
app.use("/api/plans", validateAuth, planRoutes);
app.use("/api/logout", validateAuth, logoutRoutes);
app.use("/api/logoutEmployee", validateAuth, logoutRoutes);

app.use((error, req, res, next) => {
    console.log("error" + error);
    return res.status(400).json({
        message: error.message || "No se pudo procesar la imagen o los datos enviadoss",
    });
});

export default app;
