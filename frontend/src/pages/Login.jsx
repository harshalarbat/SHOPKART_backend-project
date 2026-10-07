// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function Login() {

//     const navigate = useNavigate();

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");

//     async function handleLogin() {

//         if (!email || !password) {
//             setError("Email and password are required");
//             return;
//         }

//         setError("");

//         const data = {
//             email: email,
//             password: password
//         };

//         const response = await fetch("http://localhost:3000/customers/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             credentials: "include",
//             body: JSON.stringify(data)
//         });

//         const result = await response.json();

//         if (!response.ok) {
//             setError("Invalid Credentials");
//             return;
//         }

//         alert(result.message);

//         navigate("/home");
//     }

//     return (
//         <div>

//             <h1>ShopKart Login</h1>

//             <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//             />

//             <br /><br />

//             <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.targt.value)}
//             />

//             <br /><br />

//             {error && <p>{error}</p>}

//             <button onClick={handleLogin}>
//                 Login
//             </button>

//         </div>
//     );
// }

// export default Login;   

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin() {
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        setError("");

        const data = {
            email: email,
            password: password
        };

        try {
            const response = await fetch(
                "http://localhost:3000/customers/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                setError("Invalid Credentials");
                return;
            }

            alert(result.message);
            navigate("/home");

        } catch (error) {
            setError("Unable to connect to server");
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h1>ShopKart</h1>

                <p className="auth-subtitle">
                    Login to your account
                </p>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}>
                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <button type="submit">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;