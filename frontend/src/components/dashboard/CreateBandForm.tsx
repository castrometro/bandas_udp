import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {getCSRFToken} from "../../../utils/csrf.tsx";

interface CreateBandFormProps {
    onBandCreated: () => void;
}

export default function CreateBandForm({ onBandCreated }: CreateBandFormProps) {
    const { checkAuth } = useAuth();

    const [bandName, setBandName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateBand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bandName.trim()) {
            toast.error('El nombre de la banda es obligatorio.');
            return;
        }

        setIsSubmitting(true);

        try {
            await axiosInstance.post('/api/application/bands/', {
                name: bandName,
                members: [],
            }, {
                headers: {
                    'X-CSRFToken': getCSRFToken(),
                },
            });

            toast.success('Banda creada exitosamente!');
            setBandName('');
            onBandCreated();
            await checkAuth(); // Actualiza el estado del usuario
        } catch (error: any) {
            console.error('Error al crear la banda:', error);
            if (error.response && error.response.data && error.response.data.detail) {
                toast.error(`Error: ${error.response.data.detail}`);
            } else {
                toast.error('Ocurrió un error al crear la banda.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleCreateBand} className="space-y-4">
            <div>
                <label htmlFor="bandName" className="sr-only">
                    Nombre de la Banda
                </label>
                <input
                    id="bandName"
                    name="bandName"
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-rockRed text-white"
                    placeholder="Nombre de la Banda"
                    value={bandName}
                    onChange={(e) => setBandName(e.target.value)}
                />
            </div>
            <div className="flex space-x-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-rockRed hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition duration-200 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                            Creando...
                        </>
                    ) : (
                        'Crear Banda'
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        onBandCreated(); // Para cancelar la creación
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}
