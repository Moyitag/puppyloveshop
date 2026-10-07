import salesModel from "../models/sales.js";
import shoppingCartModel from "../models/shoppingCart.js";
import productModel from "../models/products.js";

const salesController = {};

const ownsSale = (sale, user) =>
  user.userType === "admin" ||
  sale.shoppingCartId?.userId?.toString() === user.id.toString();

salesController.getAllSales = async (req, res) => {
  try {
    const filter = {};
    if (req.user.userType === "client") {
      const cartIds = await shoppingCartModel.find({ userId: req.user.id }).distinct("_id");
      filter.shoppingCartId = { $in: cartIds };
    }
    const sales = await salesModel
      .find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "shoppingCartId",
        populate: { path: "products.productId", select: "productName price images" },
      });
    return res.status(200).json(sales);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

salesController.getSaleById = async (req, res) => {
  try {
    const sale = await salesModel.findById(req.params.id).populate("shoppingCartId");
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    if (!ownsSale(sale, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }
    return res.status(200).json(sale);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

salesController.insertSale = async (req, res) => {
  const reserved = [];
  let createdSale = null;
  try {
    const { shoppingCartId, deliveryAddress, paymentMethod, wompiTransactionId, wompiIsReal } = req.body;
    if (!shoppingCartId || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({ message: "Cart, delivery address and payment method are required" });
    }
    const { address, city, department } = deliveryAddress;
    if (![address, city, department].every((value) => typeof value === "string" && value.trim())) {
      return res.status(400).json({ message: "Complete the delivery address" });
    }
    if (!["Efectivo", "Transferencia", "Tarjeta"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }
    if (paymentMethod === "Tarjeta" && !wompiTransactionId) {
      return res.status(400).json({ message: "Wompi transaction is required" });
    }

    const cart = await shoppingCartModel.findById(shoppingCartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    if (cart.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (cart.status !== "active") {
      return res.status(409).json({ message: "This order was already submitted" });
    }
    if (cart.products.length === 0) {
      return res.status(400).json({ message: "The cart is empty" });
    }

    for (const item of cart.products) {
      const product = await productModel.findById(item.productId);
      if (!product) throw Object.assign(new Error("A product no longer exists"), { status: 409 });
      if (product.variants.length === 0) continue;

      const updated = await productModel.findOneAndUpdate(
        {
          _id: product._id,
          variants: {
            $elemMatch: { _id: item.variantId, stock: { $gte: item.amount } },
          },
        },
        { $inc: { "variants.$.stock": -item.amount } },
        { new: true }
      );
      if (!updated) {
        throw Object.assign(
          new Error(`Insufficient stock for ${product.productName}`),
          { status: 409 }
        );
      }
      reserved.push({ productId: product._id, variantId: item.variantId, amount: item.amount });
    }

    createdSale = await salesModel.create({
      shoppingCartId: cart._id,
      deliveryAddress: {
        address: address.trim(),
        city: city.trim(),
        department: department.trim(),
        reference: deliveryAddress.reference?.trim() || "",
      },
      paymentMethod,
      paymentStatus: "pendiente",
      wompiTransactionId,
      wompiIsReal,
    });
    cart.status = "ordered";
    await cart.save();

    return res.status(201).json({ message: "Order saved", sale: createdSale });
  } catch (error) {
    console.log("error" + error);
    if (createdSale) await createdSale.deleteOne().catch(() => {});
    for (const item of reserved.reverse()) {
      await productModel.updateOne(
        { _id: item.productId, "variants._id": item.variantId },
        { $inc: { "variants.$.stock": item.amount } }
      ).catch(() => {});
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: "This order was already submitted" });
    }
    return res.status(error.status || 500).json({ message: error.status ? error.message : "Internal server error" });
  }
};

salesController.updateSale = async (req, res) => {
  try {
    const allowed = ["pendiente", "pagado", "rechazado"];
    if (!allowed.includes(req.body.paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }
    const sale = await salesModel.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: req.body.paymentStatus },
      { new: true, runValidators: true }
    );
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    return res.status(200).json({ message: "Sale updated", sale });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

salesController.deleteSale = async (req, res) => {
  return res.status(405).json({ message: "Orders cannot be deleted" });
};

export default salesController;
