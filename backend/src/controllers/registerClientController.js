import clientModel from "../models/clients.js";
import bcrypt from "bcryptjs";

const registerClientController = {};

registerClientController.register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    if (!fullName || !email || !password || !phoneNumber) {
      return res.status(400).json({
        message: "fullName, email, password and phoneNumber are required",
      });
    }

    const existingClient = await clientModel.findOne({ email });

    if (existingClient) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newClient = new clientModel({
      fullName,
      email,
      password: passwordHash,
      phoneNumber,
      status: true,
      isVerified: false,
    });

    await newClient.save();

    return res.status(201).json({ message: "Client registered" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerClientController;
