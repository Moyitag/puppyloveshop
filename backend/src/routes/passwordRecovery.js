import express from "express";
import rateLimit from "express-rate-limit";
import { requestReset, resetPassword } from "../controllers/passwordRecoveryController.js";

const router = express.Router();
const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Demasiados intentos. Intenta de nuevo en unos minutos." },
});
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Demasiados intentos. Intenta de nuevo en unos minutos." },
});

router.post("/request", requestLimiter, requestReset);
router.post("/reset", resetLimiter, resetPassword);

export default router;
