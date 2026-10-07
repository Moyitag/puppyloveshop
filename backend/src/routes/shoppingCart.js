import express from "express";
import shoppingCartController from "../controllers/shoppingCartController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/mine",
  validateAuthCookie(["client", "admin"]),
  shoppingCartController.getMyCart
);

router
  .route("/")
  .get(validateAuthCookie(["admin"]), shoppingCartController.getAllCarts)
  .post(validateAuthCookie(["client"]), shoppingCartController.insertCart);

router
  .route("/:id")
  .get(validateAuthCookie(["client", "admin"]), shoppingCartController.getCartById)
  .put(validateAuthCookie(["client", "admin"]), shoppingCartController.updateCart)
  .delete(validateAuthCookie(["client", "admin"]), shoppingCartController.deleteCart);

export default router;
