// src/components/RegisterForm.tsx
import { useState, useEffect } from 'react';
import { UserPlus, Loader2, Guitar } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axiosInstance from "../../api/axios.tsx";
import { getCSRFToken } from "../../../utils/csrf.tsx";

interface RegisterFormProps {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    ruf: '',
    password: '',
    isUDP: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Efecto para determinar isUDP basado en el email
  useEffect(() => {
    if (formData.email) {
      const emailParts = formData.email.split('@');
      if (emailParts.length === 2 && emailParts[1] === 'mail.udp.cl') {
        setFormData((prev) => ({ ...prev, isUDP: true }));
      } else {
        setFormData((prev) => ({ ...prev, isUDP: false }));
      }
    }
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosInstance.post('/api/application/register/', {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        ruf: formData.ruf,
        password: formData.password,
        isUDP: formData.isUDP,
      }, {
        headers: {
          'X-CSRFToken': getCSRFToken(),
        },
      });

      if (formData.isUDP) {
        toast.success('Registro exitoso! Necesitas la aprobación de un administrador para iniciar sesión.');
      } else {
        toast.success('Registro exitoso! Ahora puedes iniciar sesión.');
      }

      onSuccess();

    } catch (error: any) {
      console.error('Error de registro:', error);
      if (error.response && error.response.data && error.response.data.detail) {
        toast.error(`Error de registro: ${error.response.data.detail}`);
      } else {
        toast.error(`Error de registro: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <>
        <div className="text-center relative">
          <UserPlus className="mx-auto h-12 w-12 text-rockYellow animate-bounce" />
          <h2 className="mt-8 text-3xl font-bold text-white">
            Crear tu cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Únete a nosotros hoy mismo
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Nombre Completo
              </label>
              <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-rockRed focus:border-rockRed transition duration-200 ease-in-out"
                  placeholder="Nombre Completo"
                  value={formData.name}
                  onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                  }
              />
            </div>
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
              <label htmlFor="email" className="sr-only">
                Dirección de Email
              </label>
              <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`appearance-none rounded-lg relative block w-full px-4 py-3 border ${
                      formData.isUDP ? 'border-green-500' : 'border-gray-600'
                  } placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-rockRed focus:border-rockRed transition duration-200 ease-in-out`}
                  placeholder="Dirección de Email"
                  value={formData.email}
                  onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                  }
              />
              {formData.isUDP && (
                  <p className="mt-1 text-sm text-green-500">
                    Se ha detectado que eres estudiante de UDP.
                  </p>
              )}
            </div>
            <div>
              <label htmlFor="ruf" className="sr-only">
                RUT
              </label>
              <input
                  id="ruf"
                  name="ruf"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-600 placeholder-gray-400 text-white bg-gray-700 focus:outline-none focus:ring-rockRed focus:border-rockRed transition duration-200 ease-in-out"
                  placeholder="RUT"
                  value={formData.ruf}
                  onChange={(e) =>
                      setFormData({ ...formData, ruf: e.target.value })
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
                    Registrando...
                  </>
              ) : (
                  'Registrarse'
              )}
            </button>
          </div>
        </form>
      </>
  );
}
