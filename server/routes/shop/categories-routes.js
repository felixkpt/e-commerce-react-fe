require("dotenv").config(); // Load environment variables from .env file
const express = require("express");

const {
  getCategoriesWithSubcategories,
} = require("../../controllers/shop/categories-controller");


const router = express.Router();

router.get("/get", getCategoriesWithSubcategories);

module.exports = router;
