import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';

export default function ProtectedLayout() {
  const { state } = useAuth();
  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  return (
      <Outlet />
  );
}