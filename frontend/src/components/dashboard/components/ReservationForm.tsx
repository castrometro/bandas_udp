// src/components/dashboard/ReservationForm.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Room, User } from '../../../types';
import axiosInstance from "../../../api/axios.tsx";
import Loader from "../../common/Loader.tsx";
import ErrorMessage from "../../common/ErrorMessage.tsx";
import { Search, X } from 'lucide-react';

const ReservationForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        room: '',
        start_time: '',
        end_time: '',
        guests: [] as User[],
    });
    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axiosInstance.get('/api/collection/rooms/',
                    {

                    });
                setRooms(response.data);
            } catch (err: any) {
                setError('Error al cargar las salas disponibles.');
            }
        };

        fetchRooms();
    }, []);

    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        if (term.length < 3) {
            setSearchResults([]);
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/application/users/search?term=${encodeURIComponent(term)}`);
            setSearchResults(response.data);
        } catch (err: any) {
            setError('Error al buscar usuarios.');
        } finally {
            setLoading(false);
        }
    };

    const addGuest = (user: User) => {
        if (!formData.guests.find((g) => g.id === user.id)) {
            setFormData({
                ...formData,
                guests: [...formData.guests, user],
            });
        }
        setSearchTerm('');
        setSearchResults([]);
    };

    const removeGuest = (userId: string) => {
        setFormData({
            ...formData,
            guests: formData.guests.filter((g) => g.id !== userId),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.room || !formData.start_time || !formData.end_time) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        if (new Date(formData.start_time) >= new Date(formData.end_time)) {
            setError('La hora de inicio debe ser anterior a la hora de fin.');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post('/api/application/reservations/', {
                room: formData.room,
                start_time: formData.start_time,
                end_time: formData.end_time,
                guests: formData.guests.map((g) => g.id),
            });

            if (response.status === 201) {
                navigate('/dashboard');
            } else {
                setError('Error al crear la reserva.');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Error al crear la reserva.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Crear Reserva</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Completa la información a continuación para crear una nueva reserva.
                    </p>
                </div>

                {error && <ErrorMessage message={error} />}

                <div>
                    <label htmlFor="room" className="block text-sm font-medium text-gray-700">
                        Sala
                    </label>
                    <select
                        id="room"
                        name="room"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={formData.room}
                        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    >
                        <option value="">Seleccionar Sala</option>
                        {rooms.map((room) => (
                            <option key={room.id} value={room.id}>
                                {room.name} (Capacidad: {room.capacity})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Horario</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start_time" className="sr-only">
                                Hora de Inicio
                            </label>
                            <input
                                type="datetime-local"
                                name="start_time"
                                id="start_time"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={formData.start_time}
                                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="end_time" className="sr-only">
                                Hora de Fin
                            </label>
                            <input
                                type="datetime-local"
                                name="end_time"
                                id="end_time"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={formData.end_time}
                                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Invitados</label>
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
                                    onClick={() => addGuest(user)}
                                >
                                    <div className="flex items-center">
                    <span className="font-normal block truncate">
                      {user.username} ({user.ruf})
                    </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-2 space-y-2">
                    {formData.guests.map((guest) => (
                        <div
                            key={guest.id}
                            className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                        >
              <span className="text-sm">
                {guest.username} ({guest.ruf})
              </span>
                            <button
                                type="button"
                                onClick={() => removeGuest(guest.id)}
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
                        onClick={() => navigate('/dashboard')}
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
                        {loading ? 'Creando...' : 'Crear Reserva'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReservationForm;
