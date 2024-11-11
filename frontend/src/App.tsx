// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import ProtectedLayout from './components/layout/ProtectedLayout';
import DashboardHome from './components/dashboard/DashboardHome';
import BandList from './components/bands/BandList';
import BandForm from './components/bands/BandForm';
// import BandDetails from './components/bands/BandDetails';
// import ReservationForm from './components/dashboard/ReservationForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import 'react-toastify/dist/ReactToastify.css';
import AuthForm from "./components/auth/AuthForm.tsx";
import {ToastContainer} from "react-toastify";


function App() {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<AuthForm />} />

            {/*<Route path="/login" element={<LoginForm />} />*/}
            {/*<Route path="/register" element={<RegisterForm />} />*/}

            {/* Rutas Protegidas Solo para Usuarios UDP */}
            <Route element={<ProtectedRoute requiredRole="udp" />}>
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/bands" element={<BandList />} />
                <Route path="/bands/new" element={<BandForm />} />
                {/*<Route path="/bands/:id" element={<BandDetails />} />*/}
                {/*<Route path="/reservations/create" element={<ReservationForm />} />*/}
                {/* Puedes añadir más rutas protegidas aquí */}
              </Route>
            </Route>

            {/* Ruta Raíz Redirecciona al Dashboard si está autenticado */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Ruta 404 */}
            <Route path="*" element={<h1>Página no encontrada</h1>} />
          </Routes>
          <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              toastClassName={({ type }) =>
                  `flex items-center p-4 mb-4 text-white rounded-lg shadow-lg transition-transform transform ${
                      type === 'success' ? 'bg-rockRed border-l-4 border-yellow-500' :
                          type === 'error' ? 'bg-rockBlack border-l-4 border-red-500' :
                              'bg-gray-700 border-l-4 border-gray-600'
                  }`
              }
              bodyClassName="font-rock text-base"
              style={{ zIndex: 9999 }}
          />
        </Router>
      </AuthProvider>
  );
}

export default App;
