const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: null }, // Nullable
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // References Category
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", default: null }, // Nullable
    brand: { type: String, default: null }, // Nullable
    basePrice: { type: Number, required: true },
    salePrice: { type: Number, default: null },
    totalStock: { type: Number, required: true },
    reviewCounts: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    sku: String,
    stockStatus: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
