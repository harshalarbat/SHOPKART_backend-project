
import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { getProductById } from "../services/api";

function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProductById(id);

                setProduct(data.product);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();

    }, [id]);

    if (loading) {
        return (
            <p className="status-message">
                Loading product...
            </p>
        );
    }

    if (error) {
        return (
            <p className="error-message">
                {error}
            </p>
        );
    }

    if (!product) {
        return (
            <p className="status-message">
                Product not found.
            </p>
        );
    }

    return (
        <div className="product-details">
            <img
                src={product.image}
                alt={product.name}
                className="details-image"
            />

            <div className="details-content">
                <h1>{product.name}</h1>

                <p className="product-category">
                    Category: {product.category}
                </p>

                <h2>₹{product.price}</h2>

                <p>{product.description}</p>

                <p>
                    {product.stock > 0
                        ? `Available stock: ${product.stock}`
                        : "Out of stock"}
                </p>

                <button
                    className="cart-button"
                    disabled={product.stock === 0}
                    onClick={() => {
                        alert("Add to Cart UI only");
                    }}
                >
                    Add to Cart
                </button>

                <br />

                <Link
                    to="/products"
                    className="back-button"
                >
                    Back to Products
                </Link>
            </div>
        </div>
    );
}

export default ProductDetails;