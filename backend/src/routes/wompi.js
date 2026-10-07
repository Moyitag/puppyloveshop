import express from "express";
import wompiController from "../controllers/wompiController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/card-payment",
  validateAuthCookie(["client"]),
  wompiController.cardPayment
);
router.post("/webhook", wompiController.webhook);

export default router;
