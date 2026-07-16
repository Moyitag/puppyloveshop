import express from "express";
import suppliersController from "../controllers/suppliersController.js";

const router = express.Router();

router
  .route("/")
  .get(suppliersController.getAllSuppliers)
  .post(suppliersController.insertSupplier);

router
  .route("/:id")
  .get(suppliersController.getSupplierById)
  .put(suppliersController.updateSupplier)
  .delete(suppliersController.deleteSupplier);

export default router;
