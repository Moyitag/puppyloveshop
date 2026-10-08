import productReviewModel from "../models/productReview.js";

const productReviewController = {};

// Solo el autor de la reseña o un administrador pueden editarla o eliminarla
const canManageReview = (user, review) =>
  user.userType === "admin" || review.userId.toString() === user.id;

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
      certifiedPurchase,
      productId,
    } = req.body;

    // El autor siempre es el cliente de la sesión, no el que venga en el body
    const userId = req.user.id;

    if (!rating || !title || !experienceType || !details || !productId) {
      return res.status(400).json({
        message:
          "rating, title, experienceType, details and productId are required",
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

    const review = await productReviewModel.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (!canManageReview(req.user, review)) {
      return res.status(403).json({ message: "You can only edit your own reviews" });
    }

    await productReviewModel.findByIdAndUpdate(
      req.params.id,
      { rating, title, experienceType, details, active },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ message: "Review updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//DELETE
productReviewController.deleteReview = async (req, res) => {
  try {
    const review = await productReviewModel.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (!canManageReview(req.user, review)) {
      return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    await productReviewModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default productReviewController;
