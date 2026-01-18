import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersistentLikes } from '../../hooks/usePersistentLikes';
import Portal from '../atoms/Portal';

const ManagePostsModal = ({ isOpen, onClose, onSelect }) => {
  const { likes, toggleLike } = usePersistentLikes();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch posts when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPosts();
    }
  }, [isOpen]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Fetching a larger limit to see more items for management
      const response = await axios.get('/api/feed?limit=50'); 
      setPosts((response.data && Array.isArray(response.data.items)) ? response.data.items : []);
    } catch (error) {
      console.error("Failed to load posts", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (post) => {
    if (onSelect) {
        onSelect(post);
        onClose();
    }
  };

  const handleSelectFavorite = async (like) => {
      // 1. Try to find in currently loaded posts
      let targetPost = posts.find(p => p._id === like.sourcePostId);

      if (targetPost) {
          onSelect({ ...targetPost, initialScrollIndex: like.lineIndex });
          onClose();
          return;
      }

      // 2. Fetch if missing
      setLoading(true);
      try {
          const response = await axios.get(`/api/feed`, { params: { id: like.sourcePostId } });
          const fetched = (response.data && response.data.items && response.data.items.length > 0) ? response.data.items[0] : null;
          
          if (fetched) {
             onSelect({ ...fetched, initialScrollIndex: like.lineIndex });
             onClose();
          } else {
             alert("Original memory not found (deleted?)");
          }
      } catch (e) {
          console.error("Failed to fetch favorite source", e);
      } finally {
          setLoading(false);
      }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent triggering selection
    if (!confirm("Are you sure you want to delete this memory?")) return;
    
    try {
      await axios.delete(`/api/feed?id=${id}`);
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Could not delete post");
    }
  };

  return (
    <Portal>
      <div className={`fixed inset-0 z-[100] transition-all duration-300 ${isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'}`}>
        
        {/* Backdrop - Opacity Transition Only */}
        <div 
            className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
            onClick={onClose}
        />

        {/* Sidebar - Slide Transition */}
        <div 
            className={`absolute inset-y-0 left-0 w-full md:w-96 bg-zinc-900 border-r border-zinc-800 p-6 overflow-hidden flex flex-col shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex justify-between items-center mb-8">
                <div className="flex gap-4">
                    <button 
                        onClick={() => setActiveTab('posts')}
                        className={`text-lg font-bold transition-colors ${activeTab === 'posts' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Memories
                    </button>
                    <button 
                        onClick={() => setActiveTab('favs')}
                        className={`text-lg font-bold transition-colors ${activeTab === 'favs' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Favorites
                    </button>
                </div>
                <button onClick={onClose} className="text-zinc-500 hover:text-white text-sm">Close</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {loading && <div className="text-zinc-500">Loading data...</div>}
                
                {/* POSTS TAB */}
                {activeTab === 'posts' && !loading && (
                    <>
                        {posts.length === 0 && (
                            <div className="text-zinc-600 text-center mt-10">No thoughts recorded yet.</div>
                        )}
                        {posts.map(post => (
                            <div 
                                key={post._id} 
                                onClick={() => handleSelect(post)}
                                className="bg-black/50 p-4 rounded-xl border border-zinc-800 flex justify-between items-start group cursor-pointer hover:bg-zinc-800/50 transition-colors"
                            >
                                <div className="flex-1 min-w-0 mr-4">
                                    <h3 className="text-white font-semibold truncate">{post.title}</h3>
                                    <p className="text-zinc-500 text-sm truncate">{post.content || 'Visual Content'}</p>
                                    <span className="text-xs text-zinc-700 mt-2 block">{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                                <button 
                                    onClick={(e) => handleDelete(post._id, e)}
                                    className="text-zinc-600 hover:text-red-500 transition-colors p-2"
                                    title="Delete"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        ))}
                    </>
                )}

                {/* FAVORITES TAB */}
                {activeTab === 'favs' && !loading && (
                    <>
                        {likes.length === 0 && (
                            <div className="text-zinc-600 text-center mt-10">No favorites saved yet. Double-tap a line to save it.</div>
                        )}
                        {likes.map(like => (
                            <div 
                                key={like.id}
                                onClick={() => handleSelectFavorite(like)}
                                className="group cursor-pointer bg-zinc-900/50 border border-zinc-800 hover:border-zinc-600 transition-all p-6 relative overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-pink-600 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                                
                                <blockquote className="font-serif text-xl italic text-zinc-300 group-hover:text-white transition-colors mb-4 line-clamp-4">
                                    "{like.text}"
                                </blockquote>
                                
                                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{like.sourceTitle}</h4>
                                        <span className="text-[10px] font-mono text-zinc-600">Line {like.lineIndex}</span>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLike({ _id: like.sourcePostId }, like.lineIndex, like.text);
                                        }}
                                        className="text-zinc-600 hover:text-red-500 p-2"
                                        title="Remove Favorite"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-50"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
      </div>
    </Portal>
  );
};

export default ManagePostsModal;
