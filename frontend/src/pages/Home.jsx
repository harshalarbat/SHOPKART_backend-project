import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {

    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        async function getCustomer() {

            const response = await fetch("http://localhost:3000/customers/me", {
                credentials: "include"
            });

            if (!response.ok) {
                navigate("/login");
                return;
            }

            const data = await response.json();

            setCustomer(data);
        }

        getCustomer();

    }, [navigate]);

    async function handleLogout() {

    await fetch("http://localhost:3000/customers/logout", {
        method: "POST",
        credentials: "include"
    });

    navigate("/login");
}

    if (!customer) {
        return <p>Loading...</p>;
    }

    return (
        <div>

            <Navbar />

            <h1>Welcome to ShopKart</h1>

            <p>Name: {customer.name}</p>

            <p>Email: {customer.email}</p>

            <p>Phone: {customer.phone}</p>


        </div>
    );
}

export default Home;