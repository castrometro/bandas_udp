// src/components/dashboard/BandSearch.tsx

import { useState } from 'react';
import axiosInstance from '../../api/axios';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { toast } from 'react-toastify';

interface Band {
    id: string;
    name: string;
    members: User[];
    created_at: string;
}

interface User {
    id: string;
    username: string;
    ruf: string;
}

interface BandSearchProps {
    onJoin: () => void; // Callback para refrescar los datos del usuario después de unirse a una banda
}

const BandSearch: React.FC<BandSearchProps> = ({ onJoin }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [bands, setBands] = useState<Band[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [joiningBandId, setJoiningBandId] = useState<string | null>(null);

    const handleSearch = async () => {
        if (searchTerm.trim().length < 3) {
            setBands([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/api/application/bands/?search=${encodeURIComponent(searchTerm)}`);
            setBands(response.data);
        } catch (err: any) {
            setError('Error al buscar bandas.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (bandId: string) => {
        try {
            setJoiningBandId(bandId);
            await axiosInstance.post(`/api/application/bands/${bandId}/join/`);
            toast.success('Te has unido a la banda exitosamente!');
            onJoin(); // Refrescar los datos del usuario
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Error al unirse a la banda.');
            toast.error('Error al unirse a la banda.');
        } finally {
            setJoiningBandId(null);
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Buscar Bandas</h2>
            {error && <ErrorMessage message={error} />}
            <div className="flex mb-6">
                <input
                    type="text"
                    placeholder="Buscar bandas por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 rounded-l-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 ease-in-out"
                >
                    Buscar
                </button>
            </div>
            {loading && <Loader />}
            {bands.length > 0 && (
                <ul className="space-y-4">
                    {bands.map((band) => (
                        <li key={band.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow">
                            <div>
                                <p className="text-lg font-semibold">{band.name}</p>
                                <p className="text-sm text-gray-600">Integrantes: {band.members.length}</p>
                            </div>
                            <button
                                onClick={() => handleJoin(band.id)}
                                disabled={joiningBandId === band.id}
                                className={`px-4 py-2 rounded-md text-white ${
                                    joiningBandId === band.id
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'
                                } focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 ease-in-out`}
                            >
                                {joiningBandId === band.id ? 'Uniéndose...' : 'Unirse'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {bands.length === 0 && searchTerm.length >=3 && !loading && (
                <p className="text-gray-600">No se encontraron bandas.</p>
            )}
        </div>
    );
};

export default BandSearch;
