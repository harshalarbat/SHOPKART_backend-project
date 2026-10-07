import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function Cart() {
    const {
        cartItems,
        loading,
        error,
        totalItems,
        subtotal,
        updateQuantity,
        removeFromCart,
        fetchCart
    } = useCart();

    async function handleIncrease(item) {
        try {
            await updateQuantity(
                item.product._id,
                item.quantity + 1
            );
        } catch (error) {
            alert(error.message);
        }
    }

    async function handleDecrease(item) {
        if (item.quantity === 1) {
            return;
        }

        try {
            await updateQuantity(
                item.product._id,
                item.quantity - 1
            );
        } catch (error) {
            alert(error.message);
        }
    }

    async function handleRemove(productId) {
        try {
            await removeFromCart(productId);
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <>
            <Navbar />

            <main className="cart-page">
                <h1>My Cart 🛒</h1>

                {loading && (
                    <p className="status-message">
                        Loading your cart...
                    </p>
                )}

                {error && !loading && (
                    <div className="cart-error">
                        <p>
                            Unable to load your cart.
                        </p>

                        <button onClick={fetchCart}>
                            Try Again
                        </button>
                    </div>
                )}

                {!loading &&
                    !error &&
                    cartItems.length === 0 && (
                        <div className="empty-cart">
                            <h2>
                                Your cart is empty 🛒
                            </h2>

                            <p>
                                Looks like you haven't added anything yet.
                            </p>

                            <Link
                                to="/products"
                                className="browse-button"
                            >
                                Browse Products
                            </Link>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    cartItems.length > 0 && (
                        <div className="cart-layout">
                            <div className="cart-items">
                                {cartItems.map((item) => (
                                    <div
                                        className="cart-item"
                                        key={item.product._id}
                                    >
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                        />

                                        <div className="cart-item-info">
                                            <h2>
                                                {item.product.name}
                                            </h2>

                                            <p className="product-category">
                                                {item.product.category}
                                            </p>

                                            <p className="cart-price">
                                                ₹{item.product.price}
                                            </p>

                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() =>
                                                        handleDecrease(item)
                                                    }
                                                    disabled={
                                                        item.quantity === 1
                                                    }
                                                >
                                                    -
                                                </button>

                                                <span>
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        handleIncrease(item)
                                                    }
                                                    disabled={
                                                        item.quantity >=
                                                        item.product.stock
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    handleRemove(
                                                        item.product._id
                                                    )
                                                }
                                                className="remove-button"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="cart-item-total">
                                            ₹
                                            {item.product.price *
                                                item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-summary">
                                <h2>Order Summary</h2>

                                <div className="summary-row">
                                    <span>Items</span>
                                    <span>{totalItems}</span>
                                </div>

                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>

                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>₹{subtotal}</span>
                                </div>

                                <Link
                                    to="/checkout"
                                    className="checkout-button"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    )}
            </main>
        </>
    );
}

export default Cart;