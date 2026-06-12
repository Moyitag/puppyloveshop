import employeeModel from "../models/employee.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

const employeeController = {};

employeeController.getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeModel.find();
    return res.status(200).json(employees);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

employeeController.insertEmployee = async (req, res) => {
  try {
    const { nombre, telefono, email, password, cargo, activo } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        message: "Nombre, email y contraseña son obligatorios",
      });
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

    const newEmployee = new employeeModel({
      nombre,
      telefono,
      email,
      password: passwordHash,
      cargo,
      activo,
      foto: req.file?.path,
      public_id: req.file?.filename,
    });

    await newEmployee.save();

    return res.status(200).json({ message: "Employee saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

employeeController.deleteEmployee = async (req, res) => {
  try {
    const employeeFound = await employeeModel.findById(req.params.id);

    if (!employeeFound) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employeeFound.public_id) {
      await cloudinary.uploader.destroy(employeeFound.public_id);
    }

    await employeeModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

employeeController.updateEmployee = async (req, res) => {
  try {
    const { nombre, telefono, email, password, cargo, activo } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        message: "Nombre y email son obligatorios",
      });
    }

    const employeeFound = await employeeModel.findById(req.params.id);

    if (!employeeFound) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const updatedData = {
      nombre,
      telefono,
      email,
      cargo,
      activo,
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      if (employeeFound.public_id) {
        await cloudinary.uploader.destroy(employeeFound.public_id);
      }

      updatedData.foto = req.file.path;
      updatedData.public_id = req.file.filename;
    }

    await employeeModel.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    return res.status(200).json({ message: "Employee updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default employeeController;
