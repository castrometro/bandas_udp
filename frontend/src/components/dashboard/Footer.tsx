// src/components/Dashboard/Footer.tsx
export default function Footer() {
    return (
        <footer className="bg-gray-800 text-center py-4 ">
            <span className="text-white">
                &copy; {new Date().getFullYear()} Bandas UDP. Todos los derechos reservados.
            </span>
        </footer>
    );
}
