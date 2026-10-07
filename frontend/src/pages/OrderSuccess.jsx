import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function OrderSuccess() {
    const { id } = useParams();

    return (
        <>
            <Navbar />

            <main className="order-success">
                <h1>✅ Order Placed Successfully</h1>

                <p>
                    Your order has been saved successfully.
                </p>

                <p>
                    <strong>Order ID:</strong>
                </p>

                <p>{id}</p>

                <div className="success-buttons">
                    <Link to="/orders">
                        View My Orders
                    </Link>

                    <Link to="/products">
                        Continue Shopping
                    </Link>
                </div>
            </main>
        </>
    );
}

export default OrderSuccess;