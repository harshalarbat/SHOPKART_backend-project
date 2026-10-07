
function SearchBar({
    search,
    setSearch,
    category,
    setCategory
}) {
    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(event) => {
                    setSearch(event.target.value);
                }}
            />

            <select
                value={category}
                onChange={(event) => {
                    setCategory(event.target.value);
                }}
            >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home">Home</option>
                <option value="Accessories">Accessories</option>
            </select>
        </div>
    );
}

export default SearchBar;