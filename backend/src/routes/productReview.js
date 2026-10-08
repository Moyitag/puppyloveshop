import express from "express";
import productReviewController from "../controllers/productReviewController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(productReviewController.getAllReviews)
  .post(validateAuthCookie(["client"]), productReviewController.insertReview);

router.route("/product/:productId").get(productReviewController.getReviewsByProduct);

router
  .route("/:id")
  .get(productReviewController.getReviewById)
  .put(validateAuthCookie(["client", "admin"]), productReviewController.updateReview)
  .delete(validateAuthCookie(["client", "admin"]), productReviewController.deleteReview);

export default router;
