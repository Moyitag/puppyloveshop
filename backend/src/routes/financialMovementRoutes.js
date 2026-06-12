import express from "express";
import financialMovementController from "../controllers/financialMovementController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

router
  .route("/")
  .get(financialMovementController.getAllFinancialMovements)
  .post(
    upload.single("image"),
    financialMovementController.insertFinancialMovement
  );

router
  .route("/:id")
  .put(
    upload.single("image"),
    financialMovementController.updateFinancialMovement
  )
  .delete(financialMovementController.deleteFinancialMovement);

export default router;
