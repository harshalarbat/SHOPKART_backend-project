
// import { Link } from "react-router-dom";

// function ProductCard({ product }) {
//     return (
//         <div className="product-card">
//             <img
//                 src={product.image}
//                 alt={product.name}
//                 className="product-image"
//             />

//             <div className="product-card-content">
//                 <h3>{product.name}</h3>

//                 <p className="product-category">
//                     {product.category}
//                 </p>

//                 <p className="product-price">
//                     ₹{product.price}
//                 </p>

//                 <p>
//                     {product.stock > 0
//                         ? `In stock: ${product.stock}`
//                         : "Out of stock"}
//                 </p>

//                 <Link
//                     to={`/products/${product._id}`}
//                     className="details-button"
//                 >
//                     View Details
//                 </Link>
//             </div>
//         </div>
//     );
// }

// export default ProductCard;     


// import { Link } from "react-router-dom";

// function ProductCard({ product }) {

//     async function addToWishlist() {

//         try {

//             const response = await fetch(
//                 `http://localhost:3000/wishlist/${product._id}`,
//                 {
//                     method: "POST",
//                     credentials: "include"
//                 }
//             );

//             const data = await response.json();

//             if (response.ok) {

//                 alert("Added to Wishlist ❤️");

//             } else {

//                 alert(data.message);

//             }

//         } catch (error) {

//             console.log(error);

//             alert("Unable to add to wishlist");

//         }
//     }


//     return (

//         <div className="product-card">

//             <img
//                 src={product.image}
//                 alt={product.name}
//                 className="product-image"
//             />


//             <div className="product-card-content">

//                 <h3>
//                     {product.name}
//                 </h3>


//                 <p className="product-category">
//                     {product.category}
//                 </p>


//                 <p className="product-price">
//                     ₹{product.price}
//                 </p>


//                 <p>
//                     {product.stock > 0
//                         ? `In stock: ${product.stock}`
//                         : "Out of stock"}
//                 </p>


//                 <Link
//                     to={`/products/${product._id}`}
//                     className="details-button"
//                 >
//                     View Details
//                 </Link>


//                 <button
//                     onClick={addToWishlist}
//                     className="wishlist-button"
//                 >
//                     Add to Wishlist ❤️
//                 </button>

//             </div>

//         </div>
//     );
// }

// export default ProductCard;




import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [adding, setAdding] = useState(false);

    async function handleAddToCart() {
        try {
            setAdding(true);
            await addToCart(product._id);
            alert("Added to Cart 🛒");
        } catch (error) {
            alert(error.message);
        } finally {
            setAdding(false);
        }
    }

    return (
        <div className="product-card">
            <img
                src={product.image}
                alt={product.name}
                className="product-image"
            />

            <div className="product-card-content">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">₹{product.price}</p>

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
                    onClick={handleAddToCart}
                    disabled={adding || product.stock <= 0}
                    className="cart-button"
                >
                    {adding
                        ? "Adding..."
                        : product.stock <= 0
                            ? "Out of Stock"
                            : "Add to Cart 🛒"}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;