const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createPaymentOrder,
    verifyPayment,
    getOrders,
    getOrderById
} = require("../controllers/orderController");

router.post(
    "/create-payment-order",
    authMiddleware,
    createPaymentOrder
);

router.post(
    "/verify-payment",
    authMiddleware,
    verifyPayment
);

router.get(
    "/",
    authMiddleware,
    getOrders
);

router.get(
    "/:id",
    authMiddleware,
    getOrderById
);

module.exports = router;