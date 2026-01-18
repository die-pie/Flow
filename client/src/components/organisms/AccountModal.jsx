import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Portal from '../atoms/Portal';

const AccountModal = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    // Use local state for immediate feedback on potentially stale data?
    // user object from context should be fresh enough.

    if (!isOpen) return null;

    return (
        <Portal>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Account</h2>
                        <button 
                            onClick={onClose}
                            className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* User Info Card */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 mb-6 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4 text-3xl font-bold text-white shadow-lg border border-white/10">
                            {user?.username?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">@{user?.username || 'Anonymous'}</h3>
                        <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Reader</p>
                    </div>

                    {/* Stats (Placeholder) */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                            <div className="text-2xl font-bold text-white">{user?.favorites?.length || 0}</div>
                            <div className="text-xs text-white/50 uppercase tracking-wider">Favorites</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                            <div className="text-2xl font-bold text-white">0</div>
                            <div className="text-xs text-white/50 uppercase tracking-wider">Posts</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                         <button 
                            onClick={() => {
                                logout();
                                onClose();
                            }}
                            className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Log Out
                        </button>
                    </div>

                </motion.div>
            </div>
        </Portal>
    );
};

export default AccountModal;
