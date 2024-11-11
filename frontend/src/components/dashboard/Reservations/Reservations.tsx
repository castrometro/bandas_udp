import { useState, useEffect } from 'react';
import WeeklyCalendar from './WeeklyCalendar';
import TimeSlots from './TimeSlots';
import { motion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';

export default function Reservations() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [blockedDates, setBlockedDates] = useState<Date[]>([]);

    useEffect(() => {
        // Bloquear los días anteriores a hoy
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes

        const dates: Date[] = [];
        for (let i = 0; i < 5; i++) { // Lunes a Viernes
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            if (date < today) {
                dates.push(date);
            }
        }
        setBlockedDates(dates);
    }, []);

    return (
        <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 flex items-center text-rockYellow font-rock">
                <CalendarCheck className="mr-2 h-6 w-6" />
                Reservas
            </h3>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <WeeklyCalendar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    blockedDates={blockedDates}
                />
                {selectedDate && (
                    <TimeSlots selectedDate={selectedDate} />
                )}
            </motion.div>
        </div>
    );
}
