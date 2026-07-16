import administratorModel from "../models/administrator.js";
import bcrypt from "bcryptjs";

const administratorController = {};

//SELECT
administratorController.getAllAdministrators = async (req, res) => {
  try {
    const administrators = await administratorModel.find().select("-password");
    return res.status(200).json(administrators);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//SELECT by id
administratorController.getAdministratorById = async (req, res) => {
  try {
    const administrator = await administratorModel
      .findById(req.params.id)
      .select("-password");

    if (!administrator) {
      return res.status(404).json({ message: "Administrator not found" });
    }

    return res.status(200).json(administrator);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//INSERT
administratorController.insertAdministrator = async (req, res) => {
  try {
    const { fullName, email, password, status } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "fullName, email and password are required" });
    }

    const existingAdministrator = await administratorModel.findOne({ email });

    if (existingAdministrator) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newAdministrator = new administratorModel({
      fullName,
      email,
      password: passwordHash,
      status,
    });

    await newAdministrator.save();

    return res.status(201).json({ message: "Administrator saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//UPDATE
administratorController.updateAdministrator = async (req, res) => {
  try {
    const { fullName, email, password, status } = req.body;

    const updatedData = { fullName, email, status };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdministrator = await administratorModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedAdministrator) {
      return res.status(404).json({ message: "Administrator not found" });
    }

    return res.status(200).json({ message: "Administrator updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE
administratorController.deleteAdministrator = async (req, res) => {
  try {
    const deletedAdministrator = await administratorModel.findByIdAndDelete(
      req.params.id
    );

    if (!deletedAdministrator) {
      return res.status(404).json({ message: "Administrator not found" });
    }

    return res.status(200).json({ message: "Administrator deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default administratorController;
