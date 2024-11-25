const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, default: null },
    description: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
