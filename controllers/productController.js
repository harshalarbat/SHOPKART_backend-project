const Product = require("../models/project");

const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            stock
        } = req.body;

        if (
            !name ||
            !description ||
            price === undefined ||
            !category ||
            !image ||
            stock === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "All product fields are required"
            });
        }

        if (Number(price) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be greater than 0"
            });
        }

        if (Number(stock) < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock cannot be negative"
            });
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            image,
            stock
        });

        const savedProduct = await product.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: savedProduct
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const getProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        const query = {};

        if (search && search.trim() !== "") {
            const safeSearch = search
                .trim()
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            query.name = {
                $regex: safeSearch,
                $options: "i"
            };
        }

        if (category && category.trim() !== "") {
            const safeCategory = category
                .trim()
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            query.category = {
                $regex: `^${safeCategory}$`,
                $options: "i"
            };
        }

        const products = await Product
            .find(query)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.log("Get products error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProductById
};