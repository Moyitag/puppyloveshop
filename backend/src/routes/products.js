import express from "express";
import productsController from "../controllers/productsController.js";
import upload from "../utils/cloudinaryConfig.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(productsController.getAllProducts)
  .post(
    validateAuthCookie(["admin"]),
    upload.array("images", 5),
    productsController.insertProduct
  );

router
  .route("/:id")
  .get(productsController.getProductById)
  .put(
    validateAuthCookie(["admin"]),
    upload.array("images", 5),
    productsController.updateProduct
  )
  .delete(validateAuthCookie(["admin"]), productsController.deleteProduct);

export default router;
