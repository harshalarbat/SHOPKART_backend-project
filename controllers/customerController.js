
const Customer = require("../models/customer");

async function register(req, res) {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).send({
                message: "All fields are required"
            });
        }

        const existingCustomer = await Customer.findOne({
            email: email
        });

        if (existingCustomer) {
            return res.status(400).send({
                message: "Email already registered"
            });
        }

        const customer = new Customer({
            name: name,
            email: email,
            password: password,
            phone: phone
        });

        await customer.save();

        res.status(201).send({
            message: "Registration successful"
        });

    } catch (error) {
        console.log("Registration error:", error);

        res.status(500).send({
            message: error.message
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const customer = await Customer.findOne({
            email: email,
            password: password
        });

        if (!customer) {
            return res.status(401).send({
                message: "Invalid Credentials"
            });
        }

        res.cookie("loggedIn", email, {
            httpOnly: true
        });

        res.send({
            message: "Login successful"
        });

    } catch (error) {
        console.log("Login error:", error);

        res.status(500).send({
            message: error.message
        });
    }
}

async function getMe(req, res) {
    try {
        const email = req.cookies.loggedIn;

        const customer = await Customer.findOne({
            email: email
        });

        if (!customer) {
            return res.status(401).send({
                message: "Not logged in"
            });
        }

        res.send({
            name: customer.name,
            email: customer.email,
            phone: customer.phone
        });

    } catch (error) {
        console.log("Get profile error:", error);

        res.status(500).send({
            message: error.message
        });
    }
}

async function logout(req, res) {
    res.clearCookie("loggedIn");

    res.send({
        message: "Logout successful"
    });
}

module.exports = {
    register,
    login,
    getMe,
    logout
};