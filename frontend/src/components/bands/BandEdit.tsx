// src/components/bands/BandEdit.tsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { Band } from '../../types';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import AddMemberModal from './components/AddMemberModal';
import MemberItem from './components/MemberItem';

const BandEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [band, setBand] = useState<Band | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchBand = async () => {
            try {
                const response = await axiosInstance.get(`/api/application/bands/${id}/`);
                setBand(response.data);
            } catch (err: any) {
                setError('Error al cargar los detalles de la banda.');
            } finally {
                setLoading(false);
            }
        };

        fetchBand();
    }, [id]);

    const handleAddMember = async (userId: string) => {
        try {
            await axiosInstance.post('/api/application/band-members/', {
                band: band?.id,
                user: userId,
            });
            // Refrescar la banda
            const response = await axiosInstance.get(`/api/application/bands/${id}/`);
            setBand(response.data);
        } catch (err: any) {
            setError('Error al agregar el miembro.');
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        try {
            await axiosInstance.delete(`/api/application/band-members/${memberId}/`);
            // Refrescar la banda
            const response = await axiosInstance.get(`/api/application/bands/${id}/`);
            setBand(response.data);
        } catch (err: any) {
            setError('Error al remover el miembro.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (band?.name.trim() === '') {
            setError('El nombre de la banda es obligatorio.');
            return;
        }

        try {
            await axiosInstance.put(`/api/application/bands/${id}/`, {
                name: band.name,
                members: band.members.map((m) => m.id),
            });
            navigate(`/bands/${id}`);
        } catch (err: any) {
            setError('Error al actualizar la banda.');
        }
    };

    if (loading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;
    if (!band) return <p>Banda no encontrada.</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Editar Banda</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Actualiza la información de la banda y gestiona sus integrantes.
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
                        value={band.name}
                        onChange={(e) => setBand({ ...band, name: e.target.value })}
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Integrantes Permanentes</h3>
                    <div className="mt-2 space-y-2">
                        {band.members.map((member) => (
                            <MemberItem key={member.id} member={member} onRemove={handleRemoveMember} />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Agregar Integrante
                    </button>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate(`/bands/${id}`)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>

            {isModalOpen && (
                <AddMemberModal
                    onClose={() => setIsModalOpen(false)}
                    onAdd={handleAddMember}
                />
            )}
        </div>
    );
};

export default BandEdit;
