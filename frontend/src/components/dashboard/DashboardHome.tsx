// src/components/Dashboard/DashboardHome.tsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import BandInfo from './BandInfo';
import CreateBandForm from './CreateBandForm';
import DashboardLayout from './DashboardLayout.tsx';
import { Users } from 'lucide-react';
import MembersList from './MembersList';
import AddMemberForm from './AddMemberForm';
import Reservations from './Reservations/Reservations';

export default function DashboardHome() {
    const { state, checkAuth } = useAuth();
    const { user } = state;

    const [isCreatingBand, setIsCreatingBand] = useState(false);

    const refreshMembers = () => {
        checkAuth()
    };

    return (
        <DashboardLayout>
            {!user?.current_band ? (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800 p-6 rounded-lg shadow-lg"
                >
                    <h2 className="text-2xl font-semibold mb-4 flex items-center text-rockYellow font-rock">
                        <Users className="mr-2 h-6 w-6" />
                        Únete a una Banda
                    </h2>
                    <p className="mb-6 text-white">
                        No perteneces a ninguna banda actualmente. Puedes crear una nueva banda para empezar a rockear.
                    </p>
                    {!isCreatingBand ? (
                        <button
                            onClick={() => setIsCreatingBand(true)}
                            className="w-full bg-rockRed hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center transition duration-200"
                        >
                            Crear Banda
                        </button>
                    ) : (
                        <CreateBandForm onBandCreated={() => setIsCreatingBand(false)} />
                    )}
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <BandInfo band={user.current_band} />
                    <AddMemberForm bandId={user.current_band.id.toString()} refreshMembers={refreshMembers} />
                    <MembersList bandId={user.current_band.id.toString()} refreshMembers={refreshMembers} />
                    <Reservations />
                </motion.div>
            )}
        </DashboardLayout>
    );
}
