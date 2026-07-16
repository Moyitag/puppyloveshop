import express from "express";
import administratorController from "../controllers/administratorController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(validateAuthCookie(["admin"]), administratorController.getAllAdministrators)
  .post(administratorController.insertAdministrator);

router
  .route("/:id")
  .get(validateAuthCookie(["admin"]), administratorController.getAdministratorById)
  .put(validateAuthCookie(["admin"]), administratorController.updateAdministrator)
  .delete(validateAuthCookie(["admin"]), administratorController.deleteAdministrator);

export default router;
