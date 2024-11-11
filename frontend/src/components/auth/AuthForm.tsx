// src/components/AuthForm.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import { Guitar } from 'lucide-react';

export default function AuthForm() {
    const [isRegistering, setIsRegistering] = useState(false);

    const toggleForm = () => {
        setIsRegistering((prev) => !prev);
    };

    const handleRegistrationSuccess = () => {
        setIsRegistering(false); // Cambia a LoginForm después del registro
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-rockBlack to-rockRed relative">
            <div
                className="max-w-md w-full p-8 bg-rockBlack bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl relative z-10">
                <motion.div
                    className="absolute -top-28 left-1/2 -ml-6 transform -translate-x-1/2"
                    animate={{rotate: 360}}
                    transition={{repeat: Infinity, duration: 20, ease: "linear"}}
                >
                    <Guitar className="text-rockRed h-20 w-20"/>
                </motion.div>
                <AnimatePresence mode="wait">
                    {isRegistering ? (
                        <motion.div
                            key="register"
                            initial={{opacity: 0, x: 50}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: -50}}
                            transition={{duration: 0.5}}
                        >
                            <RegisterForm onSuccess={handleRegistrationSuccess}/>
                            <div className="text-center mt-4">
                                <p className="text-sm text-gray-300">
                                    ¿Ya tienes una cuenta?{' '}
                                    <button
                                        onClick={toggleForm}
                                        className="font-medium text-rockYellow hover:text-rockRed"
                                    >
                                        Inicia sesión
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="login"
                            initial={{opacity: 0, x: -50}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: 50}}
                            transition={{duration: 0.5}}
                        >
                            <LoginForm/>
                            <div className="text-center mt-4">
                                <p className="text-sm text-gray-300">
                                    ¿No tienes una cuenta?{' '}
                                    <button
                                        onClick={toggleForm}
                                        className="font-medium text-rockYellow hover:text-rockRed"
                                    >
                                        Regístrate
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
