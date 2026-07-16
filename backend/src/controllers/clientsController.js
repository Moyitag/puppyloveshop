import clientModel from "../models/clients.js";
import bcrypt from "bcryptjs";

const clientsController = {};

//SELECT
clientsController.getAllClients = async (req, res) => {
  try {
    const clients = await clientModel.find().select("-password");
    return res.status(200).json(clients);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//SELECT by id
clientsController.getClientById = async (req, res) => {
  try {
    const client = await clientModel.findById(req.params.id).select("-password");

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json(client);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//UPDATE
clientsController.updateClient = async (req, res) => {
  try {
    let { fullName, email, password, phoneNumber, status, isVerified } =
      req.body;

    fullName = fullName?.trim();
    email = email?.trim();

    const updatedData = { fullName, email, phoneNumber, status, isVerified };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedClient = await clientModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json({ message: "Client updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE
clientsController.deleteClient = async (req, res) => {
  try {
    const deletedClient = await clientModel.findByIdAndDelete(req.params.id);

    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json({ message: "Client deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default clientsController;
