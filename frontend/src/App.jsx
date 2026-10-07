import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";

import CartProvider from "./context/CartContext";


import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import OrderSuccess from "./pages/OrderSuccess";

import "./index.css";

function App() {
    return (
        <BrowserRouter>
            <CartProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/products" element={<Products />} />

                    <Route
                        path="/products/:id"
                        element={<ProductDetails />}
                    />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />


                    <Route
    path="/checkout"
    element={<Checkout />}
/>

<Route
    path="/orders"
    element={<Orders />}
/>

<Route
    path="/orders/:id"
    element={<OrderDetails />}
/>

<Route
    path="/order-success/:id"
    element={<OrderSuccess />}
/>

                </Routes>
            </CartProvider>
        </BrowserRouter>
    );
}

export default App;