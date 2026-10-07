# 🛒 ShopKart — Full-Stack E-Commerce Application

ShopKart is a full-stack e-commerce web application built as a learning project to understand how a modern shopping application works from **frontend to backend to database and payment processing**.

The project includes user authentication, product browsing, wishlist management, shopping cart, checkout, Razorpay test payments, and order management.

---

## 🚀 What is ShopKart?

ShopKart allows a user to:

* Register and log in
* Browse products
* View product details
* Add products to wishlist
* Remove products from wishlist
* Add products to cart
* Increase or decrease product quantity
* Remove products from cart
* See cart totals dynamically
* Enter shipping information
* Create a payment order
* Make a test payment using Razorpay
* Verify payment securely on the backend
* View previous orders
* View detailed order information

The project was built step-by-step so that each feature builds on top of the previous one.

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router
* Context API
* JavaScript
* HTML
* CSS
* Vite

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* REST APIs
* Cookie-based authentication
* bcryptjs
* CORS

## Payment

* Razorpay Test Mode

## Development Tools

* VS Code
* IntelliJ IDEA
* Git
* GitHub
* Postman
* MongoDB Atlas

---

# 🏗️ Project Architecture

The project follows a simple full-stack architecture:

```text
                ┌─────────────────────┐
                │      React UI       │
                │      Frontend       │
                └──────────┬──────────┘
                           │
                           │ HTTP Requests
                           ▼
                ┌─────────────────────┐
                │     Express API     │
                │      Backend        │
                └──────────┬──────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
      ┌───────────────┐         ┌───────────────┐
      │ MongoDB Atlas │         │    Razorpay   │
      │   Database    │         │   Test Mode   │
      └───────────────┘         └───────────────┘
```

---

# 📁 Project Structure

```text
ShopKart/
│
├── controllers/
│   ├── cartController.js
│   ├── customerController.js
│   ├── orderController.js
│   ├── productController.js
│   └── wishlistController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── customer.js
│   ├── order.js
│   └── project.js
│
├── routes/
│   ├── cartRoutes.js
│   ├── customerRoutes.js
│   ├── orderRoutes.js
│   ├── productRoutes.js
│   └── wishlistRoutes.js
│
├── config/
│   └── razorpay.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── SearchBar.jsx
│   │   │
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderDetails.jsx
│   │   │   └── OrderSuccess.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── .env
├── .gitignore
├── index.js
├── package.json
└── README.md
```

> The exact folder names may differ slightly depending on the development stage, but the application follows this general structure.

---

# 🔐 1. User Authentication

The first major feature implemented was user authentication.

Users can:

```text
Register
   ↓
Login
   ↓
Authentication Cookie
   ↓
Access Protected Features
```

The backend validates the user and uses the logged-in user's information when accessing protected resources.

### What I learned

* Express routes
* Request and response objects
* Middleware
* Authentication
* Cookies
* Password handling
* Protected routes
* Frontend/backend communication

---

# 📦 2. Product Catalog

The product catalog allows users to browse available products.

Each product contains information such as:

* Product name
* Price
* Category
* Image
* Stock
* Other product information

The frontend gets product information from the backend API instead of hardcoding everything into React.

### What I learned

* REST APIs
* GET requests
* Express controllers
* MongoDB documents
* Mongoose models
* Fetching API data in React
* Rendering
