
import { useState } from 'react';
import { User } from '../../../types';
import axiosInstance from '../../../api/axios';
import Loader from '../../common/Loader';
import ErrorMessage from '../../common/ErrorMessage';
import { X } from 'lucide-react';

interface AddMemberModalProps {
    bandId: string;
    onClose: () => void;
    onAdd?: (userId: string) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ bandId, onClose, onAdd }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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

    const handleAdd = async (userId: string) => {
        try {
            await axiosInstance.post('/api/application/band-members/', {
                band: bandId,
                user: userId,
            });
            if (onAdd) {
                onAdd(userId);
            }
            onClose();
        } catch (err: any) {
            setError('Error al agregar el miembro.');
        }
    };

    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-5 w-5" />
                </button>
                <h3 className="text-xl font-semibold mb-4">Agregar Integrante</h3>
                {error && <ErrorMessage message={error} />}
                <div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Buscar por nombre o RUT"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
                {loading && <Loader />}
                {searchResults.length > 0 && (
                    <ul className="mt-2 max-h-60 overflow-auto">
                        {searchResults.map((user) => (
                            <li
                                key={user.id}
                                className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleAdd(user.id)}
                            >
                                <span>{user.name} ({user.rut})</span>
                                <button className="text-indigo-600 hover:text-indigo-800">Agregar</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AddMemberModal;
