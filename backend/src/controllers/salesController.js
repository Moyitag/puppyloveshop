import salesModel from "../models/sales.js";

const salesController = {};

//SELECT
salesController.getAllSales = async (req, res) => {
  try {
    const sales = await salesModel.find().populate("shoppingCartId");
    return res.status(200).json(sales);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//SELECT by id
salesController.getSaleById = async (req, res) => {
  try {
    const sale = await salesModel
      .findById(req.params.id)
      .populate("shoppingCartId");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    return res.status(200).json(sale);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//INSERT
salesController.insertSale = async (req, res) => {
  try {
    const { shoppingCartId, deliveryAddress, paymentMethod, paymentStatus } =
      req.body;

    if (!shoppingCartId || !deliveryAddress || !paymentMethod) {
      return res.status(400).json({
        message:
          "shoppingCartId, deliveryAddress and paymentMethod are required",
      });
    }

    const newSale = new salesModel({
      shoppingCartId,
      deliveryAddress,
      paymentMethod,
      paymentStatus,
    });

    await newSale.save();

    return res.status(201).json({ message: "Sale saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//UPDATE
salesController.updateSale = async (req, res) => {
  try {
    const { shoppingCartId, deliveryAddress, paymentMethod, paymentStatus } =
      req.body;

    const updatedSale = await salesModel.findByIdAndUpdate(
      req.params.id,
      { shoppingCartId, deliveryAddress, paymentMethod, paymentStatus },
      { new: true }
    );

    if (!updatedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    return res.status(200).json({ message: "Sale updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE
salesController.deleteSale = async (req, res) => {
  try {
    const deletedSale = await salesModel.findByIdAndDelete(req.params.id);

    if (!deletedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    return res.status(200).json({ message: "Sale deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default salesController;
