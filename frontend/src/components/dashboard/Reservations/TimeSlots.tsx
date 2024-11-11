// src/components/Dashboard/Reservations/TimeSlots.tsx
import { useState, useEffect } from 'react';
import { format, setHours, setMinutes, isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { toast } from 'react-toastify';
import {getCSRFToken} from "../../../../utils/csrf.tsx";
import axiosInstance from "../../../api/axios.tsx";

interface TimeSlotsProps {
    selectedDate: Date;
}

interface TimeSlot {
    time: string; // "08:00", "09:00", etc.
    isAvailable: boolean;
}

export default function TimeSlots({ selectedDate }: TimeSlotsProps) {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        generateTimeSlots();
    }, [selectedDate]);

    const generateTimeSlots = () => {
        const slots: TimeSlot[] = [];
        for (let hour = 8; hour <= 22; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            slots.push({ time, isAvailable: true }); // Inicialmente, todos están disponibles
        }

        // Bloquear las horas que ya han pasado si es el día actual
        const now = new Date();
        if (isSameDay(selectedDate, now)) {
            setTimeSlots(
                slots.map((slot) => {
                    const [h, m] = slot.time.split(':').map(Number);
                    const slotDate = setMinutes(setHours(selectedDate, h), m);
                    if (isBefore(slotDate, now)) {
                        return { ...slot, isAvailable: false };
                    }
                    return slot;
                })
            );
        } else {
            setTimeSlots(slots);
        }
    };

    const isSameDay = (d1: Date, d2: Date) => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    const handleReserve = async (time: string) => {
        setIsLoading(true);
        try {
            await axiosInstance.post(
                '/api/application/reservations/',
                {
                    band: 'current_band_id', // Reemplaza con el ID de la banda actual
                    room: 'room_id', // Reemplaza con el ID de la sala
                    start_time: `${format(selectedDate, 'yyyy-MM-dd')}T${time}:00Z`,
                    end_time: `${format(selectedDate, 'yyyy-MM-dd')}T${parseInt(time.split(':')[0]) + 1}:00Z`,
                },
                {
                    headers: {
                        'X-CSRFToken': getCSRFToken(),
                    },
                }
            );
            toast.success('Reserva realizada exitosamente!');
            // Actualizar los slots para reflejar la reserva
            setTimeSlots((prev) =>
                prev.map((slot) =>
                    slot.time === time ? { ...slot, isAvailable: false } : slot
                )
            );
        } catch (error: any) {
            console.error('Error al realizar la reserva:', error);
            toast.error('Error al realizar la reserva.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <h4 className="text-xl font-semibold text-rockYellow mb-4">
                Horarios Disponibles
            </h4>
            {isLoading && (
                <p className="text-white">Procesando reserva...</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {timeSlots.map((slot) => (
                    <motion.button
                        key={slot.time}
                        onClick={() => slot.isAvailable && handleReserve(slot.time)}
                        disabled={!slot.isAvailable || isLoading}
                        className={`flex items-center justify-center p-2 rounded-lg shadow-md transition-colors duration-200 ${
                            slot.isAvailable
                                ? 'bg-gray-700 hover:bg-rockRed text-white'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                        whileHover={slot.isAvailable ? { scale: 1.05 } : {}}
                        whileTap={slot.isAvailable ? { scale: 0.95 } : {}}
                    >
                        {slot.isAvailable ? <Check className="h-5 w-5 mr-1" /> : <X className="h-5 w-5 mr-1" />}
                        <span>{slot.time}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
