import express from "express";
import registerClientController from "../controllers/registerClientController.js";

const router = express.Router();

router.route("/").post(registerClientController.register);

export default router;
