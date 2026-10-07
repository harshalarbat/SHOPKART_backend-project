const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: String,

    email: String,

    password: String,

    phone: String,

    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],

    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            quantity: {
                type: Number,
                default: 1,
                min: 1
            }
        }
    ]
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;