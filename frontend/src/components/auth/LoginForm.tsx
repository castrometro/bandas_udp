// src/components/LoginForm.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogIn, Loader2, Guitar } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCSRFToken } from "../../../utils/csrf.tsx";
import axiosInstance from "../../api/axios.tsx";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosInstance.post('/api/application/login/', {
        username: formData.username,
        password: formData.password,
      }, {
        headers: {
          'X-CSRFToken': getCSRFToken(),
        },
      });

      toast.success('Inicio de sesión exitoso!');
      // Redirigir después de un breve retraso para que el usuario vea la notificación
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error de inicio de sesión:', error);
      if(error.response && error.response.status === 400) {
        toast.error('Usuario o contraseña incorrectos.');
      } else {
        toast.error(`Error de inicio de sesión: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <>
        <div className="text-center relative">

          <LogIn className="mx-auto h-12 w-12 text-rockYellow animate-bounce" />
          <h2 className="mt-8 text-3xl font-bold text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Bienvenido de nuevo
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Nombre de Usuario
              </label>
              <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-rockRed focus:border-rockRed transition duration-200 ease-in-out"
                  placeholder="Nombre de Usuario"
                  value={formData.username}
                  onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                  }
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-rockRed focus:border-rockRed transition duration-200 ease-in-out"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                  }
              />
            </div>
          </div>

          <div>
            <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-rockRed hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rockRed transition duration-200 ease-in-out disabled:opacity-50"
            >
              {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Iniciando...
                  </>
              ) : (
                  'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>
      </>
  );
}
