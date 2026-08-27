import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Send, Plus } from "lucide-react";
import type { WeddingTheme } from "@/data/themes";
import { useWishesData } from "@/hooks/useWishesData";

const emojiOptions = ["💌", "🌸", "💍", "💐", "🥂", "❤️", "🎈", "🎁", "💖", "🎊", "✉️", "💘"];

export const LedgerWishes = ({ 
  publicSlug, 
  accentColor = "#1a1a1a", 
  theme, 
  embedded 
}: { 
  publicSlug?: string; 
  accentColor?: string; 
  theme?: WeddingTheme; 
  embedded?: boolean;
}) => {
  const { wishes, handleLike, handleSubmit: handleWishSubmit } = useWishesData(publicSlug);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(emojiOptions[0]);
  const [isSending, setIsSending] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 600));
    try {
      await handleWishSubmit(name, message, selectedEmoji);
      setShowForm(false);
      setName("");
      setMessage("");
    } finally {
      setIsSending(false);
    }
  };

  const visibleWishes = showAll ? wishes : wishes.slice(0, 5);

  return (
    <section id="wishes" className={`relative z-10 bg-white ${embedded ? "py-12" : "py-24 md:py-36 px-5"}`}>
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-20">
          <p 
            className="text-[10px] font-semibold uppercase tracking-[0.3em] mb-4"
            style={{ color: accentColor }}
          >
            Guestbook
          </p>
          <h2 className="font-serif text-4xl leading-tight md:text-5xl text-neutral-900">
            Sổ Lưu Bút
          </h2>
          <div className="mx-auto mt-8 h-px w-16 bg-neutral-200" />
        </div>

        {/* Form section at the top */}
        <div className="mb-16 border-b border-neutral-200 pb-12">
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.button
                key="open-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => setShowForm(true)}
                className="group flex w-full items-center justify-between py-4 text-left transition-colors hover:text-neutral-600"
              >
                <span className="font-serif text-xl italic text-neutral-400 group-hover:text-neutral-600 transition-colors">
                  Viết lời chúc của bạn...
                </span>
                <span 
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 transition-all duration-300 group-hover:border-neutral-400 group-hover:bg-neutral-50"
                  style={{ color: accentColor }}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </motion.button>
            ) : (
              <motion.form
                key="wish-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
                onSubmit={handleSubmit}
              >
                <div className="space-y-8">
                  <div className="grid gap-8 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">Tên của bạn</label>
                      <input 
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent border-b border-neutral-300 pb-3 text-neutral-900 focus:border-neutral-900 focus:outline-none font-sans text-base transition-colors placeholder:text-neutral-300"
                        placeholder="Nhập tên..."
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">Biểu tượng</label>
                      <div className="flex flex-wrap gap-2">
                        {emojiOptions.slice(0, 8).map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setSelectedEmoji(emoji)}
                            className={`flex h-8 w-8 items-center justify-center text-sm transition-all ${
                              selectedEmoji === emoji ? "border-b border-neutral-900 scale-110" : "opacity-50 hover:opacity-100"
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-[10px] uppercase tracking-widest text-neutral-500">Lời chúc</label>
                    <textarea 
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-transparent border-b border-neutral-300 pb-3 text-neutral-900 focus:border-neutral-900 focus:outline-none font-serif text-xl md:text-2xl transition-colors placeholder:text-neutral-300 resize-none italic"
                      placeholder="Gửi gắm lời yêu thương..."
                    />
                  </div>
                  
                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSending}
                      className="group flex items-center justify-center gap-3 bg-neutral-900 px-8 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition-all hover:bg-neutral-800 disabled:opacity-70"
                    >
                      {isSending ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                          <Sparkles className="h-3 w-3" />
                        </motion.div>
                      ) : (
                        <>
                          Gửi lời chúc
                          <Send className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Ledger List */}
        <div className="flex flex-col">
          {visibleWishes.map((wish, index) => (
            <motion.article 
              key={wish.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: index * 0.05, duration: 0.6, ease: "easeOut" }}
              className="group relative flex flex-col md:flex-row gap-6 md:gap-10 border-b border-neutral-100 py-10 transition-colors hover:bg-neutral-50/50"
            >
              {/* Left Column: Meta */}
              <div className="md:w-1/4 flex flex-col justify-start">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{wish.emoji}</span>
                  <span className="font-sans text-sm font-semibold uppercase tracking-wider text-neutral-900">
                    {wish.name}
                  </span>
                </div>
                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                  {wish.timestamp}
                </span>
              </div>
              
              {/* Right Column: Message & Actions */}
              <div className="md:w-3/4 flex flex-col">
                <p className="font-serif text-xl md:text-2xl leading-relaxed text-neutral-700 italic">
                  "{wish.message}"
                </p>
                
                <div className="mt-6 flex items-center justify-end">
                  <button 
                    onClick={() => handleLike(wish.id)}
                    className="group/btn flex items-center gap-2"
                  >
                    <Heart 
                      className={`h-4 w-4 transition-transform group-hover/btn:scale-110 ${wish.liked ? "fill-red-500 text-red-500" : "text-neutral-300 group-hover/btn:text-red-400"}`} 
                    />
                    {wish.likes > 0 && (
                      <span className={`text-[10px] font-sans ${wish.liked ? "text-red-500 font-medium" : "text-neutral-400"}`}>
                        {wish.likes}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {!showAll && wishes.length > 5 && (
          <div className="mt-16 text-center">
            <button 
              onClick={() => setShowAll(true)}
              className="inline-block text-[11px] uppercase tracking-[0.2em] text-neutral-500 border-b border-neutral-300 pb-1 hover:text-neutral-900 hover:border-neutral-900 transition-all duration-300"
            >
              Xem thêm {wishes.length - 5} lời chúc
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
