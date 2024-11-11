// src/components/Dashboard/Reservations/WeeklyCalendar.tsx
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface WeeklyCalendarProps {
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
    blockedDates: Date[];
}

export default function WeeklyCalendar({ selectedDate, onSelectDate, blockedDates }: WeeklyCalendarProps) {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Lunes

    // Genera los días de lunes a viernes a partir del inicio de la semana
    const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    // Función para verificar si un día está bloqueado
    const isDayBlocked = (day: Date) => {
        const dayOfWeek = day.getDay();

        // Bloquear sábados (6) y domingos (0)
        if (dayOfWeek === 6 || dayOfWeek === 0) return true;

        // Si hoy es martes, bloquear el lunes (1)
        if (today.getDay() === 2 && dayOfWeek === 1) return true;

        // Si hoy es viernes, bloquear de lunes a jueves
        if (today.getDay() === 5 && dayOfWeek >= 1 && dayOfWeek <= 4) return true;

        // Bloquear fechas adicionales en `blockedDates`
        return blockedDates.some((blockedDay) => isSameDay(blockedDay, day));
    };

    return (
        <div className="w-full">
            <div className="flex justify-center mb-4">
                <motion.div
                    className="flex space-x-2 w-full max-w-4xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {days.map((day) => {
                        const isBlocked = isDayBlocked(day);
                        const isSelected = selectedDate && isSameDay(selectedDate, day);

                        return (
                            <motion.button
                                key={day.toDateString()}
                                onClick={() => !isBlocked && onSelectDate(day)}
                                disabled={isBlocked}
                                className={`relative flex flex-col items-center justify-center flex-1 p-4 rounded-lg shadow-md transition-colors duration-200 ${
                                    isBlocked
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : isSelected
                                            ? 'bg-rockRed text-white'
                                            : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                                whileHover={!isBlocked ? { scale: 1.05 } : {}}
                                whileTap={!isBlocked ? { scale: 0.95 } : {}}
                            >
                                <span className="text-lg font-semibold font-rock">
                                    {format(day, 'EEEE', { locale: es })} {/* Día en español */}
                                </span>
                                <span className="text-xl font-bold font-rock">
                                    {format(day, 'd', { locale: es })} {/* Día del mes */}
                                </span>

                                {/* Overlay para Días Bloqueados */}
                                {isBlocked && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                        <Lock className="text-gray-300 h-6 w-6" />
                                        <span className="ml-2 text-gray-300 font-rock">Bloqueado</span>
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}
