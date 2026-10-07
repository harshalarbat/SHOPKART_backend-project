const crypto = require("crypto");

const Customer = require("../models/customer");
const Product = require("../models/project");
const Order = require("../models/order");
const razorpay = require("../config/razorpay");

const createPaymentOrder = async (req, res) => {
    try {
        const email = req.cookies.loggedIn;

        const customer = await Customer.findOne({
            email: email
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        if (!customer.cart || customer.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        const shippingAddress = req.body.shippingAddress;

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required"
            });
        }

        const requiredFields = [
            "fullName",
            "phone",
            "addressLine1",
            "city",
            "state",
            "pincode"
        ];

        for (const field of requiredFields) {
            if (
                !shippingAddress[field] ||
                shippingAddress[field].trim() === ""
            ) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }

        if (!/^\d{10}$/.test(shippingAddress.phone)) {
            return res.status(400).json({
                success: false,
                message: "Phone must contain 10 digits"
            });
        }

        if (!/^\d{6}$/.test(shippingAddress.pincode)) {
            return res.status(400).json({
                success: false,
                message: "Pincode must contain 6 digits"
            });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const cartItem of customer.cart) {
            const product = await Product.findById(
                cartItem.product
            );

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: "A product in your cart no longer exists"
                });
            }

            if (product.stock < cartItem.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            totalAmount +=
                product.price * cartItem.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                image: product.image
            });
        }

        const order = await Order.create({
            user: customer._id,
            items: orderItems,
            shippingAddress: shippingAddress,
            totalAmount: totalAmount,
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT"
        });

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: order._id.toString()
        });

        order.razorpayOrderId = razorpayOrder.id;

        await order.save();

        res.status(201).json({
            success: true,
            shopKartOrderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("CREATE PAYMENT ORDER ERROR:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message || "Unable to create payment order"
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const email = req.cookies.loggedIn;

        const customer = await Customer.findOne({
            email: email
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        const {
            shopKartOrderId,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const order = await Order.findById(
            shopKartOrderId
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (
            order.user.toString() !==
            customer._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Not allowed"
            });
        }

        if (
            order.razorpayOrderId !==
            razorpay_order_id
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid Razorpay order"
            });
        }

        const body =
            order.razorpayOrderId +
            "|" +
            razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        if (
            expectedSignature !==
            razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId =
            razorpay_payment_id;

        await order.save();

        customer.cart = [];

        await customer.save();

        res.json({
            success: true,
            message: "Payment verified and order placed",
            order: order
        });
    } catch (error) {
        console.error("VERIFY PAYMENT ERROR:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message ||
                "Payment verification failed"
        });
    }
};

const getOrders = async (req, res) => {
    try {
        const email = req.cookies.loggedIn;

        const customer = await Customer.findOne({
            email: email
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        const orders = await Order.find({
            user: customer._id
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch orders"
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        const email = req.cookies.loggedIn;

        const customer = await Customer.findOne({
            email: email
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            user: customer._id
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            order: order
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch order"
        });
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
    getOrders,
    getOrderById
};