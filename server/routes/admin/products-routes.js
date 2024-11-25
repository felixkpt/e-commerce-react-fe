require("dotenv").config(); // Load environment variables from .env file
const express = require("express");

const {
  handleImageUpload,
  addProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct,
} = require("../../controllers/admin/products-controller");

const { uploadMiddleware } = require("../../helpers/file-upload");
const { addProductsFromJson } = require("../../controllers/admin/add-products-from-json-controller");

const router = express.Router();

// Middleware to determine storage strategy and field name
const determineStorageStrategy = (req, res, next) => {
  req.strategy = process.env.STORAGE_DRIVER || "cloud"; // Default to 'cloud'
  req.fieldName = req.query.fieldName || "my_file"; // Default field name
  next();
};

// Routes
router.post(
  "/upload-image",
  determineStorageStrategy,
  (req, res, next) => {
    const upload = uploadMiddleware(req.strategy); // Use dynamic strategy
    upload.single(req.fieldName)(req, res, next); // Dynamic field name
  },
  handleImageUpload
);

router.post("/add", addProduct);
router.post("/add-from-json", determineStorageStrategy, addProductsFromJson);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

module.exports = router;
