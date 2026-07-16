import productReviewModel from "../models/productReview.js";

const productReviewController = {};

//SELECT
productReviewController.getAllReviews = async (req, res) => {
  try {
    const reviews = await productReviewModel
      .find()
      .populate("userId", "fullName")
      .populate("productId", "productName");

    return res.status(200).json(reviews);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//SELECT by id
productReviewController.getReviewById = async (req, res) => {
  try {
    const review = await productReviewModel
      .findById(req.params.id)
      .populate("userId", "fullName")
      .populate("productId", "productName");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json(review);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//SELECT by product
productReviewController.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await productReviewModel
      .find({ productId: req.params.productId, active: true })
      .populate("userId", "fullName");

    return res.status(200).json(reviews);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//INSERT
productReviewController.insertReview = async (req, res) => {
  try {
    const {
      rating,
      title,
      experienceType,
      details,
      userId,
      certifiedPurchase,
      productId,
    } = req.body;

    if (!rating || !title || !experienceType || !details || !userId || !productId) {
      return res.status(400).json({
        message:
          "rating, title, experienceType, details, userId and productId are required",
      });
    }

    const newReview = new productReviewModel({
      rating,
      title,
      experienceType,
      details,
      userId,
      certifiedPurchase,
      productId,
      active: true,
    });

    await newReview.save();

    return res.status(201).json({ message: "Review saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//UPDATE
productReviewController.updateReview = async (req, res) => {
  try {
    const { rating, title, experienceType, details, active } = req.body;

    const updatedReview = await productReviewModel.findByIdAndUpdate(
      req.params.id,
      { rating, title, experienceType, details, active },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json({ message: "Review updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE
productReviewController.deleteReview = async (req, res) => {
  try {
    const deletedReview = await productReviewModel.findByIdAndDelete(
      req.params.id
    );

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default productReviewController;
