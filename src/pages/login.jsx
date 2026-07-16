import { useState } from "react";
import axios from "axios";

function Login({ setShowSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post("https://task-manager-backend-project-2g54.onrender.com/api/login", {
                email,
                password,
            });

            // Store token
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.user.id);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            // Reload app to check token in App.jsx
            window.location.reload();

        } catch (err) {
            setError(
                err.response?.data?.message || "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

                {/* Title */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Task Manager
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Login to manage your tasks
                    </p>
                </div>


                {/* Error */}
                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-red-600">
                        {error}
                    </div>
                )}


                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            required
                        />
                    </div>


                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            required
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>


                {/* Signup */}
                <p className="mt-6 text-center text-slate-600">
                    Don't have an account?
                    <button
                        type="button"
                        onClick={() => setShowSignup(true)}
                        className="ml-2 font-semibold text-blue-600 hover:underline"
                    >
                        Sign Up
                    </button>
                </p>

            </div>
        </div>
    );
}

export default Login;