import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Logo from "../../assets/logo.jpg"; // replace with your logo

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Login successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/profile")
      } else {
        toast.error(data.error || "Invalid email or password.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6 gap-8">
      {/* Left Intro Section */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
        <img
          src={Logo}
          alt="logo"
          className="w-24 h-24 rounded-3xl shadow-md mb-4"
        />
        <h1 className="text-green-700 font-bold text-4xl leading-tight">
          Welcome to <span className="text-green-800">Bio Tutor</span>
        </h1>
        <p className="text-gray-600 mt-3 text-lg leading-relaxed">
          Start your journey with expert tutors and advanced resources. Let’s
          make learning both effective and enjoyable!
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Log In to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 focus:ring-4 focus:ring-green-400 transition disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4z"
                ></path>
              </svg>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
      <Toaster position="top-center" />
    </section>
  );
};

export default Login;
