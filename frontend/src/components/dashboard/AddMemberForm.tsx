// src/components/Dashboard/AddMemberForm.tsx
import { useState } from 'react';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';
import { Search, UserPlus } from 'lucide-react';
import { User } from '../../types';
import {getCSRFToken} from "../../../utils/csrf.tsx";

interface AddMemberFormProps {
    bandId: string;
    refreshMembers: () => void;
}

export default function AddMemberForm({ bandId, refreshMembers }: AddMemberFormProps) {
    const [rut, setRut] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);

    const handleSearch = async () => {
        if (!rut.trim()) {
            toast.error('Por favor, ingresa un RUT para buscar.');
            return;
        }

        setIsSearching(true);
        setUser(null);

        try {
            const response = await axiosInstance.get(`/api/application/users/?ruf=${rut}`, {
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                },
            });
            const foundUsers: User[] = response.data;

            if (foundUsers.length === 0) {
                toast.error('No se encontró ningún usuario con ese RUT.');
            } else if (foundUsers.length > 1) {
                toast.error('Se encontraron múltiples usuarios con ese RUT. Por favor, verifica.');
            } else {
                const foundUser = foundUsers[0];
                if (foundUser.current_band) {
                    toast.error('Este usuario ya pertenece a una banda.');
                } else {
                    setUser(foundUser);
                }
            }
        } catch (error: any) {
            console.error('Error al buscar el usuario:', error);
            toast.error('Error al buscar el usuario.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddMember = async () => {
        if (!user) return;

        setIsAdding(true);
        try {
            await axiosInstance.post(
                '/api/application/band-members/',
                {
                    band: bandId,
                    user: user.id,
                },
                {
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                    },
                }
            );
            toast.success('Miembro agregado exitosamente.');
            setRut('');
            setUser(null);
            refreshMembers();
        } catch (error: any) {
            console.error('Error al agregar el miembro:', error);
            if (error.response && error.response.data && error.response.data.detail) {
                toast.error(`Error: ${error.response.data.detail}`);
            } else {
                toast.error('Ocurrió un error al agregar el miembro.');
            }
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 flex items-center text-rockYellow font-rock">
                <UserPlus className="mr-2 h-6 w-6" />
                Agregar Miembro
            </h3>
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    placeholder="Ingresa RUT del miembro"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-rockRed transition duration-200"
                />
                <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="flex items-center bg-rockRed hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50"
                >
                    {isSearching ? (
                        <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                        </svg>
                    ) : (
                        <Search className="h-5 w-5 mr-2" />
                    )}
                    Buscar
                </button>
            </div>
            {user && (
                <div className="mt-4 bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-white"><strong>Nombre:</strong> {user.username}</p>
                        <p className="text-white"><strong>Correo:</strong> {user.email}</p>
                        <p className="text-white"><strong>RUT:</strong> {user.ruf}</p>
                    </div>
                    <button
                        onClick={handleAddMember}
                        disabled={isAdding}
                        className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                        {isAdding ? (
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                ></path>
                            </svg>
                        ) : (
                            <UserPlus className="h-5 w-5 mr-2" />
                        )}
                        {isAdding ? 'Agregando...' : 'Agregar'}
                    </button>
                </div>
            )}
        </div>
    );
}
