// src/components/Dashboard/BandInfo.tsx
import { Users } from 'lucide-react';
import { Band } from '../../types';

interface BandInfoProps {
    band: Band;
}

export default function BandInfo({ band }: BandInfoProps) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-rockYellow">
                <Users className="mr-2 h-6 w-6" />
                Tu Banda Actual
            </h2>
            <div className="space-y-2 text-white">
                <p><strong className="text-rockYellow">Nombre:</strong> {band.name}</p>
                <p><strong className="text-rockYellow">Miembros:</strong> {band.members.length}</p>
                <p><strong className="text-rockYellow">Aprobada:</strong> {band.is_approved ? 'Sí' : 'No'}</p>
            </div>
        </div>
    );
}
