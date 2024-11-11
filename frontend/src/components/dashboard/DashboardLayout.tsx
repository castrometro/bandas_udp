import { useAuth } from '../../context/AuthContext';
import Loader from "../common/Loader.tsx";
import Navigation from "../layout/Navigation.tsx";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { state } = useAuth();
    const { loading } = state;

    return (
        <div className="flex min-h-screen bg-rockBlack text-white">
            <Navigation />
            <div className="flex flex-col flex-grow">
                <main className="flex-grow container mx-auto p-4">
                    {children}
                </main>
                <footer className="bg-gray-800 text-center py-4">
                    &copy; {new Date().getFullYear()} Rock Dashboard. Todos los derechos reservados.
                </footer>
            </div>
            {loading && <Loader />}
        </div>
    );
}
