import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishesData } from '@/hooks/useWishesData';
import { Send, Heart } from 'lucide-react';
import type { WeddingTheme } from '@/types/wedding';

interface FeaturedWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: WeddingTheme;
  embedded?: boolean;
}

export const FeaturedWishes: React.FC<FeaturedWishesProps> = ({
  publicSlug,
  accentColor = '#FFD700', // Default gold
  theme,
  embedded = false,
}) => {
  const { wishes, handleLike, handleSubmit: handleWishSubmit } = useWishesData(publicSlug);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newWishName, setNewWishName] = useState('');
  const [newWishMessage, setNewWishMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextWish = () => {
    if (wishes && wishes.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % wishes.length);
    }
  };

  const prevWish = () => {
    if (wishes && wishes.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + wishes.length) % wishes.length);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishName.trim() || !newWishMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      await handleWishSubmit({ name: newWishName, content: newWishMessage });
      setNewWishName('');
      setNewWishMessage('');
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to submit wish', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If there are no wishes yet, show a placeholder
  const activeWishes = wishes?.length ? wishes : [
    { id: '1', name: 'Gia Đình', content: 'Chúc hai bạn trăm năm hạnh phúc!', likes: 5, createdAt: new Date() }
  ];

  return (
    <div id="wishes" className={`relative w-full overflow-hidden flex flex-col items-center justify-center min-h-[600px] bg-neutral-950 text-white ${embedded ? '' : 'py-20'}`}>
      {/* Background glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="z-10 text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-serif mb-4"
          style={{ textShadow: `0 0 20px ${accentColor}80` }}
        >
          Lời Chúc Tốt Đẹp
        </motion.h2>
        <p className="text-white/60 max-w-lg mx-auto">
          Những lời chúc chân thành từ người thân và bạn bè sẽ là món quà quý giá nhất.
        </p>
      </div>

      {/* 3D Carousel */}
      <div className="relative w-full max-w-4xl h-[400px] flex items-center justify-center perspective-[1200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8, rotateY: -30, z: -200, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, rotateY: 30, z: -200, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute p-8 md:p-12 rounded-2xl backdrop-blur-xl border border-white/10 w-[90%] md:w-[600px] flex flex-col items-center text-center shadow-2xl"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
              boxShadow: `0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1px ${accentColor}30`
            }}
          >
            <div 
              className="text-6xl mb-6 opacity-30 font-serif"
              style={{ color: accentColor }}
            >
              "
            </div>
            <p className="text-xl md:text-2xl italic leading-relaxed mb-8">
              {activeWishes[currentIndex]?.content}
            </p>
            <div className="flex items-center justify-between w-full mt-auto">
              <div>
                <h4 className="font-semibold text-lg" style={{ color: accentColor }}>
                  {activeWishes[currentIndex]?.name}
                </h4>
                {activeWishes[currentIndex]?.createdAt && (
                  <p className="text-sm text-white/40">
                    {new Date(activeWishes[currentIndex]?.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => activeWishes[currentIndex]?.id && handleLike(activeWishes[currentIndex].id)}
                className="flex items-center gap-2 group transition-colors"
              >
                <Heart 
                  className={`w-6 h-6 transition-all ${activeWishes[currentIndex]?.likes ? 'fill-red-500 text-red-500' : 'text-white/50 group-hover:text-red-400'}`} 
                />
                <span className="text-white/70 group-hover:text-white">
                  {activeWishes[currentIndex]?.likes || 0}
                </span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-4 md:px-12 pointer-events-none">
          <button 
            onClick={prevWish}
            className="w-12 h-12 rounded-full backdrop-blur-md bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all pointer-events-auto"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button 
            onClick={nextWish}
            className="w-12 h-12 rounded-full backdrop-blur-md bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all pointer-events-auto"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {/* Write Wish Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsFormOpen(true)}
        className="mt-12 px-8 py-4 rounded-full font-medium tracking-wide flex items-center gap-3 backdrop-blur-md"
        style={{ 
          backgroundColor: `${accentColor}20`,
          border: `1px solid ${accentColor}50`,
          color: accentColor,
          boxShadow: `0 0 20px ${accentColor}20`
        }}
      >
        <Send className="w-5 h-5" />
        Gửi lời chúc của bạn
      </motion.button>

      {/* Floating Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-lg p-8 rounded-2xl border border-white/10 overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(30,30,30,0.9) 0%, rgba(20,20,20,0.95) 100%)',
                boxShadow: `0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 1px ${accentColor}30`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="absolute top-0 left-0 w-full h-1"
                style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
              />
              
              <h3 className="text-2xl font-serif mb-6 text-center">Viết Lời Chúc</h3>
              
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Tên của bạn"
                    value={newWishName}
                    onChange={(e) => setNewWishName(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Những lời chúc tốt đẹp nhất..."
                    value={newWishMessage}
                    onChange={(e) => setNewWishMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl font-medium flex items-center justify-center transition-all disabled:opacity-50"
                    style={{ 
                      backgroundColor: accentColor,
                      color: '#000',
                      boxShadow: `0 4px 14px ${accentColor}50`
                    }}
                  >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi lời chúc'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
