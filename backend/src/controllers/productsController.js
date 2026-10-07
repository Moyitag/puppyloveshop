import productModel from "../models/products.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const productsController = {};
const uploadsDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../uploads"
);

const removeLocalImages = async (images = []) => {
  for (const image of images) {
    if (!image.startsWith("/uploads/")) continue;
    const filePath = path.resolve(uploadsDirectory, path.basename(image));
    if (!filePath.startsWith(`${uploadsDirectory}${path.sep}`)) continue;
    await fs.unlink(filePath).catch((error) => {
      if (error.code !== "ENOENT") console.error("Could not delete image:", error.message);
    });
  }
};

const uploadedImages = (files = []) =>
  files.map((file) =>
    file.path?.startsWith("http") ? file.path : `/uploads/${file.filename}`
  );

const productForResponse = (req, product) => {
  const data = product.toObject ? product.toObject() : product;
  return {
    ...data,
    images: (data.images || []).map((image) =>
      image.startsWith("/uploads/")
        ? `${req.protocol}://${req.get("host")}${image}`
        : image
    ),
  };
};

const parseIfJson = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

//SELECT
productsController.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find().populate("supplierId", "name email");
    return res.status(200).json(products.map((product) => productForResponse(req, product)));
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

    return res.status(200).json(productForResponse(req, product));
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

    const images = uploadedImages(req.files);

    const newProduct = new productModel({
      productName,
      description,
      productType,
      categories: parseIfJson(categories),
      variants: parseIfJson(variants),
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
      categories: parseIfJson(categories),
      variants: parseIfJson(variants),
      price,
      expirationDate,
      supplierId,
    };

    if (req.files && req.files.length > 0) {
      updatedData.images = uploadedImages(req.files);
    }

    await productModel.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (req.files && req.files.length > 0) {
      await removeLocalImages(productFound.images);
    }

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

    await removeLocalImages(deletedProduct.images);

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default productsController;
