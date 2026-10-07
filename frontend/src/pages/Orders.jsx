import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchOrders() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:3000/orders",
                {
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to load orders"
                );
            }

            setOrders(data.orders || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <>
            <Navbar />

            <main className="orders-page">
                <h1>My Orders</h1>

                {loading && (
                    <p className="status-message">
                        Loading orders...
                    </p>
                )}

                {error && !loading && (
                    <div className="cart-error">
                        <p>{error}</p>

                        <button onClick={fetchOrders}>
                            Try Again
                        </button>
                    </div>
                )}

                {!loading &&
                    !error &&
                    orders.length === 0 && (
                        <div className="empty-cart">
                            <h2>
                                You have not placed any orders yet.
                            </h2>

                            <Link
                                to="/products"
                                className="browse-button"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    orders.length > 0 && (
                        <div className="orders-list">
                            {orders.map((order) => (
                                <div
                                    className="order-card"
                                    key={order._id}
                                >
                                    <h2>
                                        Order #{order._id}
                                    </h2>

                                    <p>
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </p>

                                    {order.items.map((item) => (
                                        <p
                                            key={item._id}
                                        >
                                            {item.name} ×{" "}
                                            {item.quantity}
                                        </p>
                                    ))}

                                    <p>
                                        <strong>
                                            Total:
                                        </strong>{" "}
                                        ₹{order.totalAmount}
                                    </p>

                                    <p>
                                        <strong>
                                            Status:
                                        </strong>{" "}
                                        {order.status}
                                    </p>

                                    <Link
                                        to={`/orders/${order._id}`}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
            </main>
        </>
    );
}

export default Orders;