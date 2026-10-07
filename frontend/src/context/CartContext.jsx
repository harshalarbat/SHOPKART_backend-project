import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const CartContext = createContext();

function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchCart() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:3000/cart",
                {
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to load cart"
                );
            }

            setCartItems(data.cart || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCart();
    }, []);

    async function addToCart(productId) {
        const response = await fetch(
            `http://localhost:3000/cart/${productId}`,
            {
                method: "POST",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to add to cart"
            );
        }

        setCartItems(data.cart || []);

        return data;
    }

    async function updateQuantity(productId, quantity) {
        const response = await fetch(
            `http://localhost:3000/cart/${productId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    quantity: quantity
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to update quantity"
            );
        }

        setCartItems(data.cart || []);

        return data;
    }

    async function removeFromCart(productId) {
        const response = await fetch(
            `http://localhost:3000/cart/${productId}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to remove product"
            );
        }

        setCartItems(data.cart || []);

        return data;
    }

    function clearCart() {
        setCartItems([]);
    }

    const totalItems = cartItems.reduce(
        (total, item) => {
            return total + item.quantity;
        },
        0
    );

    const subtotal = cartItems.reduce(
        (total, item) => {
            return (
                total +
                item.product.price * item.quantity
            );
        },
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                loading,
                error,
                totalItems,
                subtotal,
                addToCart,
                updateQuantity,
                removeFromCart,
                fetchCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}

export default CartProvider;