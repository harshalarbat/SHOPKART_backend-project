const Customer = require("../models/customer");

async function authMiddleware(req, res, next) {

    console.log("Cookies:", req.cookies);

    const email = req.cookies.loggedIn;

    console.log("Email:", email);

    const customer = await Customer.findOne({
        email: email
    });

    console.log("Customer:", customer);

    if (!customer) {
        return res.status(401).send({
            message: "Not logged in"
        });
    }

    req.customer = customer;

    next();
}

module.exports = authMiddleware;