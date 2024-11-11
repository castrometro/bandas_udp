import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

interface ProtectedRouteProps {
    requiredRole?: 'admin' | 'udp';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
    const { state } = useAuth();

    if (state.loading) return <Loader />;

    if (!state.user) return <Navigate to="/" replace />;

    if (requiredRole === 'admin' && !state.user.is_staff) return <Navigate to="/dashboard" replace />;

    if (requiredRole === 'udp' && !state.user.is_udp) return <Navigate to="/dashboard" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
