import mongoose from "mongoose";
import shoppingCartModel from "../models/shoppingCart.js";
import productModel from "../models/products.js";

const shoppingCartController = {};

const populateCart = (query) =>
  query
    .populate("userId", "fullName email")
    .populate("products.productId", "productName price images variants");

const canAccessCart = (cart, user) =>
  user.userType === "admin" || cart.userId.toString() === user.id.toString();

const activeCartFilter = (userId) => ({
  userId,
  $or: [{ status: "active" }, { status: { $exists: false } }],
});

const normalizeProducts = async (products) => {
  if (!Array.isArray(products)) {
    const error = new Error("products must be an array");
    error.status = 400;
    throw error;
  }

  let total = 0;
  const normalized = [];
  const seen = new Set();

  for (const item of products) {
    const amount = Number(item.amount);
    if (!Number.isInteger(amount) || amount < 1) {
      const error = new Error("Each quantity must be a positive integer");
      error.status = 400;
      throw error;
    }
    if (!mongoose.isValidObjectId(item.productId)) {
      const error = new Error("Invalid product");
      error.status = 400;
      throw error;
    }

    const product = await productModel.findById(item.productId);
    if (!product) {
      const error = new Error(`Product ${item.productId} not found`);
      error.status = 404;
      throw error;
    }

    let variant = null;
    if (product.variants.length > 0) {
      variant = product.variants.id(item.variantId);
      if (!variant) {
        const error = new Error(`Select a valid variant for ${product.productName}`);
        error.status = 400;
        throw error;
      }
      if (amount > variant.stock) {
        const error = new Error(
          `Only ${variant.stock} units of ${product.productName} are available`
        );
        error.status = 409;
        throw error;
      }
    }

    const key = `${product._id}:${variant?._id || "default"}`;
    if (seen.has(key)) {
      const error = new Error("The same product variant is repeated");
      error.status = 400;
      throw error;
    }
    seen.add(key);

    const subtotal = product.price * amount;
    total += subtotal;
    normalized.push({
      productId: product._id,
      variantId: variant?._id,
      size: variant?.size || "",
      color: variant?.color || "",
      amount,
      subtotal,
    });
  }

  return { products: normalized, total };
};

shoppingCartController.getAllCarts = async (req, res) => {
  try {
    return res.status(200).json(await populateCart(shoppingCartModel.find()));
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

shoppingCartController.getMyCart = async (req, res) => {
  try {
    const cart = await populateCart(
      shoppingCartModel.findOne(activeCartFilter(req.user.id))
    );
    return res.status(200).json(cart);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

shoppingCartController.getCartById = async (req, res) => {
  try {
    const cart = await shoppingCartModel.findById(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    if (!canAccessCart(cart, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }
    return res.status(200).json(await populateCart(shoppingCartModel.findById(cart._id)));
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

shoppingCartController.insertCart = async (req, res) => {
  try {
    const existing = await shoppingCartModel.findOne(activeCartFilter(req.user.id));
    if (existing) {
      return res.status(409).json({ message: "You already have an active cart" });
    }
    if (!Array.isArray(req.body.products) || req.body.products.length === 0) {
      return res.status(400).json({ message: "At least one product is required" });
    }

    const calculated = await normalizeProducts(req.body.products);
    const cart = await shoppingCartModel.create({
      userId: req.user.id,
      products: calculated.products,
      total: calculated.total,
      discount: 0,
      totalWithDiscount: calculated.total,
      status: "active",
    });
    return res.status(201).json({ message: "Cart saved", cart });
  } catch (error) {
    console.log("error" + error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "You already have an active cart" });
    }
    return res.status(error.status || 500).json({ message: error.status ? error.message : "Internal server error" });
  }
};

shoppingCartController.updateCart = async (req, res) => {
  try {
    const cart = await shoppingCartModel.findById(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    if (!canAccessCart(cart, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (cart.status !== "active") {
      return res.status(409).json({ message: "This cart has already been ordered" });
    }

    const calculated = await normalizeProducts(req.body.products);
    cart.products = calculated.products;
    cart.total = calculated.total;
    cart.totalWithDiscount = Math.max(0, calculated.total - cart.discount);
    await cart.save();
    return res.status(200).json({
      message: "Cart updated",
      cart: await populateCart(shoppingCartModel.findById(cart._id)),
    });
  } catch (error) {
    console.log("error" + error);
    return res.status(error.status || 500).json({ message: error.status ? error.message : "Internal server error" });
  }
};

shoppingCartController.deleteCart = async (req, res) => {
  try {
    const cart = await shoppingCartModel.findById(req.params.id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    if (!canAccessCart(cart, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (cart.status !== "active") {
      return res.status(409).json({ message: "Ordered carts cannot be deleted" });
    }
    await cart.deleteOne();
    return res.status(200).json({ message: "Cart deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default shoppingCartController;
