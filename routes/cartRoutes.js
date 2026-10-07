const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart
} = require("../controllers/cartController");


router.post("/:productId", authMiddleware, addToCart);

router.get("/", authMiddleware, getCart);

router.patch("/:productId", authMiddleware, updateCartQuantity);

router.delete("/:productId", authMiddleware, removeFromCart);


module.exports = router;