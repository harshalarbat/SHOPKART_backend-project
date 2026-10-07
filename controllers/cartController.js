const mongoose = require("mongoose");

const Customer = require("../models/customer");
const Product = require("../models/project");

const addToCart = async (req, res) => {
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

        if (product.stock <= 0) {
            return res.status(400).json({
                message: "Product is out of stock"
            });
        }

        const customer = req.customer;

        if (!customer.cart) {
            customer.cart = [];
        }

        const existingItem = customer.cart.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            if (existingItem.quantity + 1 > product.stock) {
                return res.status(400).json({
                    message: "Quantity exceeds available stock"
                });
            }

            existingItem.quantity += 1;
        } else {
            customer.cart.push({
                product: productId,
                quantity: 1
            });
        }

        await customer.save();

        const updatedCustomer = await Customer
            .findById(customer._id)
            .populate({
                path: "cart.product",
                select: "name price category image stock"
            });

        res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: updatedCustomer.cart
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getCart = async (req, res) => {
    try {
        const customer = await Customer
            .findById(req.customer._id)
            .populate({
                path: "cart.product",
                select: "name price category image stock"
            });

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        if (!customer.cart) {
            customer.cart = [];
        }

        res.status(200).json({
            success: true,
            cart: customer.cart
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const updateCartQuantity = async (req, res) => {
    try {
        const productId = req.params.productId;
        const quantity = req.body.quantity;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        if (typeof quantity !== "number" || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Quantity exceeds available stock"
            });
        }

        const customer = req.customer;

        if (!customer.cart) {
            customer.cart = [];
        }

        const cartItem = customer.cart.find(
            item => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                message: "Product not in cart"
            });
        }

        cartItem.quantity = quantity;

        await customer.save();

        const updatedCustomer = await Customer
            .findById(customer._id)
            .populate({
                path: "cart.product",
                select: "name price category image stock"
            });

        res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: updatedCustomer.cart
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const productId = req.params.productId;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID"
            });
        }

        const customer = req.customer;

        if (!customer.cart) {
            customer.cart = [];
        }

        const productExists = customer.cart.some(
            item => item.product.toString() === productId
        );

        if (!productExists) {
            return res.status(404).json({
                message: "Product not in cart"
            });
        }

        customer.cart = customer.cart.filter(
            item => item.product.toString() !== productId
        );

        await customer.save();

        const updatedCustomer = await Customer
            .findById(customer._id)
            .populate({
                path: "cart.product",
                select: "name price category image stock"
            });

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: updatedCustomer.cart
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart
};