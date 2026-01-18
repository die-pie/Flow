import { useState, useEffect } from 'react';

const STORAGE_KEY = 'readflow_user_likes';

export const usePersistentLikes = () => {
    const [likes, setLikes] = useState([]);

    // Load on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setLikes(parsed);
                }
            } catch (e) {
                console.error("Failed to parse user likes", e);
            }
        }
    }, []);

    // Helper to check if a specific line is liked
    const isLineLiked = (postId, lineIndex) => {
        return Array.isArray(likes) && likes.some(like => like.sourcePostId === postId && like.lineIndex.toString() === lineIndex.toString());
    };

    // Toggle logic
    const toggleLike = (post, lineIndex, text) => {
        setLikes(prev => {
            if (!Array.isArray(prev)) prev = [];
            const exists = prev.find(l => l.sourcePostId === post._id && l.lineIndex.toString() === lineIndex.toString());
            let newLikes;
            
            if (exists) {
                // Remove
                newLikes = prev.filter(l => l !== exists);
            } else {
                // Add
                const newLike = {
                    id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9),
                    text: text,
                    sourceTitle: post.title || 'Untitled',
                    sourcePostId: post._id,
                    lineIndex: lineIndex,
                    timestamp: Date.now()
                };
                newLikes = [newLike, ...prev];
            }

            // Sync to LocalStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newLikes));
            return newLikes;
        });
    };

    return { likes, isLineLiked, toggleLike };
};
