import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishesData } from '@/hooks/useWishesData';
import { Heart, Send, MessageSquarePlus, X } from 'lucide-react';
import type { WeddingTheme } from '@/data/themes';

export interface RailWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: WeddingTheme;
  embedded?: boolean;
}

export const RailWishes: React.FC<RailWishesProps> = ({
  publicSlug,
  accentColor = '#00ffcc',
  theme,
  embedded = false,
}) => {
  const { wishes, handleLike, handleSubmit: handleWishSubmit } = useWishesData(publicSlug);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const themeAccent = accentColor;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    
    await handleWishSubmit({ name, content });
    setName('');
    setContent('');
    setIsModalOpen(false);
  };

  return (
    <section id="wishes" className="relative w-full py-16 overflow-hidden bg-black/5 backdrop-blur-sm">
      {/* Background decorations */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${themeAccent} 0%, transparent 70%)`
        }}
      />

      <div className="container mx-auto px-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wider text-white" style={{ textShadow: `0 0 10px ${themeAccent}` }}>
            Guest Signals
          </h2>
          <p className="text-gray-400 mt-2 font-mono text-sm">TRANSMITTING WISHES FROM ACROSS THE NETWORK</p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-wider transition-all duration-300"
          style={{ 
            backgroundColor: 'transparent',
            border: `1px solid ${themeAccent}`,
            color: themeAccent,
            boxShadow: `0 0 15px ${themeAccent}40, inset 0 0 10px ${themeAccent}20`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = themeAccent;
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.boxShadow = `0 0 25px ${themeAccent}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = themeAccent;
            e.currentTarget.style.boxShadow = `0 0 15px ${themeAccent}40, inset 0 0 10px ${themeAccent}20`;
          }}
        >
          <MessageSquarePlus size={20} />
          <span>Send Signal</span>
        </button>
      </div>

      {/* Marquee Rail */}
      <div className="relative w-full overflow-hidden flex py-4 z-10 mask-image-linear-gradient">
        <motion.div
          className="flex gap-6 px-4 w-max"
          animate={{ x: [0, -1032 * (wishes?.length || 1)] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: Math.max((wishes?.length || 1) * 5, 20),
              ease: "linear",
            },
          }}
        >
          {wishes && wishes.length > 0 ? (
            <>
              {wishes.map((wish, idx) => (
                <div
                  key={wish.id || idx}
                  className="flex-shrink-0 w-80 p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group"
                  style={{
                    borderColor: `${themeAccent}30`,
                    background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)`,
                    boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.3)`
                  }}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `linear-gradient(45deg, transparent, ${themeAccent}20, transparent)`,
                    }}
                  />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="font-bold text-lg text-white font-mono truncate">{wish.name}</div>
                    <button 
                      onClick={() => handleLike(wish.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Heart size={18} className={wish.hasLiked ? "fill-red-500 text-red-500" : ""} />
                      <span className="text-xs">{wish.likes || 0}</span>
                    </button>
                  </div>
                  <p className="text-gray-300 leading-relaxed relative z-10 whitespace-pre-wrap break-words">{wish.content}</p>
                  <div className="mt-4 text-xs text-gray-500 font-mono relative z-10">
                    {new Date(wish.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {/* Duplicate list for continuous marquee effect */}
              {wishes.map((wish, idx) => (
                <div
                  key={`dup-${wish.id || idx}`}
                  className="flex-shrink-0 w-80 p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group"
                  style={{
                    borderColor: `${themeAccent}30`,
                    background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)`,
                    boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.3)`
                  }}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `linear-gradient(45deg, transparent, ${themeAccent}20, transparent)`,
                    }}
                  />
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="font-bold text-lg text-white font-mono truncate">{wish.name}</div>
                    <button 
                      onClick={() => handleLike(wish.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Heart size={18} className={wish.hasLiked ? "fill-red-500 text-red-500" : ""} />
                      <span className="text-xs">{wish.likes || 0}</span>
                    </button>
                  </div>
                  <p className="text-gray-300 leading-relaxed relative z-10 whitespace-pre-wrap break-words">{wish.content}</p>
                  <div className="mt-4 text-xs text-gray-500 font-mono relative z-10">
                    {new Date(wish.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-gray-400 font-mono text-sm py-8 px-4">Awaiting incoming signals...</div>
          )}
        </motion.div>
      </div>

      {/* Input Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-8 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(10, 10, 15, 0.9)',
                border: `1px solid ${themeAccent}50`,
                boxShadow: `0 0 40px ${themeAccent}20`
              }}
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div 
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ background: themeAccent }}
              />

              <h3 className="text-2xl font-bold mb-6 text-white uppercase tracking-wider flex items-center gap-2">
                <Send size={24} style={{ color: themeAccent }} />
                Transmit Signal
              </h3>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1 font-mono">
                    Identity
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-transparent transition-colors font-mono"
                    style={{
                      borderBottom: `2px solid ${themeAccent}50`,
                    }}
                    onFocus={(e) => e.target.style.borderColor = themeAccent}
                    onBlur={(e) => e.target.style.borderColor = `${themeAccent}50`}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1 font-mono">
                    Message payload
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Enter your wishes..."
                    rows={4}
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-transparent transition-colors resize-none"
                    style={{
                      borderBottom: `2px solid ${themeAccent}50`,
                    }}
                    onFocus={(e) => e.target.style.borderColor = themeAccent}
                    onBlur={(e) => e.target.style.borderColor = `${themeAccent}50`}
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-4 mt-4 rounded-lg font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden group"
                  style={{
                    backgroundColor: `${themeAccent}20`,
                    color: themeAccent,
                    border: `1px solid ${themeAccent}`
                  }}
                >
                  <div 
                    className="absolute inset-0 w-0 group-hover:w-full transition-all duration-300 ease-out z-0"
                    style={{ backgroundColor: themeAccent }}
                  />
                  <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                    Initialize Transmission
                  </span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .mask-image-linear-gradient {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}} />
    </section>
  );
};

export default RailWishes;
