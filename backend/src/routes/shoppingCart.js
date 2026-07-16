import express from "express";
import shoppingCartController from "../controllers/shoppingCartController.js";

const router = express.Router();

router
  .route("/")
  .get(shoppingCartController.getAllCarts)
  .post(shoppingCartController.insertCart);

router
  .route("/:id")
  .get(shoppingCartController.getCartById)
  .put(shoppingCartController.updateCart)
  .delete(shoppingCartController.deleteCart);

export default router;
