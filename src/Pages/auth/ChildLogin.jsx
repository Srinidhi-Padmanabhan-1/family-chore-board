import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginChild } from '../../db/authService';

export default function ChildLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const child = await loginChild(username, password);
            // Save their ID in local storage so the app remembers who is logged in
            sessionStorage.setItem('activeChildId', child.id);
            navigate('/child-dashboard'); // Send them to the dashboard you just built!
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-blue-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-8 border-green-500 relative">
                
                <h2 className="text-3xl font-black text-gray-800 mb-2 text-center">Kid's Login</h2>
                <p className="text-center text-gray-500 mb-6 font-semibold">Ready to earn some points?</p>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-bold">{error}</div>}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-700 font-bold mb-1">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-green-500 bg-gray-50"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-green-500 bg-gray-50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-xl py-4 px-4 rounded-xl mt-4 shadow-md transition-transform transform hover:scale-105"
                    >
                        Let's Go! 🚀
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-gray-600 mt-2 text-sm font-bold"
                    >
                        ← Back to Home
                    </button>
                </form>
            </div>
        </div>
    );
}