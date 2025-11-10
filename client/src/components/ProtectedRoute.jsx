import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');
  if (!token || !userRaw) return <Navigate to="/login" replace />;
  let user;
  try { user = JSON.parse(userRaw); } catch { return <Navigate to="/login" replace />; }
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/profile" replace />;
  return children;
}
