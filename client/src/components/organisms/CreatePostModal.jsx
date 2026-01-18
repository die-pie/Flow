import React, { useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import Portal from '../atoms/Portal';
import { useAuth } from '../../context/AuthContext';

const CreatePostModal = ({ isOpen, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationType, setAnimationType] = useState('none');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post('/api/feed', {
        title,
        content,
        type: 'text',
        typography: {
            animationType
        }
      }, {
          headers: { 'x-auth-token': token }
      });
      setTitle('');
      setContent('');
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to post:", error);
      alert(error.response?.data?.msg || error.response?.data?.error || "Failed to submit post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Portal>
        <div className={`fixed inset-0 z-[100] transition-all duration-300 ${isOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'}`}>
            
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/80 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
                onClick={onClose}
            />

            {/* Modal Card - Slide & Fade Transition */}
            <div
                className={`fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${isOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-10'}`}
            >
                <div className={`bg-zinc-900 border border-white/10 w-full md:w-full md:max-w-2xl md:rounded-3xl p-8 pointer-events-auto h-[90vh] md:h-auto pb-safe shadow-2xl relative overflow-hidden transform-gpu transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}> 
                    
                    {/* Subtle Grain Texture Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Draft a Narrative</h2>
                                <p className="text-zinc-500 text-sm mt-1">Craft a story worth deep-reading.</p>
                            </div>
                            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
                            <div>
                                <input 
                                    type="text" 
                                    placeholder="The Hook..." 
                                    className="w-full bg-transparent text-5xl font-black text-white placeholder-zinc-700 focus:outline-none tracking-tight"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    autoFocus // Note: Might want to disable this if it causes jumpy behavior on mobile open
                                />
                            </div>

                            <div className="flex-1">
                                <textarea 
                                    placeholder="Start your story here..." 
                                    className="w-full h-full bg-transparent text-xl text-zinc-300 placeholder-zinc-700 font-serif leading-relaxed focus:outline-none resize-none"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                />
                            </div>

                            {/* Animation Selector Cards */}
                            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                                {['slide', 'fade', 'distort'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setAnimationType(type)}
                                        className={clsx(
                                            "h-24 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all relative overflow-hidden group",
                                            animationType === type 
                                                ? "bg-white text-black border-white" 
                                                : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20 hover:bg-zinc-800"
                                        )}
                                    >
                                        <span className="text-xs font-mono uppercase tracking-widest z-10">{type}</span>
                                        {/* Visual Representation */}
                                        <div className={clsx("w-8 h-1 bg-current rounded-full transition-transform duration-1000",
                                            type === 'slide' && "group-hover:translate-x-4",
                                            type === 'fade' && "group-hover:opacity-0",
                                            type === 'distort' && "group-hover:skew-x-12"
                                        )} />
                                    </button>
                                ))}
                            </div>

                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || !title.trim()}
                                    className="w-full bg-white text-black font-bold py-4 rounded-xl disabled:opacity-50 active:scale-[0.98] transition-all hover:bg-neutral-200"
                                >
                                    {isSubmitting ? 'Publishing...' : 'Publish to Stream'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Portal>
  );
};

export default CreatePostModal;
