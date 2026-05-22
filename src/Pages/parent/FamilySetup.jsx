import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerChild } from '../../db/authService';

export default function FamilySetup() {
    const [childUsername, setChildUsername] = useState('');
    const [childPassword, setChildPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    const handleAddChild = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        // Get the logged-in parent's ID from session storage
        const activeParentId = sessionStorage.getItem('activeParentId');

        if (!activeParentId) {
            setMessage({ text: 'Error: No parent logged in.', type: 'error' });
            return;
        }

        try {
            await registerChild(childUsername, childPassword, activeParentId);
            setMessage({ text: `Success! ${childUsername} has been added to the family.`, type: 'success' });
            setChildUsername('');
            setChildPassword('');
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            
            {/* HEADER */}
            <div className="w-full max-w-2xl flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 border-b-4 border-blue-600">
                <h1 className="text-2xl font-bold text-gray-800">Family Setup</h1>
                <button 
                    onClick={() => navigate('/parent-dashboard')} 
                    className="text-blue-600 font-semibold hover:underline"
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* ADD CHILD FORM */}
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md border-t-4 border-green-500">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Register a Child</h2>
                <p className="text-gray-500 mb-6 text-sm">
                    Create an account for your child so they can log in, view their chores, and spend their points.
                </p>

                {message.text && (
                    <div className={`p-3 rounded mb-4 text-sm font-semibold ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleAddChild} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Child's Username</label>
                        <input
                            type="text"
                            required
                            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-green-500"
                            value={childUsername}
                            onChange={(e) => setChildUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Child's Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-green-500"
                            value={childPassword}
                            onChange={(e) => setChildPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg mt-4 transition-all"
                    >
                        Add Child Account
                    </button>
                </form>
            </div>

        </div>
    );
}