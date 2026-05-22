import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/database';

export default function ChildDashboard() {
    const navigate = useNavigate();

    // 1. Get the logged-in child's ID
    const activeChildId = parseInt(sessionStorage.getItem('activeChildId'));

    // 2. Query the database for the Child's data (Piggy Bank)
    const child = useLiveQuery(() => db.children.get(activeChildId), [activeChildId]);

    // 3. Query the database for this specific child's PENDING chores
    const pendingChores = useLiveQuery(async () => {
        if (!activeChildId) return [];
        const allChildChores = await db.chores.where({ assigned_child_id: activeChildId }).toArray();
        return allChildChores.filter(chore => chore.status === 'PENDING');
    }, [activeChildId]);

    // If no child is logged in, show an error
    if (!activeChildId) {
        return <div className="p-10 text-center text-red-500">Error: No child logged in. Please go back to Home.</div>;
    }

    // Show loading while Dexie fetches data
    if (!child || pendingChores === undefined) return <div className="p-10 text-center">Loading your piggy bank...</div>;

    // --- ACTION LOGIC ---
    const handleMarkDone = async (chore) => {
        // A. Update the chore status to COMPLETED
        await db.chores.update(chore.id, { status: 'COMPLETED' });

        // B. Add points to the child's Piggy Bank
        const newBalance = child.points_balance + chore.point_value;
        await db.children.update(activeChildId, { points_balance: newBalance });

        // C. Record this action in the Audit Log
        await db.transactions_history.add({
            child_id: activeChildId,
            action_type: 'CHORE_DONE',
            points_change: chore.point_value,
            timestamp: new Date().toISOString()
        });
    };

    const handleLogout = () => {
        sessionStorage.removeItem('activeChildId');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center">
            
            {/* HEADER / PIGGY BANK */}
            <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md border-b-8 border-blue-500 text-center mb-8 relative">
                <button 
                    onClick={handleLogout} 
                    className="absolute top-4 right-4 text-sm text-gray-400 hover:text-red-500 font-bold"
                >
                    Log Out
                </button>
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Welcome, {child.username}!</h1>
                <p className="text-gray-500 mb-4">Here is your Piggy Bank Balance:</p>
                
                <div className="text-6xl font-black text-green-500 drop-shadow-sm mb-4">
                    {child.points_balance} <span className="text-2xl text-green-400">pts</span>
                </div>

                <button 
                    onClick={() => navigate('/reward-store')}
                    className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 px-8 rounded-full shadow-md text-lg transition-transform transform hover:scale-105"
                >
                    🎁 Go to Reward Store
                </button>
            </div>

            {/* CHORE LIST */}
            <div className="w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Your To-Do List</h2>
                
                {pendingChores.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
                        🎉 Woohoo! You have no chores right now. Time to relax!
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {pendingChores.map(chore => (
                            <div key={chore.id} className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center border-l-8 border-blue-400 hover:shadow-md transition-shadow">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{chore.title}</h3>
                                    <p className="text-gray-500 text-sm">{chore.description}</p>
                                    <span className="inline-block mt-2 bg-blue-100 text-blue-700 font-bold py-1 px-3 rounded-full text-sm">
                                        Earn {chore.point_value} pts
                                    </span>
                                </div>
                                
                                <button 
                                    onClick={() => handleMarkDone(chore)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-sm transition-colors text-lg"
                                >
                                    Mark Done! ✔️
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}