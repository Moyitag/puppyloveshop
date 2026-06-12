import planModel from "../models/plan.js";
import { v2 as cloudinary } from "cloudinary";

const planController = {};

planController.getAllPlans = async (req, res) => {
  try {
    const plans = await planModel.find();
    return res.status(200).json(plans);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

planController.insertPlan = async (req, res) => {
  try {
    const {
      nombre,
      precioMensual,
      precioAnual,
      descripcion,
      features,
      tipoMascota,
      activo,
    } = req.body;

    if (!nombre || precioMensual === undefined || precioMensual === "") {
      return res.status(400).json({
        message: "Nombre y precio mensual son obligatorios",
      });
    }

    const newPlan = new planModel({
      nombre,
      precioMensual,
      precioAnual,
      descripcion,
      features,
      tipoMascota,
      activo,
      foto: req.file?.path,
      public_id: req.file?.filename,
    });

    await newPlan.save();

    return res.status(200).json({ message: "Plan saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

planController.deletePlan = async (req, res) => {
  try {
    const planFound = await planModel.findById(req.params.id);

    if (!planFound) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (planFound.public_id) {
      await cloudinary.uploader.destroy(planFound.public_id);
    }

    await planModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Plan deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

planController.updatePlan = async (req, res) => {
  try {
    const {
      nombre,
      precioMensual,
      precioAnual,
      descripcion,
      features,
      tipoMascota,
      activo,
    } = req.body;

    if (!nombre || precioMensual === undefined || precioMensual === "") {
      return res.status(400).json({
        message: "Nombre y precio mensual son obligatorios",
      });
    }

    const planFound = await planModel.findById(req.params.id);

    if (!planFound) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const updatedData = {
      nombre,
      precioMensual,
      precioAnual,
      descripcion,
      features,
      tipoMascota,
      activo,
    };

    if (req.file) {
      if (planFound.public_id) {
        await cloudinary.uploader.destroy(planFound.public_id);
      }

      updatedData.foto = req.file.path;
      updatedData.public_id = req.file.filename;
    }

    await planModel.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    return res.status(200).json({ message: "Plan updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default planController;
