import express from "express";
import planController from "../controllers/planController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

router
  .route("/")
  .get(planController.getAllPlans)
  .post(upload.single("image"), planController.insertPlan);

router
  .route("/:id")
  .put(upload.single("image"), planController.updatePlan)
  .delete(planController.deletePlan);

export default router;
