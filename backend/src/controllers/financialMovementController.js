import financialMovementModel from "../models/financialMovement.js";
import { v2 as cloudinary } from "cloudinary";

const financialMovementController = {};

financialMovementController.getAllFinancialMovements = async (req, res) => {
  try {
    const financialMovements = await financialMovementModel.find();
    return res.status(200).json(financialMovements);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

financialMovementController.insertFinancialMovement = async (req, res) => {
  try {
    const { nombre, type, gasto, descripcion, activo } = req.body;

    if (!nombre || gasto === undefined || gasto === "") {
      return res.status(400).json({
        message: "Nombre y monto son obligatorios",
      });
    }

    const newFinancialMovement = new financialMovementModel({
      nombre,
      type,
      gasto,
      descripcion,
      activo,
      foto: req.file?.path,
      public_id: req.file?.filename,
    });

    await newFinancialMovement.save();

    return res.status(200).json({ message: "Financial movement saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

financialMovementController.deleteFinancialMovement = async (req, res) => {
  try {
    const financialMovementFound = await financialMovementModel.findById(
      req.params.id
    );

    if (!financialMovementFound) {
      return res.status(404).json({ message: "Financial movement not found" });
    }

    if (financialMovementFound.public_id) {
      await cloudinary.uploader.destroy(financialMovementFound.public_id);
    }

    await financialMovementModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Financial movement deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

financialMovementController.updateFinancialMovement = async (req, res) => {
  try {
    const { nombre, type, gasto, descripcion, activo } = req.body;

    if (!nombre || gasto === undefined || gasto === "") {
      return res.status(400).json({
        message: "Nombre y monto son obligatorios",
      });
    }

    const financialMovementFound = await financialMovementModel.findById(
      req.params.id
    );

    if (!financialMovementFound) {
      return res.status(404).json({ message: "Financial movement not found" });
    }

    const updatedData = {
      nombre,
      type,
      gasto,
      descripcion,
      activo,
    };

    if (req.file) {
      if (financialMovementFound.public_id) {
        await cloudinary.uploader.destroy(financialMovementFound.public_id);
      }

      updatedData.foto = req.file.path;
      updatedData.public_id = req.file.filename;
    }

    await financialMovementModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    return res.status(200).json({ message: "Financial movement updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default financialMovementController;
