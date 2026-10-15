require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const cartRoutes = require("./routes/cartRoutes");

const orderRoutes = require("./routes/orderRoutes");

const app = express();

const port = 3000;


// CORS



app.use(
    cors({
        origin: (origin, callback) => {
            if (
                !origin ||
                origin === "http://localhost:5173" ||
                origin === "http://localhost:5175" ||
                /^https:\/\/shopkart-backend-project(-[a-z0-9]+)?-harshal-14cd\.vercel\.app$/.test(origin)
            ) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);



// Middleware

app.use(express.json());

app.use(cookieParser());


// MongoDB

console.log(
    "Mongo URI exists:",
    !!process.env.MONGO_URI
);

console.log(
    "Mongo username:",
    process.env.MONGO_URI
        ?.split("://")[1]
        ?.split(":")[0]
);


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log("MongoDB connected");

    })
    .catch((error) => {

        console.log(
            "MongoDB connection error:",
            error.message
        );

    });


// Home route

app.get("/", (req, res) => {

    res.send("ShopKart Backend Running");

});


// Customer routes

app.use("/customers", customerRoutes);


// Product routes

app.use("/products", productRoutes);


// Wishlist routes

app.use("/wishlist", wishlistRoutes);


app.use("/cart", cartRoutes);

app.use("/orders", orderRoutes);


// Start server

app.listen(port, () => {

    console.log(
        `Server starts at port ${port}`
    );

});
