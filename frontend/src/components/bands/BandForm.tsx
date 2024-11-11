// src/components/bands/BandForm.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';
import { Search, X } from 'lucide-react';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const BandForm: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    members: [] as User[],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/application/users/search?term=${encodeURIComponent(term)}`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (err: any) {
      console.error('Failed to search users:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMember = (user: User) => {
    if (!formData.members.find((m) => m.id === user.id)) {
      setFormData({
        ...formData,
        members: [...formData.members, user],
      });
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeMember = (userId: string) => {
    setFormData({
      ...formData,
      members: formData.members.filter((m) => m.id !== userId),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.name.trim() === '') {
      setError('El nombre de la banda es obligatorio.');
      return;
    }

    if (formData.members.length === 0) {
      setError('Debe agregar al menos un miembro a la banda.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/application/bands/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          members: formData.members.map((m) => m.id),
        }),
      });

      if (response.ok) {
        navigate('/bands');
      } else {
        const data = await response.json();
        setError(data.detail || 'Error al crear la banda.');
      }
    } catch (err: any) {
      console.error('Failed to create band:', err);
      setError('Error al crear la banda.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Banda</h2>
            <p className="mt-1 text-sm text-gray-500">
              Completa la información a continuación para crear una nueva banda.
            </p>
          </div>

          {error && <ErrorMessage message={error} />}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre de la Banda
            </label>
            <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Integrantes</label>
            <div className="mt-1 relative">
              <input
                  type="text"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Buscar usuarios por nombre o RUT"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {loading && <Loader />}

            {searchResults.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {searchResults.map((user) => (
                      <li
                          key={user.id}
                          className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-indigo-50"
                          onClick={() => addMember(user)}
                      >
                        <div className="flex items-center">
                    <span className="font-normal block truncate">
                      {user.name} ({user.rut})
                    </span>
                        </div>
                      </li>
                  ))}
                </ul>
            )}
          </div>

          <div className="mt-2 space-y-2">
            {formData.members.map((member) => (
                <div
                    key={member.id}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                >
              <span className="text-sm">
                {member.name} ({member.rut})
              </span>
                  <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <button
                type="button"
                onClick={() => navigate('/bands')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {loading ? 'Creando...' : 'Crear Banda'}
            </button>
          </div>
        </form>
      </div>
  );
};

export default BandForm;
