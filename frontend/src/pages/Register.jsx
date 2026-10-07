
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function handleRegister() {

        console.log("Create Account button clicked");

        setError("");
        setMessage("");

        if (!name || !email || !password || !phone) {
            setError("All fields are required");
            return;
        }

        if (!email.includes("@")) {
            setError("Enter a valid email");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (phone.length !== 10) {
            setError("Phone number must be 10 digits");
            return;
        }

        const data = {
            name: name,
            email: email,
            password: password,
            phone: phone
        };

        console.log("Sending registration request");

        try {

            const response = await fetch(
                "http://localhost:3000/customers/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            console.log("Backend response:", result);

            if (!response.ok) {
                setError(result.message || "Registration failed");
                return;
            }

            setMessage("Registration successful");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {

            console.log("Registration error:", error);

            setError("Cannot connect to the backend");

        }
    }

    return (
        <div>

            <h1>Create Account</h1>

            <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <br /><br />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <br /><br />

            {error && <p style={{ color: "red" }}>{error}</p>}

            {message && <p style={{ color: "green" }}>{message}</p>}

            <button type="button" onClick={handleRegister}>
                Create Account
            </button>

        </div>
    );
}

export default Register;