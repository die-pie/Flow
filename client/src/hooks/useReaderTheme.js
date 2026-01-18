import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth

const DEFAULT_CONFIG = {
  font: 'serif',
  background: 'aurora',
  mode: 'light',
  color: 'rose'
};

export const useReaderTheme = () => {
    const { user, token } = useAuth(); // 2. Access user & token from useAuth
   
    // 1. Initialize State from LocalStorage
    const [appearance, setAppearance] = useState(() => {
        try {
            const saved = localStorage.getItem('readflow_appearance');
            return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
        } catch {
            return DEFAULT_CONFIG;
        }
    });

    // Sync appearance from backend if user is logged in
    useEffect(() => {
        if (user && user.themePreferences && Object.keys(user.themePreferences).length > 0) {
             setAppearance(prev => ({
                ...DEFAULT_CONFIG,
                ...prev,
                ...user.themePreferences
            }));
        }
    }, [user]);

    // 2. Persistence Side-Effect
    useEffect(() => {
        localStorage.setItem('readflow_appearance', JSON.stringify(appearance));
        
        // Global document class
        if (appearance.mode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        document.documentElement.setAttribute('data-color', appearance.color || 'rose');
    }, [appearance]);

    const updateSetting = (key, value) => {
        const newAppearance = { ...appearance, [key]: value };
        setAppearance(newAppearance);
        
        if (token) {
             fetch('/api/auth?action=theme', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(newAppearance)
            }).catch(err => console.error("Theme sync error:", err));
        }
    };
    
    // 3. Computed Helpers
    const themeClassName = useMemo(() => {
        const textClass = appearance.mode === 'dark' ? 'text-zinc-200' : 'text-zinc-900';
        const bgClass = appearance.background === 'none' 
            ? (appearance.mode === 'dark' ? 'bg-zinc-950' : 'bg-zinc-50')
            : 'bg-transparent';
        
        const fontClass = appearance.font === 'serif' ? 'font-serif' : appearance.font === 'sans' ? 'font-sans' : 'font-mono';
        
        return `${fontClass} ${textClass} ${bgClass}`;
    }, [appearance]);

    return {
        appearance,
        setFont: (f) => updateSetting('font', f),
        setMode: (m) => updateSetting('mode', m),
        setBackground: (b) => updateSetting('background', b),
        setColor: (c) => updateSetting('color', c),
        themeClassName
    };
};
