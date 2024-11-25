// Import necessary helpers and models
const { generateSKU, getCatAndSubcat, createProduct } = require("../../helpers/app");
const { imageUploadUtil } = require("../../helpers/file-upload");
const Product = require("../../models/Product");

// Handles image upload to different storage strategies (cloud/local)
const handleImageUpload = async (req, res) => {
  try {
    const strategy = req.strategy; // Define storage strategy (cloud/local)
    const fileBuffer = req.file.buffer; // Buffer for cloud storage
    const filePath = req.file.path; // Path for local storage

    let result;
    if (strategy === "cloud") {
      const b64 = Buffer.from(fileBuffer).toString("base64");
      const url = `data:${req.file.mimetype};base64,${b64}`;
      result = await imageUploadUtil(req, url, "cloud");
    } else if (strategy === "local") {
      result = await imageUploadUtil(req, filePath, "local");
    } else {
      throw new Error("Invalid strategy");
    }

    res.json({
      success: true,
      strategy,
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occurred during image upload.",
    });
  }
};

// Fetches all products with populated category and subcategory details
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({})
      .populate("category", "name")
      .populate("subcategory", "name");

    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching products.",
    });
  }
};

// Adds a new product to the database with validation and SKU generation
const addProduct = async (req, res) => {
  try {

    // Check if the product title already exists
    const existingProduct = await Product.findOne({ title: req.title });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: `Product with title "${req.title}" already exists.`,
      });
    }

    prod = await createProduct(req)

    res.status(201).json({
      success: true,
      data: prod,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while adding the product.",
    });
  }
};

// Edits an existing product with proper validation and updates
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      subcategory,
      brand,
      basePrice,
      salePrice,
      totalStock,
      reviewCounts,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const [categoryObj, subcategoryObj] = await getCatAndSubcat(category, subcategory);
    if (categoryObj) findProduct.category = categoryObj._id;
    if (subcategoryObj) findProduct.subcategory = subcategoryObj._id;

    if (image) findProduct.image = image;
    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.brand = brand || findProduct.brand;
    findProduct.basePrice = basePrice === "" ? 0 : basePrice || findProduct.basePrice;
    findProduct.salePrice = salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.reviewCounts = reviewCounts || findProduct.reviewCounts;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    if (title || categoryObj) {
      findProduct.sku = generateSKU(findProduct.title, categoryObj._id);
    }

    await findProduct.save();

    const updatedProduct = await Product.findById(id)
      .populate("category", "name")
      .populate("subcategory", "name");

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "An error occurred while editing the product.",
    });
  }
};

// Deletes a product by ID with error handling for invalid entries
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while deleting the product.",
    });
  }
};

// Exporting all product-related controllers
module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
