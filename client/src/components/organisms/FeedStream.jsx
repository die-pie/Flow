import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteFeed } from '../../hooks/useInfiniteFeed';
import { useAuth } from '../../context/AuthContext';
import ScrollItem from './ScrollItem';
import CreatePostModal from './CreatePostModal';
import ManagePostsModal from './ManagePostsModal';
import AccountModal from './AccountModal';
import ReaderView from './ReaderView';
import { useInView } from 'react-intersection-observer';
import { AnimatePresence } from 'framer-motion';

const FeedStream = () => {
    const { data, loadMore, hasMore, loading, error, refresh } = useInfiniteFeed('/api/feed');
    const { user } = useAuth();
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [isManageOpen, setIsManageOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [readingPost, setReadingPost] = useState(null);
    
    // Independent observer for the bottom "loader" element
    const { ref: loaderRef, inView: loaderInView } = useInView({
        threshold: 0,
        rootMargin: '200px', // Pre-load 200px before hitting bottom
    });

    useEffect(() => {
        refresh();
    }, [refresh, isManageOpen, readingPost]);

    useEffect(() => {
        if (loaderInView && hasMore && !readingPost) {
            loadMore();
        }
    }, [loaderInView, hasMore, loadMore, readingPost]);

    if (error) {
        return <div className="text-white text-center mt-20">Failed to load feed. Is the backend running?</div>;
    }

    return (
        <>
            {/* Feed Stream - Only One Visible at a Time */}
            {!readingPost && (
                <div 
                    className="snap-y-mandatory h-screen w-screen bg-transparent relative overflow-y-scroll scroll-smooth no-scrollbar transform-gpu" 
                    style={{ contain: 'strict' }}
                >
                    {data.map((item) => (
                        <ScrollItem 
                            key={item._id} 
                            data={item} 
                            onOpen={(post) => setReadingPost(post)}
                        />
                    ))}

                    {hasMore && (
                        <div ref={loaderRef} className="snap-center h-40 w-full flex items-center justify-center text-white/30">
                            <span className="animate-pulse tracking-widest text-sm">LOADING STREAM...</span>
                        </div>
                    )}
                    
                    {!hasMore && data.length > 0 && (
                        <div className="snap-center h-40 w-full flex items-center justify-center text-white/30">
                            <span className="tracking-widest text-sm">END OF TRANSMISSION</span>
                        </div>
                    )}
                </div>
            )}

            {/* UI Controls - Hidden when reading to remove distractions? Or keeping them? Let's keep them hidden while reading */}
            {!readingPost && (
                <>
                    {/* Compose Button */}
                    <button 
                        onClick={() => setIsComposeOpen(true)}
                        className="fixed bottom-8 right-8 z-40 bg-white text-black w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-90"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>

                    {/* Library Button */}
                    <button 
                        onClick={() => setIsManageOpen(true)}
                        className="fixed bottom-8 left-8 z-40 bg-zinc-900 text-white border border-zinc-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-zinc-800 transition-colors active:scale-90"
                        title="Library"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </button>
                    
                    {/* Profile Button */}
                    <button 
                        onClick={() => setIsAccountOpen(true)}
                        className="fixed top-6 right-6 z-40 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center overflow-hidden hover:scale-110 transition-transform shadow-2xl ring-offset-2 ring-offset-black"
                        title="Account"
                    >
                         <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-white font-bold text-lg border border-white/10">
                             {user?.username?.[0]?.toUpperCase() || '?'}
                         </div>
                    </button>
                </>
            )}

            <CreatePostModal 
                isOpen={isComposeOpen} 
                onClose={() => setIsComposeOpen(false)} 
                onSuccess={() => refresh()} 
            />

            <ManagePostsModal 
                isOpen={isManageOpen}
                onClose={() => setIsManageOpen(false)}
                onSelect={(post) => setReadingPost(post)}
            />
            
            <AccountModal 
                isOpen={isAccountOpen}
                onClose={() => setIsAccountOpen(false)}
            />

            <AnimatePresence mode="wait">
                {readingPost && (
                    <ReaderView 
                        key="reader"
                        post={readingPost} 
                        onClose={() => setReadingPost(null)} 
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default FeedStream;
