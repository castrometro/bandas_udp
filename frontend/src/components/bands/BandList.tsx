// src/components/bands/BandList.tsx

import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import { Band } from '../../types';
import { Link } from 'react-router-dom';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const BandList: React.FC = () => {
  const [bands, setBands] = useState<Band[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBands = async () => {
      try {
        const response = await axiosInstance.get('/api/application/bands/');
        setBands(response.data);
      } catch (err: any) {
        setError('Error al cargar las bandas.');
      } finally {
        setLoading(false);
      }
    };

    fetchBands();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Bandas Disponibles</h1>
          <Link to="/bands/create" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Crear Banda
          </Link>
        </div>
        {bands.length === 0 ? (
            <p>No hay bandas disponibles.</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bands.map((band) => (
                  <Link
                      key={band.id}
                      to={`/bands/${band.id}`}
                      className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <h2 className="text-xl font-semibold">{band.name}</h2>
                    <p className="text-sm text-gray-600">Integrantes: {band.members.length}</p>
                  </Link>
              ))}
            </div>
        )}
      </div>
  );
};

export default BandList;
