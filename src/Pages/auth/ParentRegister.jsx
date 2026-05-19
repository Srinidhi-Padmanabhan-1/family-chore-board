// src/Pages/auth/ParentRegister.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerParent } from '../../db/authService';

export default function ParentRegister() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // isAdmin is set to TRUE because this is the first-time setup
            await registerParent(username, password, true);
            alert('Admin Parent Account created! Please log in.');
            navigate('/parent-login'); // Send them to login after registering
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-yellow-400">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">First-Time Setup</h2>
                <p className="text-gray-500 mb-6 text-sm">Create the master parent account to get started.</p>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg mt-4 transition-all"
                    >
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}