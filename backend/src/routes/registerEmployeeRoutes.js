import express from "express";
import employeeController from "../controllers/employeeController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

router.route("/").post(upload.single("image"), employeeController.insertEmployee);

export default router;
