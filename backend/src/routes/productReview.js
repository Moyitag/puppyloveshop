import express from "express";
import productReviewController from "../controllers/productReviewController.js";

const router = express.Router();

router
  .route("/")
  .get(productReviewController.getAllReviews)
  .post(productReviewController.insertReview);

router.route("/product/:productId").get(productReviewController.getReviewsByProduct);

router
  .route("/:id")
  .get(productReviewController.getReviewById)
  .put(productReviewController.updateReview)
  .delete(productReviewController.deleteReview);

export default router;
