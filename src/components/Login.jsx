import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSignUp = () => {
    navigate("/signup");  // Navigate to the sign-up page
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-blue-900">
      <div className="flex w-3/4 bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Side: Form */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Login
              </button>
            </form>
            <div className="mt-2 text-center">
              <button
                onClick={handleForgotPassword}
                className="text-blue-500 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            {/* Sign-up Button */}
            <div className="mt-4 text-center">
              <button
                onClick={handleSignUp}
                className="text-blue-500 hover:underline"
              >
                Don't have an account? Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Background Image */}
        <div
          className="w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/background.png')" }}
        ></div>
      </div>
    </div>
  );
}
