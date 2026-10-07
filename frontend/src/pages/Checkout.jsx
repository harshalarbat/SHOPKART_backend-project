import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

function Checkout() {
    const navigate = useNavigate();

    const {
        cartItems,
        subtotal,
        clearCart
    } = useCart();

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [error, setError] = useState("");
    const [placingOrder, setPlacingOrder] = useState(false);

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    function validateForm() {
        for (const key in form) {
            if (form[key].trim() === "") {
                return "All fields are required";
            }
        }

        if (!/^\d{10}$/.test(form.phone)) {
            return "Phone must contain 10 digits";
        }

        if (!/^\d{6}$/.test(form.pincode)) {
            return "Pincode must contain 6 digits";
        }

        return "";
    }

    function loadRazorpayScript() {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    }

    async function handlePlaceOrder(event) {
        event.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        if (cartItems.length === 0) {
            setError("Your cart is empty");
            return;
        }

        try {
            setError("");
            setPlacingOrder(true);

            const scriptLoaded = await loadRazorpayScript();

            if (!scriptLoaded) {
                throw new Error(
                    "Unable to load Razorpay Checkout"
                );
            }

            const response = await fetch(
                "http://localhost:3000/orders/create-payment-order",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        shippingAddress: form
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to create order"
                );
            }

            const options = {
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "ShopKart",
                description: "ShopKart Order",
                order_id: data.razorpayOrderId,

                prefill: {
                    name: form.fullName,
                    contact: form.phone
                },

                handler: async function (paymentResponse) {
                    try {
                        const verifyResponse = await fetch(
                            "http://localhost:3000/orders/verify-payment",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                credentials: "include",
                                body: JSON.stringify({
                                    shopKartOrderId:
                                        data.shopKartOrderId,

                                    razorpay_order_id:
                                        paymentResponse.razorpay_order_id,

                                    razorpay_payment_id:
                                        paymentResponse.razorpay_payment_id,

                                    razorpay_signature:
                                        paymentResponse.razorpay_signature
                                })
                            }
                        );

                        const verifyData =
                            await verifyResponse.json();

                        if (!verifyResponse.ok) {
                            throw new Error(
                                verifyData.message ||
                                "Payment verification failed"
                            );
                        }

                        clearCart();

                        navigate(
                            `/order-success/${data.shopKartOrderId}`
                        );
                    } catch (error) {
                        setError(error.message);
                        setPlacingOrder(false);
                    }
                }
            };

            const paymentObject =
                new window.Razorpay(options);

            paymentObject.on(
                "payment.failed",
                function () {
                    setError(
                        "Payment failed. Your cart has not been cleared."
                    );

                    setPlacingOrder(false);
                }
            );

            paymentObject.open();

            setPlacingOrder(false);
        } catch (error) {
            setError(error.message);
            setPlacingOrder(false);
        }
    }

    return (
        <>
            <Navbar />

            <main className="checkout-page">
                <h1>Checkout</h1>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <div className="checkout-layout">

                    <form
                        className="checkout-form"
                        onSubmit={handlePlaceOrder}
                    >
                        <h2>Shipping Details</h2>

                        <label>Full Name</label>

                        <input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Full Name"
                        />

                        <label>Phone</label>

                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="10 digit phone number"
                        />

                        <label>Address</label>

                        <input
                            name="addressLine1"
                            value={form.addressLine1}
                            onChange={handleChange}
                            placeholder="Address"
                        />

                        <label>City</label>

                        <input
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            placeholder="City"
                        />

                        <label>State</label>

                        <input
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            placeholder="State"
                        />

                        <label>Pincode</label>

                        <input
                            name="pincode"
                            value={form.pincode}
                            onChange={handleChange}
                            placeholder="6 digit pincode"
                        />

                        <button
                            type="submit"
                            disabled={placingOrder}
                        >
                            {placingOrder
                                ? "Processing..."
                                : "Place Order"}
                        </button>
                    </form>


                    <div className="checkout-summary">
                        <h2>Order Summary</h2>

                        {cartItems.map((item) => (
                            <div
                                className="summary-row"
                                key={item.product._id}
                            >
                                <span>
                                    {item.product.name} ×{" "}
                                    {item.quantity}
                                </span>

                                <span>
                                    ₹
                                    {item.product.price *
                                        item.quantity}
                                </span>
                            </div>
                        ))}

                        <div className="summary-total">
                            <span>Total</span>
                            <span>₹{subtotal}</span>
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}

export default Checkout;