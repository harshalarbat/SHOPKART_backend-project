import { useEffect, useState } from "react";

import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

import { getProducts } from "../services/api";

function Products() {
    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProducts(
                    search,
                    category
                );

                setProducts(data.products);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

    }, [search, category]);

    return (
        <div className="products-page">
            <h1>ShopKart Products</h1>

            <SearchBar
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
            />

            {loading && (
                <p className="status-message">
                    Loading products...
                </p>
            )}

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!loading && !error && products.length === 0 && (
                <p className="status-message">
                    No products found.
                </p>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Products;