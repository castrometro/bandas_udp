// src/components/dashboard/ReservationsList.tsx

import { Reservation } from '../../types';
import { Link } from 'react-router-dom';

interface ReservationsListProps {
    reservations: Reservation[];
}

const ReservationsList: React.FC<ReservationsListProps> = ({ reservations }) => {
    return (
        <div className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Reservas Recientes</h3>
                <Link to="/reservations/create" className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700">
                    Nueva Reserva
                </Link>
            </div>
            {reservations.length === 0 ? (
                <p>No hay reservas realizadas.</p>
            ) : (
                <div className="space-y-2">
                    {reservations.map((reservation) => (
                        <div key={reservation.id} className="border rounded-lg p-3 flex justify-between items-center">
                            <div>
                                <h4 className="text-md font-semibold">{reservation.band.name}</h4>
                                <p className="text-sm text-gray-600">
                                    {new Date(reservation.start_time).toLocaleString()} - {new Date(reservation.end_time).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600">Sala: {reservation.room.name}</p>
                            </div>
                            <Link to={`/reservations/${reservation.id}`} className="text-indigo-600 hover:text-indigo-800">
                                Detalles
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReservationsList;
