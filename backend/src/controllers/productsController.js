import productModel from "../models/products.js";
import { v2 as cloudinary } from "cloudinary";

const productsController = {};

//SELECT
productsController.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().populate("supplierId", "name email");
    return res.status(200).json(products);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//SELECT by id
productsController.getProductById = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.id)
      .populate("supplierId", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//INSERT
productsController.insertProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      productType,
      categories,
      variants,
      price,
      expirationDate,
      supplierId,
    } = req.body;

    if (!productName || !productType || price === undefined || !supplierId) {
      return res.status(400).json({
        message: "productName, productType, price and supplierId are required",
      });
    }

    const images = req.files ? req.files.map((file) => file.path) : [];

    const newProduct = new productModel({
      productName,
      description,
      productType,
      categories,
      variants,
      price,
      expirationDate,
      supplierId,
      images,
    });

    await newProduct.save();

    return res.status(201).json({ message: "Product saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//UPDATE
productsController.updateProduct = async (req, res) => {
  try {
    const {
      productName,
      description,
      productType,
      categories,
      variants,
      price,
      expirationDate,
      supplierId,
    } = req.body;

    const productFound = await productModel.findById(req.params.id);

    if (!productFound) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedData = {
      productName,
      description,
      productType,
      categories,
      variants,
      price,
      expirationDate,
      supplierId,
    };

    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map((file) => file.path);
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

//DELETE
productsController.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productModel.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default productsController;
