const { createProduct } = require("../../helpers/app");
const { downloadUtil } = require("../../helpers/file-upload");
const Product = require("../../models/Product");

const addProductsFromJson = async (req, res) => {
    const strategy = req.strategy; // Read strategy from request
    const { products } = req.body;

    try {

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid request. 'products' must be a non-empty array.",
            });
        }

        const newlyCreatedProducts = [];

        for (const product of products) {

            console.log('Product:', product)

            // Validate required fields
            if (!product.name || !product.images?.[0] || !product.about || product.rating === undefined || product.price === undefined) {
                console.log('Missing required fields in one or more products.')
                continue
            }

            // Check if the product title already exists
            const existingProduct = await Product.findOne({ title: product.name });
            if (existingProduct) {
                console.log(`Product with title "${product.name}" already exists.`)
                continue
            }

            // Save the first image (optional)
            const mainImage = product.images[0]; // Main image
            const imageObj = await downloadUtil(req, mainImage, strategy); // Save image

            // Randomly pick a stockStatus from predefined options
            const stockOptions = [
                { id: "in-stock", label: "In Stock" },
                { id: "out-of-stock", label: "Out of Stock" },
                { id: "pre-order", label: "Pre-order" },
            ];

            const stockStatus = stockOptions[Math.floor(Math.random() * stockOptions.length)].id;

            // Set totalStock to 60 if "in-stock", otherwise randomize between 1 and 1000
            const totalStock = stockStatus === "in-stock" ? 60 : Math.floor(Math.random() * 1000) + 1;

            // Extract data from the JSON input
            const productData = {
                image: imageObj?.url || null,
                title: product.name,
                description: product.about,
                category: product.category,
                subcategory: product.sub_category,
                brand: null,
                basePrice: product.base_price || product.price,
                salePrice: product.price,
                totalStock,
                reviewCounts: product.review_counts,
                rating: product.rating,
                stockStatus,
            };

            const newlyCreatedProduct = await createProduct(productData)

            newlyCreatedProducts.push(newlyCreatedProduct);
        }

        // Respond with created products
        res.status(201).json({
            success: true,
            data: newlyCreatedProducts,
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "An error occurred while adding products.",
        });
    }
};


module.exports = { addProductsFromJson }