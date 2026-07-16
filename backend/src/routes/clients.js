import express from "express";
import clientsController from "../controllers/clientsController.js";

const router = express.Router();

router.route("/").get(clientsController.getAllClients);

router
  .route("/:id")
  .get(clientsController.getClientById)
  .put(clientsController.updateClient)
  .delete(clientsController.deleteClient);

export default router;
