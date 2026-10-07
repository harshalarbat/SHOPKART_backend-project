import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";


function Wishlist() {

    const [wishlist, setWishlist] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        fetchWishlist();

    }, []);


    async function fetchWishlist() {

        try {

            setLoading(true);

            setError("");


            const response = await fetch(
                "http://localhost:3000/wishlist",
                {
                    credentials: "include"
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message || "Unable to load wishlist"
                );

            }


            setWishlist(data.wishlist || []);

        } catch (error) {

            console.log(error);

            setError(error.message);

        } finally {

            setLoading(false);

        }
    }


    async function removeFromWishlist(productId) {

        try {

            const response = await fetch(
                `http://localhost:3000/wishlist/${productId}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(data.message);

                return;

            }


            setWishlist(
                wishlist.filter(
                    (product) => product._id !== productId
                )
            );


        } catch (error) {

            console.log(error);

            alert("Unable to remove product");

        }
    }


    return (
        <>
            <Navbar />

            <main className="products-page">

                <h1>
                    My Wishlist ❤️
                </h1>


                {loading && (
                    <p>
                        Loading wishlist...
                    </p>
                )}


                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}


                {!loading && !error && wishlist.length === 0 && (

                    <p>
                        Your wishlist is empty.
                    </p>

                )}


                {!loading && !error && wishlist.length > 0 && (

                    <div className="products-grid">

                        {wishlist.map((product) => (

                            <div
                                className="product-card"
                                key={product._id}
                            >

                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="product-image"
                                />


                                <div className="product-card-content">

                                    <h3>
                                        {product.name}
                                    </h3>


                                    <p className="product-category">
                                        {product.category}
                                    </p>


                                    <p className="product-price">
                                        ₹{product.price}
                                    </p>


                                    <p>
                                        {product.stock > 0
                                            ? `In stock: ${product.stock}`
                                            : "Out of stock"}
                                    </p>


                                    <Link
                                        to={`/products/${product._id}`}
                                        className="details-button"
                                    >
                                        View Details
                                    </Link>


                                    <button
                                        onClick={() =>
                                            removeFromWishlist(
                                                product._id
                                            )
                                        }
                                        className="wishlist-button"
                                    >
                                        Remove ❤️
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>
        </>
    );
}


export default Wishlist;
