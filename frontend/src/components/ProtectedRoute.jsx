import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useSelector(state => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-xl font-heading text-primary animate-pulse">Initializing IntelliCar Core...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
