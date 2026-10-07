
// import { Link } from "react-router-dom";

// function Navbar() {
//     return (
//         <nav className="navbar">
//             <h2>ShopKart</h2>

//             <div className="navbar-links">
//                 <Link to="/home">
//                     Home
//                 </Link>

//                 <Link to="/products">
//                     Products
//                 </Link>

//                 <Link to="/login">
//                     Login
//                 </Link>

//                 <Link to="/register">
//                     Register
//                 </Link>
//             </div>
//         </nav>
//     );
// }

// export default Navbar;  

import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
    const { totalItems } = useCart();

    return (
        <nav className="navbar">
            <h2>ShopKart</h2>

            <div className="navbar-links">
                <Link to="/home">
                    Home
                </Link>

                <Link to="/products">
                    Products
                </Link>

                <Link to="/wishlist">
                    Wishlist ❤️
                </Link>

                <Link to="/cart">
                    Cart ({totalItems})
                </Link>

                <Link to="/orders">
                    My Orders
                </Link>

                <Link to="/login">
                    Login
                </Link>

                <Link to="/register">
                    Register
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;