import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuroraBackground from '../atoms/AuroraBackground';

const LoginPage = ({ onLoginSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const action = isRegistering ? 'register' : 'login';
            // Use relative path for proxy or absolute URL
            const res = await fetch(`/api/auth?action=${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || data.error || 'Authentication failed');
            }

            // Success
            localStorage.setItem('token', data.token);
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            if (onLoginSuccess) onLoginSuccess(data.token);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden font-sans">
            <AuroraBackground />

            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden"
            >
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h1>
                <p className="text-white/60 mb-8 text-sm">
                    {isRegistering ? 'Join the flow of ideas.' : 'Sign in to continue reading.'}
                </p>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <div>
                            <input 
                                type="text" 
                                placeholder="Username"
                                value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})}
                                className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-white/40 focus:border-white focus:outline-none transition-colors"
                                required
                                minLength={3}
                            />
                        </div>
                        <div>
                            <input 
                                type="password" 
                                placeholder="Password"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-white/40 focus:border-white focus:outline-none transition-colors"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="mt-4 w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div className="mt-8 flex justify-center gap-2 text-sm text-white/50">
                    <span>{isRegistering ? 'Already have an account?' : "Don't have an account?"}</span>
                    <button 
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError(null);
                        }}
                        className="text-white font-medium hover:underline focus:outline-none"
                    >
                        {isRegistering ? 'Sign In' : 'Create Account'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
