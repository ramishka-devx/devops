import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Logo from "../../assets/logo.jpg"; // replace with your logo

// Use Vite env var if provided; fallback to localhost for dev
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("No token found. Please login.");
        navigate("/")
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          toast.error("Failed to fetch user data.");
        }
      } catch (err) {
        toast.error("Network error.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success("Logged out successfully.");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center text-center mb-8">
          <img src={Logo} alt="logo" className="w-20 h-20 rounded-full" />
          <h1 className="text-green-700 font-bold text-3xl mt-4">
            Bio Tutor
          </h1>
        </div>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 border border-gray-300">
          <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">
            Loading Profile...
          </h2>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mt-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto mt-2"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center text-center mb-8">
        <img src={Logo} alt="logo" className="w-20 h-20 rounded-full" />
        <h1 className="text-green-700 font-bold text-3xl mt-4">
          Bio Tutor
        </h1>
        <p className="text-gray-600 max-w-md mt-2">
          Your profile information
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 border border-gray-300">
        <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">
          User Profile
        </h2>

        {user && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-700"><strong>User ID:</strong> {user.user_id}</p>
              <p className="text-gray-700"><strong>Username:</strong> {user.username}</p>
              <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default Profile;