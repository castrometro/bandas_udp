// src/components/Dashboard/Loader.tsx

import { motion } from 'framer-motion';
import { Guitar } from 'lucide-react';

export default function Loader() {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="mb-4"
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "easeInOut",
                    }}
                >
                    <Guitar className="text-rockRed h-24 w-24" />
                </motion.div>
                <motion.div
                    className="flex space-x-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                >
                    {['C', 'A', 'R', 'G', 'A', 'N', 'D', 'O'].map((letter, index) => (
                        <motion.span
                            key={index}
                            className="text-white text-2xl font-rock"
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            {letter}
                        </motion.span>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
