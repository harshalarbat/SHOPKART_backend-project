import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function OrderDetails() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchOrder() {
            try {
                const response = await fetch(
                    `http://localhost:3000/orders/${id}`,
                    {
                        credentials: "include"
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load order"
                    );
                }

                setOrder(data.order);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <p className="status-message">
                    Loading order...
                </p>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <p className="error-message">
                    {error}
                </p>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="order-details-page">
                <h1>Order Details</h1>

                <p>
                    <strong>Order ID:</strong>{" "}
                    {order._id}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    {order.status}
                </p>

                <p>
                    <strong>Payment:</strong>{" "}
                    {order.paymentStatus}
                </p>

                <h2>Products</h2>

                {order.items.map((item) => (
                    <div
                        className="order-detail-item"
                        key={item._id}
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                        />

                        <div>
                            <h3>{item.name}</h3>

                            <p>
                                ₹{item.price} ×{" "}
                                {item.quantity}
                            </p>

                            <p>
                                ₹
                                {item.price *
                                    item.quantity}
                            </p>
                        </div>
                    </div>
                ))}

                <h2>
                    Total: ₹{order.totalAmount}
                </h2>

                <h2>Shipping Address</h2>

                <p>
                    {order.shippingAddress.fullName}
                </p>

                <p>
                    {order.shippingAddress.phone}
                </p>

                <p>
                    {order.shippingAddress.addressLine1}
                </p>

                <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}
                </p>

                <p>
                    {order.shippingAddress.pincode}
                </p>
            </main>
        </>
    );
}

export default OrderDetails;