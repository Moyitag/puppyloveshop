import supplierModel from "../models/suppliers.js";

const suppliersController = {};

//SELECT
suppliersController.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierModel.find();
    return res.status(200).json(suppliers);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//SELECT by id
suppliersController.getSupplierById = async (req, res) => {
  try {
    const supplier = await supplierModel.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    return res.status(200).json(supplier);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//INSERT
suppliersController.insertSupplier = async (req, res) => {
  try {
    const { name, email, telephone, address, active } = req.body;

    if (!name || !email || !telephone || !address) {
      return res.status(400).json({
        message: "name, email, telephone and address are required",
      });
    }

    const newSupplier = new supplierModel({
      name,
      email,
      telephone,
      address,
      active,
    });

    await newSupplier.save();

    return res.status(201).json({ message: "Supplier saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//UPDATE
suppliersController.updateSupplier = async (req, res) => {
  try {
    const { name, email, telephone, address, active } = req.body;

    const updatedSupplier = await supplierModel.findByIdAndUpdate(
      req.params.id,
      { name, email, telephone, address, active },
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    return res.status(200).json({ message: "Supplier updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE
suppliersController.deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await supplierModel.findByIdAndDelete(
      req.params.id
    );

    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    return res.status(200).json({ message: "Supplier deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default suppliersController;
