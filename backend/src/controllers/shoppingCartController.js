import shoppingCartModel from "../models/shoppingCart.js";
import productModel from "../models/products.js";

const shoppingCartController = {};

//SELECT
shoppingCartController.getAllCarts = async (req, res) => {
  try {
    const carts = await shoppingCartModel
      .find()
      .populate("userId", "fullName email")
      .populate("products.productId", "productName price");

    return res.status(200).json(carts);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//SELECT by id
shoppingCartController.getCartById = async (req, res) => {
  try {
    const cart = await shoppingCartModel
      .findById(req.params.id)
      .populate("userId", "fullName email")
      .populate("products.productId", "productName price");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//INSERT
shoppingCartController.insertCart = async (req, res) => {
  try {
    const { userId, products, discount } = req.body;

    if (!userId || !products || products.length === 0) {
      return res
        .status(400)
        .json({ message: "userId and products are required" });
    }

    let total = 0;
    let newProducts = [];

    for (let i = 0; i < products.length; i++) {
      const productFound = await productModel.findById(products[i].productId);

      if (!productFound) {
        return res
          .status(404)
          .json({ message: `Product ${products[i].productId} not found` });
      }

      const subtotal = productFound.price * products[i].amount;
      total += subtotal;

      newProducts.push({
        productId: products[i].productId,
        amount: products[i].amount,
        subtotal,
      });
    }

    const discountValue = discount || 0;
    const totalWithDiscount = total - discountValue;

    const newCart = new shoppingCartModel({
      userId,
      products: newProducts,
      total,
      discount: discountValue,
      totalWithDiscount,
    });

    await newCart.save();

    return res.status(201).json({ message: "Cart saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//UPDATE
shoppingCartController.updateCart = async (req, res) => {
  try {
    const { userId, products, discount } = req.body;

    let total = 0;
    let newProducts = [];

    for (let i = 0; i < products.length; i++) {
      const productFound = await productModel.findById(products[i].productId);

      if (!productFound) {
        return res
          .status(404)
          .json({ message: `Product ${products[i].productId} not found` });
      }

      const subtotal = productFound.price * products[i].amount;
      total += subtotal;

      newProducts.push({
        productId: products[i].productId,
        amount: products[i].amount,
        subtotal,
      });
    }

    const discountValue = discount || 0;
    const totalWithDiscount = total - discountValue;

    const updatedCart = await shoppingCartModel.findByIdAndUpdate(
      req.params.id,
      {
        userId,
        products: newProducts,
        total,
        discount: discountValue,
        totalWithDiscount,
      },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({ message: "Cart updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE
shoppingCartController.deleteCart = async (req, res) => {
  try {
    const deletedCart = await shoppingCartModel.findByIdAndDelete(
      req.params.id
    );

    if (!deletedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({ message: "Cart deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default shoppingCartController;
