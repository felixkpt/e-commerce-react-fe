const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

/**
 * Adds a product review by a user. Ensures the user has purchased the product
 * and hasn't already reviewed it. Updates the product's rating and review count.
 */
const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    // Check if the user has purchased the product with a confirmed or delivered order
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: { $in: ["confirmed", "delivered"] },
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase the product to review it.",
      });
    }

    // Verify if the user has already submitted a review for the product
    const existingReview = await ProductReview.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    // Create a new product review
    const newReview = await ProductReview.create({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    // Update product review counts and average rating
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const updatedReviewCounts = product.reviewCounts + 1;
    const updatedRating =
      (product.rating * product.reviewCounts + reviewValue) / updatedReviewCounts;

    product.reviewCounts = updatedReviewCounts;
    product.rating = updatedRating;

    // Save the updated product
    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully.",
      data: newReview,
    });
  } catch (error) {
    console.error("Error in addProductReview:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the review. Please try again later.",
    });
  }
};

/**
 * Retrieves all reviews for a specific product by its productId.
 */
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Fetch all reviews for the given product ID
    const reviews = await ProductReview.find({ productId });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found for this product.",
      });
    }

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.error("Error in getProductReviews:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving reviews. Please try again later.",
    });
  }
};

module.exports = { addProductReview, getProductReviews };
