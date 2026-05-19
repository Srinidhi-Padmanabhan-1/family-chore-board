// src/Pages/parent/ParentDashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../../db/database';

export default function ParentDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chores'); // 'chores' or 'rewards'

    // Form states for Chores
    const [choreTitle, setChoreTitle] = useState('');
    const [choreDesc, setChoreDesc] = useState('');
    const [chorePoints, setChorePoints] = useState('');
    const [assignedChildId, setAssignedChildId] = useState('');

    // Form states for Rewards
    const [rewardTitle, setRewardTitle] = useState('');
    const [rewardCost, setRewardCost] = useState('');

    // Query data from Dexie (Auto-updates when data changes!)
    const children = useLiveQuery(() => db.children.toArray()) || [];
    const chores = useLiveQuery(() => db.chores.toArray()) || [];
    const rewards = useLiveQuery(() => db.rewards.toArray()) || [];

    // HANDLERS
    const handleAddChore = async (e) => {
        e.preventDefault();
        await db.chores.add({
            title: choreTitle,
            description: choreDesc,
            point_value: parseInt(chorePoints),
            status: 'PENDING',
            assigned_child_id: parseInt(assignedChildId)
        });
        setChoreTitle(''); setChoreDesc(''); setChorePoints(''); setAssignedChildId(''); // Reset form
    };

    const handleAddReward = async (e) => {
        e.preventDefault();
        await db.rewards.add({
            title: rewardTitle,
            cost: parseInt(rewardCost)
        });
        setRewardTitle(''); setRewardCost(''); // Reset form
    };

    const handleDeleteReward = async (id) => {
        await db.rewards.delete(id);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('activeParentId');
        navigate('/');
    };

    // Helper to get child name by ID for the table
    const getChildName = (id) => {
        const child = children.find(c => c.id === id);
        return child ? child.username : 'Unknown';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 border-b-4 border-blue-600">
                <h1 className="text-2xl font-bold text-gray-800">Parent Control Dashboard</h1>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/family-setup')} className="text-blue-600 font-semibold hover:underline border-r-2 pr-4">⚙️ Family Setup</button>
                    <button onClick={() => navigate('/audit-log')} className="text-blue-600 font-semibold hover:underline border-r-2 pr-4">📜 Audit Log</button>
                    <button onClick={handleLogout} className="text-red-500 font-semibold hover:underline">Log Out</button>
                </div>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('chores')}
                    className={`flex-1 py-3 font-bold rounded-lg ${activeTab === 'chores' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                >
                    📋 Chore Management
                </button>
                <button
                    onClick={() => setActiveTab('rewards')}
                    className={`flex-1 py-3 font-bold rounded-lg ${activeTab === 'rewards' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                >
                    🎁 Reward Management
                </button>
            </div>

            {/* TAB CONTENT: CHORES */}
            {activeTab === 'chores' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add Chore Form */}
                    <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Assign a Chore</h2>
                        {children.length === 0 ? (
                            <div className="text-red-500 bg-red-50 p-3 rounded">
                                You have no children registered. Go to <strong>Family Setup</strong> to add them first!
                            </div>
                        ) : (
                            <form onSubmit={handleAddChore} className="flex flex-col gap-3">
                                <input type="text" placeholder="Chore Title (e.g. Wash Dishes)" required value={choreTitle} onChange={e => setChoreTitle(e.target.value)} className="border p-2 rounded" />
                                <input type="text" placeholder="Description" required value={choreDesc} onChange={e => setChoreDesc(e.target.value)} className="border p-2 rounded" />
                                <input type="number" placeholder="Point Value (e.g. 50)" required min="1" value={chorePoints} onChange={e => setChorePoints(e.target.value)} className="border p-2 rounded" />
                                <select required value={assignedChildId} onChange={e => setAssignedChildId(e.target.value)} className="border p-2 rounded bg-white">
                                    <option value="" disabled>Select a Child...</option>
                                    {children.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
                                </select>
                                <button type="submit" className="bg-blue-600 text-white font-bold py-2 rounded mt-2 hover:bg-blue-700">Assign Task</button>
                            </form>
                        )}
                    </div>

                    {/* Data Table: Chore List */}
                    <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Current Chores</h2>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600">
                                    <th className="p-3 border-b">Task</th>
                                    <th className="p-3 border-b">Points</th>
                                    <th className="p-3 border-b">Assigned To</th>
                                    <th className="p-3 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chores.length === 0 && <tr><td colSpan="4" className="p-4 text-center text-gray-500">No chores assigned yet.</td></tr>}
                                {chores.map(chore => (
                                    <tr key={chore.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-semibold">{chore.title}</td>
                                        <td className="p-3 font-mono text-blue-600">+{chore.point_value}</td>
                                        <td className="p-3">{getChildName(chore.assigned_child_id)}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs rounded font-bold ${chore.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {chore.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: REWARDS */}
            {activeTab === 'rewards' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add Reward Form */}
                    <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Create a Reward</h2>
                        <form onSubmit={handleAddReward} className="flex flex-col gap-3">
                            <input type="text" placeholder="Reward Title (e.g. 1 Hour Video Games)" required value={rewardTitle} onChange={e => setRewardTitle(e.target.value)} className="border p-2 rounded" />
                            <input type="number" placeholder="Point Cost (e.g. 100)" required min="1" value={rewardCost} onChange={e => setRewardCost(e.target.value)} className="border p-2 rounded" />
                            <button type="submit" className="bg-green-600 text-white font-bold py-2 rounded mt-2 hover:bg-green-700">Add Reward</button>
                        </form>
                    </div>

                    {/* Grid: Reward List */}
                    <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Prize Counter (Storefront)</h2>
                        {rewards.length === 0 ? (
                            <div className="text-gray-500 p-4 text-center">No rewards added yet.</div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {rewards.map(reward => (
                                    <div key={reward.id} className="border p-4 rounded-lg flex justify-between items-center bg-gray-50 shadow-sm">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{reward.title}</h3>
                                            <span className="text-sm font-mono text-green-600">{reward.cost} pts</span>
                                        </div>
                                        <button onClick={() => handleDeleteReward(reward.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}