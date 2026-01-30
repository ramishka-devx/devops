import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Courses from './pages/student/Courses';
import CourseDetail from './pages/student/CourseDetail';
import LessonsView from './pages/student/LessonsView';
import AdminCourses from './pages/admin/AdminCourses';
import AdminMonths from './pages/admin/AdminMonths';
import AdminLessons from './pages/admin/AdminLessons';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from localStorage on mount
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user');
        setUser(userData ? JSON.parse(userData) : null);
      } catch {
        setUser(null);
      }
    };

    loadUser();

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = () => loadUser();
    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom login/logout events
    const handleUserChange = () => loadUser();
    window.addEventListener('userChange', handleUserChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChange', handleUserChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <nav className="p-4 bg-white border-b border-green-700/20 flex gap-4">
        {!user && <Link to="/" className="text-green-700 font-semibold">Home</Link>}
        <Link to="/courses" className="text-green-700">Courses</Link>
        {user && <Link to="/profile" className="text-green-700">Profile</Link>}
        {user?.role === 'admin' && (
          <Link to="/admin/courses" className="text-green-700">Admin Dashboard</Link>
        )}
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Student */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
        <Route path="/lessons" element={<ProtectedRoute><LessonsView /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/courses" element={<ProtectedRoute requireAdmin><AdminCourses /></ProtectedRoute>} />
        <Route path="/admin/courses/:courseId/months" element={<ProtectedRoute requireAdmin><AdminMonths /></ProtectedRoute>} />
        <Route path="/admin/months/:monthId/lessons" element={<ProtectedRoute requireAdmin><AdminLessons /></ProtectedRoute>} />
        <Route path="*" element={<Login />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App
