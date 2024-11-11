// src/components/bands/BandMembers.tsx

import { User } from '../../types';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import { useState } from 'react';

interface BandMembersProps {
    members: User[];
    bandId: string;
}

const BandMembers: React.FC<BandMembersProps> = ({ members, bandId }) => {
    const [currentMembers, setCurrentMembers] = useState<User[]>(members);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Por ahora, solo mostramos los miembros. Funcionalidades adicionales se pueden agregar posteriormente.

    return (
        <div>
            <div className="space-y-2">
                {currentMembers.map((member) => (
                    <div key={member.id} className="flex items-center">
                        <p className="text-sm">{member.username} ({member.ruf})</p>
                    </div>
                ))}
            </div>
            {loading && <Loader />}
            {error && <ErrorMessage message={error} />}
        </div>
    );
};

export default BandMembers;
