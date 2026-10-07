import express from "express";
import salesController from "../controllers/salesController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(validateAuthCookie(["client", "admin"]), salesController.getAllSales)
  .post(validateAuthCookie(["client"]), salesController.insertSale);

router
  .route("/:id")
  .get(validateAuthCookie(["client", "admin"]), salesController.getSaleById)
  .put(validateAuthCookie(["admin"]), salesController.updateSale)
  .delete(validateAuthCookie(["admin"]), salesController.deleteSale);

export default router;
