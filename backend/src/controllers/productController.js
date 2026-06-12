import productModel from "../models/product.js";
import { v2 as cloudinary } from "cloudinary";

const productController = {};

productController.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    return res.status(200).json(products);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

productController.insertProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion, stock, activo } = req.body;

    if (!nombre || precio === undefined || precio === "") {
      return res.status(400).json({
        message: "Nombre y precio son obligatorios",
      });
    }

    const newProduct = new productModel({
      nombre,
      precio,
      descripcion,
      stock,
      activo,
      imagen: req.file?.path,
      public_id: req.file?.filename,
    });

    await newProduct.save();

    return res.status(200).json({ message: "Product saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

productController.deleteProduct = async (req, res) => {
  try {
    const productFound = await productModel.findById(req.params.id);

    if (!productFound) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (productFound.public_id) {
      await cloudinary.uploader.destroy(productFound.public_id);
    }

    await productModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

productController.updateProduct = async (req, res) => {
  try {
    const { nombre, precio, descripcion, stock, activo } = req.body;

    if (!nombre || precio === undefined || precio === "") {
      return res.status(400).json({
        message: "Nombre y precio son obligatorios",
      });
    }

    const productFound = await productModel.findById(req.params.id);

    if (!productFound) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedData = {
      nombre,
      precio,
      descripcion,
      stock,
      activo,
    };

    if (req.file) {
      if (productFound.public_id) {
        await cloudinary.uploader.destroy(productFound.public_id);
      }

      updatedData.imagen = req.file.path;
      updatedData.public_id = req.file.filename;
    }

    await productModel.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    return res.status(200).json({ message: "Product updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default productController;
