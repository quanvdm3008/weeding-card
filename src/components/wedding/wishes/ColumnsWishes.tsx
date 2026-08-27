import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishesData } from '@/hooks/useWishesData';
import { WeddingTheme } from '@/types/wedding';
import { Heart, Quote, PenTool, Send, X } from 'lucide-react';

interface ColumnsWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: WeddingTheme;
  embedded?: boolean;
}

export const ColumnsWishes: React.FC<ColumnsWishesProps> = ({
  publicSlug,
  accentColor = '#c19b76',
  theme,
  embedded = false,
}) => {
  const { wishes, handleLike, handleSubmit: handleWishSubmit } = useWishesData(publicSlug);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await handleWishSubmit({ name, content });
      setName('');
      setContent('');
      setIsFormOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wishes" className={`w-full py-20 px-4 md:px-8 bg-[#fdfbf7] ${embedded ? 'min-h-screen' : ''}`}>
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <span 
            className="block text-sm uppercase tracking-[0.2em] font-sans mb-4"
            style={{ color: accentColor }}
          >
            Letters to the Editor
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-slate-800 tracking-tight">
            Lời Chúc Phúc
          </h2>
          <div className="w-24 h-[1px] bg-slate-300 mx-auto mt-8 relative">
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45"
              style={{ backgroundColor: accentColor }}
            />
          </div>
        </div>

        {/* Write Wish Button */}
        <div className="flex justify-center mb-16">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFormOpen(true)}
            className="group relative px-8 py-4 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-3 overflow-hidden"
          >
            <div 
              className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out opacity-10"
              style={{ backgroundColor: accentColor }}
            />
            <PenTool size={18} style={{ color: accentColor }} className="relative z-10" />
            <span className="font-serif italic text-lg text-slate-700 relative z-10">
              Gửi thư cho chúng tôi
            </span>
          </motion.button>
        </div>

        {/* Wishes Columns */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 pb-12">
          <AnimatePresence>
            {wishes.map((wish, index) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="break-inside-avoid relative group"
              >
                <div className="bg-white p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500">
                  <Quote 
                    className="absolute top-4 right-4 opacity-10 rotate-180" 
                    size={48} 
                    style={{ color: accentColor }}
                  />
                  
                  <div className="relative z-10">
                    <p className="font-serif text-lg leading-relaxed text-slate-600 italic mb-8 border-l-2 pl-6"
                       style={{ borderColor: accentColor }}>
                      "{wish.content}"
                    </p>
                    
                    <div className="flex items-end justify-between mt-6 pt-6 border-t border-slate-100">
                      <div>
                        <h4 className="font-sans font-semibold text-sm tracking-widest uppercase text-slate-800 mb-1">
                          {wish.name}
                        </h4>
                        <span className="text-xs font-sans text-slate-400 uppercase tracking-wider">
                          {wish.timestamp}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleLike(wish.id)}
                        className="flex items-center gap-2 group/btn"
                      >
                        <Heart 
                          size={16} 
                          className={`transition-colors duration-300 ${wish.isLiked ? 'fill-current' : 'group-hover/btn:fill-current opacity-40'}`}
                          style={{ color: wish.isLiked ? accentColor : undefined }}
                        />
                        <span className="text-xs font-sans text-slate-400">
                          {wish.likes}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Letter Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="w-full max-w-lg bg-[#fdfbf7] shadow-2xl relative overflow-hidden"
              >
                {/* Decorative border */}
                <div className="absolute inset-1 border border-slate-200 pointer-events-none" />
                <div 
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: accentColor }}
                />

                <button
                  onClick={() => setIsFormOpen(false)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
                >
                  <X size={20} />
                </button>

                <div className="p-10">
                  <div className="text-center mb-8 relative">
                    <Quote className="mx-auto mb-4 opacity-20" size={32} style={{ color: accentColor }} />
                    <h3 className="text-2xl font-serif text-slate-800 mb-2">Soạn Thư Tới Tòa Soạn</h3>
                    <p className="font-sans text-sm text-slate-500 tracking-wide">
                      Chia sẻ những lời chúc tốt đẹp nhất
                    </p>
                  </div>

                  <form onSubmit={onSubmit} className="space-y-6 relative z-10">
                    <div>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tên của bạn"
                        className="w-full bg-transparent border-b border-slate-300 py-3 font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-colors rounded-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Nội dung bức thư..."
                        className="w-full bg-transparent border border-slate-300 p-4 font-serif italic text-slate-800 placeholder-slate-400 h-40 resize-none focus:outline-none focus:border-slate-800 transition-colors"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 text-white font-sans uppercase tracking-[0.2em] text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: accentColor }}
                    >
                      {isSubmitting ? (
                        'Đang Gửi...'
                      ) : (
                        <>
                          <Send size={16} />
                          Gửi Đi
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ColumnsWishes;
