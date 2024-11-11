// src/components/Layout/Navigation.tsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {Music2, LogOut, Guitar} from 'lucide-react';
import { useState } from 'react';
import {motion} from "framer-motion";

export default function Navigation() {
  const { dispatch, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    dispatch({ type: 'LOGOUT' });
  };

  const navItems = [
    { name: 'Dashboard', icon: <Music2 className="h-5 w-5 mr-2" />, path: '/dashboard' },
  ];



  return (
      <>
        {/* Menú superior para dispositivos móviles */}
        <div className="bg-gray-900 text-white md:hidden flex items-center justify-between p-4">
          <div className="flex items-center">
            <Music2 className="h-6 w-6 text-rockRed mr-2" />
            <span className="text-xl font-bold font-rock">Bandas UDP</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {/* Ícono de menú */}
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {/* Menú móvil */}
        {isMobileMenuOpen && (
            <div className="bg-gray-900 text-white md:hidden">
              {navItems.map((item) => (
                  <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-2 mt-2 hover:bg-gray-700 ${
                          location.pathname === item.path ? 'bg-gray-700' : ''
                      }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
              ))}
              <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-700"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </button>
            </div>
        )}
        {/* Barra lateral para pantallas medianas y grandes */}
        <nav className="hidden md:flex flex-col bg-gray-900 text-white w-64 min-h-screen">
          <div className="flex items-center justify-center py-6 border-b border-gray-700 space-x-2">
            <motion.div
                animate={{rotate: 360}}
                transition={{repeat: Infinity, duration: 20, ease: "linear"}}
            >
              <Guitar className="text-rockRed h-16 w-16"/>
            </motion.div>
            <span className="text-2xl font-bold font-rock">Bandas UDP</span>
          </div>
          <div className="flex-grow mt-4">
            {navItems.map((item) => (
                <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center px-4 py-2 mt-2 hover:bg-gray-700 ${
                        location.pathname === item.path ? 'bg-gray-700' : ''
                    }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
            ))}
          </div>
          <div className="px-4 py-4 border-t border-gray-700">
            <button
                onClick={handleLogout}
                className="flex items-center w-full text-left hover:bg-gray-700 px-2 py-2 rounded"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </>
  );
}
