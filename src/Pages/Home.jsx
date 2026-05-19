import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import db from '../db/database';

export default function Home() {
    const navigate = useNavigate();

    // Queries the database to see if any parents have been registered yet
    const parentCount = useLiveQuery(() => db.parents.count());

    // Show a loading state while Dexie checks the local database
    if (parentCount === undefined) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">

            {/* App Header */}
            <div className="text-center mb-10">
                <h1 className="text-5xl font-extrabold text-blue-600 mb-4 drop-shadow-sm">
                    Family Chore Board
                </h1>
                <p className="text-lg text-gray-600">
                    Complete chores, earn points, get rewards!
                </p>
            </div>

            {/* Dynamic Buttons Based on Database State */}
            <div className="flex flex-col gap-4 w-full max-w-sm">

                {/* FIRST TIME SETUP: If 0 parents exist in the database */}
                {parentCount === 0 ? (
                    <div className="bg-white p-6 rounded-xl shadow-md text-center border-2 border-yellow-400">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">First Time Setup</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Welcome! To get started, you must register the main Parent Admin account.
                        </p>
                        <button
                            onClick={() => navigate('/parent-register')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
                        >
                            Register Parent Account
                        </button>
                    </div>
                ) : (

                    /* NORMAL MODE: If parents exist, show regular logins */
                    <>
                        <button
                            onClick={() => navigate('/parent-login')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-all text-xl"
                        >
                            Parent Login
                        </button>

                        <button
                            onClick={() => navigate('/child-login')}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-all text-xl mt-2"
                        >
                            Child Login
                        </button>
                    </>
                )}
            </div>

        </div>
    );
}