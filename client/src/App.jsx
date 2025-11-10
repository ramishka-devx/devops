import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/auth/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Courses from './pages/student/Courses';
import CourseDetail from './pages/student/CourseDetail';
import LessonsView from './pages/student/LessonsView';
import AdminCourses from './pages/admin/AdminCourses';

function App() {
  let user = null;
  try { user = JSON.parse(localStorage.getItem('user')); } catch { /* ignore */ }
  return (
    <BrowserRouter>
      <nav className="p-4 bg-white border-b border-green-700/20 flex gap-4">
        <Link to="/" className="text-green-700 font-semibold">Home</Link>
        <Link to="/courses" className="text-green-700">Courses</Link>
        <Link to="/profile" className="text-green-700">Profile</Link>
        {user?.role === 'admin' && (
          <Link to="/admin/courses" className="text-green-700">Admin</Link>
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
        <Route path="*" element={<Login />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App
