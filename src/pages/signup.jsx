import { useState } from "react";
import axios from "axios";

function Signup({ setShowSignup }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

   const handleSignup = async (e) => {
  e.preventDefault();

  setError("");

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setLoading(true);

  try {
    await axios.post("https://task-manager-backend-project-2g54.onrender.com/api/signup", {
      name,
      email,
      password,
    });

    // After successful signup, move to login page
    setShowSignup(false);

  } catch (err) {
    setError(
      err.response?.data?.message || "Signup failed. Try again."
    );
  } finally {
    setLoading(false);
  }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

                {/* Heading */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-800">
                        Create Account
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Join Task Manager today
                    </p>
                </div>


                {/* Error */}
                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 p-3 text-center text-red-600">
                        {error}
                    </div>
                )}


                <form onSubmit={handleSignup} className="space-y-4">

                    {/* Name */}
                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                    />


                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                    />


                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                    />


                    {/* Confirm Password */}
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        required
                    />


                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>

                </form>


                {/* Login Link */}
                <p className="mt-6 text-center text-slate-600">
                    Already have an account?
                    <button
                        type="button"
                        onClick={() => setShowSignup(false)}
                        className="ml-2 font-semibold text-blue-600 hover:underline"
                    >
                        Login
                    </button>
                </p>

            </div>
        </div>
    );
}

export default Signup;