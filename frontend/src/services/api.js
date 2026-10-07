
const API_URL = "http://localhost:3000";

export const getProducts = async (search = "", category = "") => {
    let url = `${API_URL}/products`;

    const params = new URLSearchParams();

    if (search.trim() !== "") {
        params.append("search", search);
    }

    if (category !== "") {
        params.append("category", category);
    }

    if (params.toString() !== "") {
        url += `?${params.toString()}`;
    }

    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
    }

    return data;
};


export const getProductById = async (id) => {
    const response = await fetch(
        `${API_URL}/products/${id}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch product");
    }

    return data;
};