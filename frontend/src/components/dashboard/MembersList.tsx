// src/components/Dashboard/MembersList.tsx
import { useEffect, useState } from 'react';
import { BandMember } from '../../types';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import { Trash2, UserPlus } from 'lucide-react';
import {getCSRFToken} from "../../../utils/csrf.tsx";

interface MembersListProps {
    bandId: string;
    refreshMembers: () => void;
}

export default function MembersList({ bandId, refreshMembers }: MembersListProps) {
    const [members, setMembers] = useState<BandMember[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    console.log(members)

    useEffect(() => {
        fetchMembers();
    }, [bandId]);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/api/application/band-members/?band=${bandId}`);
            setMembers(response.data);
        } catch (error: any) {
            console.error('Error al obtener los miembros:', error);
            toast.error('Error al obtener los miembros de la banda.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar a este miembro?')) return;

        try {
            await axiosInstance.delete(`/api/application/band-members/${memberId}/`, {
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                },
            });
            toast.success('Miembro eliminado exitosamente.');
            refreshMembers();
        } catch (error: any) {
            console.error('Error al eliminar al miembro:', error);
            toast.error('Error al eliminar al miembro.');
        }
    };

    return (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 flex items-center text-rockYellow font-rock">
                <UserPlus className="mr-2 h-6 w-6" />
                Miembros de la Banda
            </h3>
            {isLoading ? (
                <p className="text-white">Cargando miembros...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-700 rounded-lg">
                        <thead>
                        <tr>
                            <th className="py-2 px-4 text-left text-white">Nombre</th>
                            <th className="py-2 px-4 text-left text-white">Correo</th>
                            <th className="py-2 px-4 text-left text-white">RUT</th>
                            <th className="py-2 px-4 text-left text-white">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {members.map((member) => (
                            <tr key={member.id} className="border-t border-gray-600">
                                <td className="py-2 px-4 text-white">{member.user.username}</td>
                                <td className="py-2 px-4 text-white">{member.user.email}</td>
                                <td className="py-2 px-4 text-white">{member.user.ruf}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="flex items-center bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition duration-200"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {members.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-4 text-center text-white">
                                    No hay miembros en la banda.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
