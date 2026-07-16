import express from "express";
import salesController from "../controllers/salesController.js";

const router = express.Router();

router
  .route("/")
  .get(salesController.getAllSales)
  .post(salesController.insertSale);

router
  .route("/:id")
  .get(salesController.getSaleById)
  .put(salesController.updateSale)
  .delete(salesController.deleteSale);

export default router;
