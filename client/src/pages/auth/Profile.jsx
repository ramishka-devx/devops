import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiGet } from "../../lib/api";
import Logo from "../../assets/logo.jpg"; // replace with your logo

// Use Vite env var if provided; fallback to localhost for dev
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
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
          // Fetch enrolled courses
          try {
            const enrolledRes = await apiGet('/api/payments/enrolled-courses');
            setEnrolledCourses(enrolledRes.courses || []);
          } catch (e) {
            console.error('Failed to fetch enrolled courses:', e);
          }
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
    // Dispatch custom event to update navbar
    window.dispatchEvent(new Event('userChange'));
    toast.success("Logged out successfully.");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-green-700 mb-6">Profile</h1>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-green-700">My Profile</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {user && (
          <>
            {/* User Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4">Account Information</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">User ID</label>
                  <p className="text-gray-900">{user.user_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="text-gray-900">{user.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div>
              <h2 className="text-2xl font-semibold text-green-800 mb-4">My Enrolled Courses</h2>
              {enrolledCourses.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map(course => {
                    const cover = course.cover || Logo;
                    const created = course.created_at ? new Date(course.created_at) : null;
                    return (
                      <Link key={course.course_id} to={`/courses/${course.course_id}`} className="group bg-white border border-gray-300 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        <div className="w-full h-40 bg-gray-100 overflow-hidden">
                          <img src={cover} alt="Course cover image" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-lg font-semibold text-green-800 line-clamp-2">{course.title}</h3>
                            <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${course.is_published ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{course.is_published ? 'Published' : 'Draft'}</span>
                          </div>
                          {course.description && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-3">{course.description}</p>
                          )}
                          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                            <span>Course ID: {course.course_id}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center">
                  <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                  <Link to="/courses" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Profile;