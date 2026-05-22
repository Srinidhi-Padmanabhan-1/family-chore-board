import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/database';

export default function RewardStore() {
    const navigate = useNavigate();
    const [message, setMessage] = useState({ text: '', type: '' });

    // 1. Get logged-in child data
    const activeChildId = parseInt(sessionStorage.getItem('activeChildId'));
    const child = useLiveQuery(() => db.children.get(activeChildId), [activeChildId]);
    
    // 2. Get all available rewards from the database
    const rewards = useLiveQuery(() => db.rewards.toArray());

    if (!activeChildId) return <div className="p-10 text-center text-red-500">Error: No child logged in.</div>;
    if (!child || rewards === undefined) return <div className="p-10 text-center">Loading the store...</div>;

    // --- PURCHASE LOGIC ---
    const handleBuy = async (reward) => {
        setMessage({ text: '', type: '' }); // Clear old messages

        // A. Check if the kid has enough points
        if (child.points_balance < reward.cost) {
            setMessage({ 
                text: `Oops! You need ${reward.cost - child.points_balance} more points to buy "${reward.title}". Time to do some chores!`, 
                type: 'error' 
            });
            return;
        }

        // B. Subtract points from the Piggy Bank
        const newBalance = child.points_balance - reward.cost;
        await db.children.update(activeChildId, { points_balance: newBalance });

        // C. Record this action in the Audit Log
        await db.transactions_history.add({
            child_id: activeChildId,
            action_type: `BOUGHT: ${reward.title}`,
            points_change: -reward.cost, // Negative because points are being spent
            timestamp: new Date().toISOString()
        });

        // D. Show success message
        setMessage({ 
            text: `🎉 Yay! You bought "${reward.title}"! Enjoy your reward!`, 
            type: 'success' 
        });
    };

    return (
        <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center">
            
            {/* STORE HEADER */}
            <div className="w-full max-w-4xl flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 border-b-4 border-yellow-400">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/child-dashboard')} 
                        className="text-blue-500 font-bold hover:underline"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-2xl font-black text-gray-800">🎁 Reward Store</h1>
                </div>
                
                {/* Mini Piggy Bank Display */}
                <div className="bg-green-100 text-green-800 font-black px-4 py-2 rounded-lg border-2 border-green-300">
                    My Points: {child.points_balance}
                </div>
            </div>

            {/* ALERT MESSAGE (Shows success or not enough points) */}
            {message.text && (
                <div className={`w-full max-w-4xl p-4 rounded-xl mb-6 font-bold text-center shadow-sm animate-bounce ${message.type === 'error' ? 'bg-red-100 text-red-700 border-2 border-red-300' : 'bg-green-100 text-green-700 border-2 border-green-300'}`}>
                    {message.text}
                </div>
            )}

            {/* REWARDS GRID */}
            <div className="w-full max-w-4xl">
                {rewards.length === 0 ? (
                    <div className="bg-white p-10 rounded-xl shadow-sm text-center text-gray-500 font-bold text-xl">
                        The store is empty right now! Ask your parents to add some rewards.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rewards.map(reward => (
                            <div key={reward.id} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col justify-between border-t-8 border-yellow-300 hover:shadow-lg transition-all transform hover:-translate-y-1">
                                
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-black text-gray-800 mb-2">{reward.title}</h3>
                                    <div className="inline-block bg-yellow-100 text-yellow-800 font-bold py-1 px-3 rounded-full text-lg">
                                        💰 {reward.cost} pts
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => handleBuy(reward)}
                                    className={`w-full font-black py-3 px-4 rounded-xl shadow-sm transition-colors text-lg ${
                                        child.points_balance >= reward.cost 
                                        ? 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 cursor-pointer' 
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {child.points_balance >= reward.cost ? 'Buy Now!' : 'Need More Points'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}