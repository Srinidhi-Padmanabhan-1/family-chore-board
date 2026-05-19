// src/Pages/auth/ParentLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginParent } from '../../db/authService';

export default function ParentLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const parent = await loginParent(username, password);
            // Save their ID in local storage so the app remembers who is logged in
            sessionStorage.setItem('activeParentId', parent.id);
            navigate('/parent-dashboard'); // Route to Component 4 (we will build this next)
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-blue-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Parent Login</h2>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-gray-700 mt-2 text-sm"
                    >
                        ← Back to Home
                    </button>
                </form>
            </div>
        </div>
    );
}