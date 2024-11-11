import { Guitar } from 'lucide-react';

export default function DashboardHeader() {
    return (
        <header className="flex items-center justify-between py-4 bg-gray-800">
            <div className="flex items-center">
                <Guitar className="h-8 w-8 text-rockRed mr-2" />
                <h1 className="text-3xl font-bold text-white font-rock">Rock Dashboard</h1>
            </div>
        </header>
    );
}
