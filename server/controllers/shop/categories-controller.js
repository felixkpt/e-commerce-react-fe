// server/controllers/shop/categories-controller.js
const Category = require("../../models/Category");
const SubCategory = require("../../models/SubCategory");

const getCategoriesWithSubcategories = async (req, res) => {
  try {
    // Fetch categories and subcategories
    const categories = await Category.find().lean().exec();
    const subcategories = await SubCategory.find().lean().exec();

    // Map subcategories under their respective categories
    const categoriesWithSubcategories = categories.map((category) => {
      return {
        ...category,
        subcategories: subcategories.filter(
          (subcategory) =>
            subcategory.category &&
            subcategory.category.toString() === category._id.toString()
        ),
      };
    });

    res.status(200).json({
      success: true,
      data: categoriesWithSubcategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories and subcategories",
      error: error.message,
    });
  }
};

module.exports = { getCategoriesWithSubcategories };
