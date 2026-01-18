import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Check token on mount
    useEffect(() => {
        const verifyToken = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    setToken(storedToken);
                    // Verify with backend
                    const res = await fetch('/api/auth', {
                        headers: { 'x-auth-token': storedToken }
                    });
                    
                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                    } else {
                        // Token invalid/expired
                        localStorage.removeItem('token');
                        setToken(null);
                        setUser(null);
                    }
                } catch (err) {
                    console.error("Auth Check Error:", err);
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };

        verifyToken();
    }, []);

    const login = (newToken, userData) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        if (userData) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            // Fetch user if not provided
            fetch('/api/auth', { headers: { 'x-auth-token': newToken } })
                .then(res => res.json())
                .then(data => setUser(data))
                .catch(err => console.error(err));
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
