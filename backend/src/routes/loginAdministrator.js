import express from "express";
import loginAdministratorController from "../controllers/loginAdministratorController.js";

const router = express.Router();

router.route("/").post(loginAdministratorController.login);

export default router;
