import { Reservation } from '../../types';
import { Link } from 'react-router-dom';

interface ReservationItemProps {
    reservation: Reservation;
}

const ReservationItem: React.FC<ReservationItemProps> = ({ reservation }) => {
    return (
        <div className="border rounded-lg p-3 flex justify-between items-center">
            <div>
                <h4 className="text-md font-semibold">{reservation.band.name}</h4>
                <p className="text-sm text-gray-600">{new Date(reservation.start_time).toLocaleString()} - {new Date(reservation.end_time).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Sala: {reservation.room.name}</p>
            </div>
            <Link to={`/reservations/${reservation.id}`} className="text-indigo-600 hover:text-indigo-800">
                Detalles
            </Link>
        </div>
    );
};

export default ReservationItem;
