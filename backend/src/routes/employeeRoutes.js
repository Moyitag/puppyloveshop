import express from "express";
import employeeController from "../controllers/employeeController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

router
  .route("/")
  .get(employeeController.getAllEmployees)
  .post(upload.single("image"), employeeController.insertEmployee);

router
  .route("/:id")
  .put(upload.single("image"), employeeController.updateEmployee)
  .delete(employeeController.deleteEmployee);

export default router;
