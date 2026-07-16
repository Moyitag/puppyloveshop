import express from "express";
import administratorController from "../controllers/administratorController.js";

const router = express.Router();

router
  .route("/")
  .get(administratorController.getAllAdministrators)
  .post(administratorController.insertAdministrator);

router
  .route("/:id")
  .get(administratorController.getAdministratorById)
  .put(administratorController.updateAdministrator)
  .delete(administratorController.deleteAdministrator);

export default router;
