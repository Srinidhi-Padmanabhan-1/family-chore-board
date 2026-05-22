import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/database';

export default function AuditLog() {
    const navigate = useNavigate();

    // Ensure a parent is actually logged in
    const activeParentId = sessionStorage.getItem('activeParentId');

    // 1. Get all transactions and sort them by newest first
    const transactions = useLiveQuery(async () => {
        const history = await db.transactions_history.toArray();
        // Sort by timestamp descending (newest at the top)
        return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });

    // 2. Get all children so we can match their ID to their real name
    const children = useLiveQuery(() => db.children.toArray()) || [];

    // Helper function to find a child's name
    const getChildName = (childId) => {
        const child = children.find(c => c.id === childId);
        return child ? child.username : 'Unknown Child';
    };

    // Helper function to format the ugly ISO timestamp into a readable date/time
    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    };

    if (!activeParentId) return <div className="p-10 text-center text-red-500">Error: Parent not logged in.</div>;
    if (transactions === undefined) return <div className="p-10 text-center">Loading audit log...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            
            {/* HEADER */}
            <div className="w-full max-w-4xl flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 border-b-4 border-gray-800">
                <h1 className="text-2xl font-bold text-gray-800">📜 Activity Audit Log</h1>
                <button 
                    onClick={() => navigate('/parent-dashboard')} 
                    className="text-blue-600 font-semibold hover:underline"
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* LEDGER / TABLE */}
            <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>

                {transactions.length === 0 ? (
                    <div className="text-center text-gray-500 p-8 border-2 border-dashed border-gray-200 rounded-lg">
                        No activity yet. Assign some chores and tell the kids to get to work!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                                    <th className="p-4 border-b rounded-tl-lg">Date & Time</th>
                                    <th className="p-4 border-b">Child Name</th>
                                    <th className="p-4 border-b">Action</th>
                                    <th className="p-4 border-b text-right rounded-tr-lg">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map(tx => (
                                    <tr key={tx.id} className="border-b hover:bg-gray-50 transition-colors">
                                        
                                        {/* Timestamp */}
                                        <td className="p-4 text-sm text-gray-500">
                                            {formatTime(tx.timestamp)}
                                        </td>
                                        
                                        {/* Child Name */}
                                        <td className="p-4 font-bold text-gray-700">
                                            {getChildName(tx.child_id)}
                                        </td>
                                        
                                        {/* Action Type */}
                                        <td className="p-4 text-gray-800 font-medium">
                                            {tx.action_type}
                                        </td>
                                        
                                        {/* Points Change (Color Coded Math) */}
                                        <td className="p-4 text-right font-black text-lg">
                                            {tx.points_change > 0 ? (
                                                <span className="text-green-500">+{tx.points_change}</span>
                                            ) : (
                                                <span className="text-red-500">{tx.points_change}</span>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
}