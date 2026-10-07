const mongoose = require("mongoose");

const Customer = require("../models/customer");
const Product = require("../models/project");


const addToWishlist = async (req, res) => {

    try {

        const productId = req.params.productId;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const customer = req.customer;

        if (customer.wishlist.includes(productId)) {
            return res.status(409).json({
                message: "Product already in wishlist"
            });
        }

        customer.wishlist.push(productId);

        await customer.save();

        res.status(200).json({
            success: true,
            message: "Product added to wishlist"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


const getWishlist = async (req, res) => {

    try {

        const customer = await Customer
            .findById(req.customer._id)
            .populate({
                path: "wishlist",
                select: "name price category image stock"
            });

        res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


const removeFromWishlist = async (req, res) => {

    try {

        const productId = req.params.productId;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const customer = req.customer;

        const productExists = customer.wishlist.some(
            id => id.toString() === productId
        );

        if (!productExists) {
            return res.status(404).json({
                message: "Product not in wishlist"
            });
        }

        customer.wishlist = customer.wishlist.filter(
            id => id.toString() !== productId
        );

        await customer.save();

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};