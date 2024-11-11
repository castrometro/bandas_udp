// src/components/bands/BandDetails.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Band } from '../../types';
import axiosInstance from '../../api/axios';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import BandMembers from './BandMembers';

interface BandDetailsProps {
    band: Band;
}

const BandDetails: React.FC<BandDetailsProps> = ({ band }) => {
    const [bandData, setBandData] = useState<Band>(band);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const refreshBand = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/application/bands/${bandData.id}/`);
            setBandData(response.data);
        } catch (err: any) {
            setError('Error al actualizar los detalles de la banda.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // //todo: Implementar lógica para actualizar detalles de la banda si es necesario
    }, []);

    if (loading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="bg-white shadow rounded-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">{bandData.name}</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => navigate(`/bands/${bandData.id}/edit`)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200 ease-in-out"
                    >
                        Editar Banda
                    </button>
                    <button
                        onClick={() => navigate('/bands')}
                        className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 ease-in-out"
                    >
                        Volver
                    </button>
                </div>
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Integrantes Permanentes</h3>
                <BandMembers members={bandData.members} bandId={bandData.id} />
            </div>
            {/* //todo: Agregar más secciones como Reservas relacionadas con la banda */}
        </div>
    );
};

export default BandDetails;
