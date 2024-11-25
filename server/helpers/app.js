const Category = require("../models/Category");
const Product = require("../models/Product");
const SubCategory = require("../models/SubCategory");

function slugify(str) {
    return str
        .toString() // Ensure it's a string
        .toLowerCase() // Convert to lowercase
        .trim() // Remove extra whitespace
        .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
        .replace(/[^\w-]+/g, "") // Remove all non-word characters except hyphens
        .replace(/--+/g, "-") // Replace multiple hyphens with a single one
        .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

const generateSKU = (name, categoryId) => {
    if (!name || !categoryId) {
        throw new Error("Name and categoryId are required to generate SKU");
    }
    const slug = slugify(name).slice(0, 10); // Limit slug to 10 characters
    const categoryPart = categoryId.toString().slice(0, 5); // First 5 characters of categoryId
    return `${slug}-${categoryPart}`.toUpperCase(); // Combine and make uppercase
};

async function getCatAndSubcat(categoryIdOrName, subcategoryIdOrName) {
    let category = null;
    let subcategory = null;

    if (categoryIdOrName) {
        // Try finding category by ID first, then by name
        category = await Category.findById(categoryIdOrName).catch(() =>
            Category.findOne({ name: categoryIdOrName })
        );

        if (!category) {
            // Create new category if it doesn't exist
            category = new Category({
                name: categoryIdOrName,
                slug: slugify(categoryIdOrName),
            });
            await category.save();
        }
    }

    if (subcategoryIdOrName) {
        // Try finding subcategory by ID first, then by name
        subcategory = await SubCategory.findById(subcategoryIdOrName).catch(() =>
            SubCategory.findOne({ name: subcategoryIdOrName, category: category?._id })
        );

        if (!subcategory) {
            // Create new subcategory if it doesn't exist
            subcategory = new SubCategory({
                name: subcategoryIdOrName,
                slug: slugify(subcategoryIdOrName),
                category: category?._id, // Ensure subcategory belongs to this category
            });
            await subcategory.save();
        }
    }

    return [category, subcategory];
}

// Reusable function to create a product
async function createProduct(productData) {
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
        rating,
        stockStatus,
    } = productData;

    // Fetch category and subcategory objects
    const [categoryObj, subcategoryObj] = await getCatAndSubcat(category, subcategory);

    if (!categoryObj) {
        throw new Error("Invalid category provided.");
    }

    // Create new product
    const newProduct = new Product({
        image,
        title,
        description,
        category: categoryObj._id,
        subcategory: subcategoryObj ? subcategoryObj._id : null,
        brand,
        basePrice,
        salePrice,
        totalStock,
        reviewCounts,
        rating,
        sku: generateSKU(title, categoryObj._id),
        stockStatus,
    });

    await newProduct.save();

    // Return the saved product with populated fields
    return await Product.findById(newProduct._id)
        .populate("category", "name")
        .populate("subcategory", "name");
}

module.exports = {
    slugify,
    generateSKU,
    getCatAndSubcat,
    createProduct,
}