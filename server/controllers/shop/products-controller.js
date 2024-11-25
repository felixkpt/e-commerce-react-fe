const Product = require("../../models/Product");
const Category = require("../../models/Category");

/**
 * Get filtered products based on category, brand, and sorting criteria.
 * 
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object to send the filtered products.
 */
const getFilteredProducts = async (req, res) => {
  try {
    // Destructure query parameters with default values
    const { category = '', brand = '', sortBy = "price-lowtohigh" } = req.query;

    // Initialize filters
    let filters = {};

    // Add category filter if provided
    if (category) {
      const categoryIds = category.split(",");
      filters.category = { $in: categoryIds }; // Filters products with categories in the list
    }

    // Add brand filter if provided
    if (brand) {
      filters.brand = { $in: brand.split(",") }; // Filters products with brands in the list
    }

    // Configure sorting based on the sortBy parameter
    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1; // Ascending order
        break;
      case "price-hightolow":
        sort.price = -1; // Descending order
        break;
      case "title-atoz":
        sort.title = 1; // Alphabetical (A-Z)
        break;
      case "title-ztoa":
        sort.title = -1; // Reverse alphabetical (Z-A)
        break;
      default:
        sort.price = 1; // Default to price ascending
        break;
    }

    // Fetch products from the database based on filters and sorting
    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(`Error in getFilteredProducts: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products. Please try again later.",
      error: error.message, // Optional: Include the error message for debugging
    });
  }
};

/**
 * Get details of a single product by its ID.
 * 
 * @param {Object} req - The request object containing the product ID in params.
 * @param {Object} res - The response object to send the product details.
 */
const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product ID and fetch product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${id} not found.`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(`Error in getProductDetails: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product details. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
