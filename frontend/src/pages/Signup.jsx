import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {

    const response = await fetch("https://sleepsense-ai.onrender.com/signup", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email,
        password
      })

    });

    const data = await response.json();

    if (data.message) {

      alert("Account created!");

      window.location.href = "/login";

    } else {

      alert("Signup failed");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 px-4">

      <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md">

        {/* Brand Header */}
        <div className="text-center mb-6">

          <div className="text-4xl mb-2">🌙</div>

          <h2 className="text-2xl font-bold text-gray-800">
            SleepSense AI
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Start your journey to better sleep
          </p>

        </div>

        <input
          type="email"
          placeholder="Username"
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-medium">
            Login
          </Link>
        </p>

      </div>

    </div>

  );

};

export default Signup;