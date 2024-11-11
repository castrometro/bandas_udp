import { User } from '../../../types';
import axiosInstance from '../../../api/axios';
import { X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../common/Loader';
import ErrorMessage from '../../common/ErrorMessage';
import {useState} from "react";

interface MemberItemProps {
    member: User;
    bandId: string;
    onRemove?: (userId: string) => void;
}

const MemberItem: React.FC<MemberItemProps> = ({ member, bandId, onRemove }) => {
    const { state } = useAuth();
    const [removing, setRemoving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleRemove = async () => {
        setRemoving(true);
        setError(null);
        try {
            // Obtener el BandMember ID asociado
            const response = await axiosInstance.get(`/api/application/band-members/?band=${bandId}&user=${member.id}`);
            const bandMember = response.data[0]; // Asumiendo que existe un único bandMember
            if (bandMember) {
                await axiosInstance.delete(`/api/application/band-members/${bandMember.id}/`);
                if (onRemove) {
                    onRemove(member.id);
                }
            }
        } catch (err: any) {
            setError('Error al remover el miembro.');
        } finally {
            setRemoving(false);
        }
    };

    return (
        <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-md">
            <span className="text-sm">{member.name} ({member.rut})</span>
            <button
                onClick={handleRemove}
                disabled={removing}
                className={`text-red-500 hover:text-red-700 ${removing ? 'cursor-not-allowed' : ''}`}
            >
                {removing ? <Loader size="small" /> : <X className="h-4 w-4" />}
            </button>
            {error && <ErrorMessage message={error} />}
        </div>
    );
};

export default MemberItem;
