import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, PenLine, Send } from "lucide-react";
import type { WeddingTheme } from "@/data/themes";
import { useWishesData } from "@/hooks/useWishesData";

const emojiOptions = ["💌", "🌸", "💍", "💐", "🥂", "❤️", "🎈", "🎁", "💖", "🎊", "✉️", "💘"];

export const ParallaxLoveWishes = ({ publicSlug, embedded }: { publicSlug?: string; accentColor?: string; theme?: WeddingTheme; embedded?: boolean }) => {
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
    await new Promise((r) => setTimeout(r, 600)); // Cinematic delay
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
    <section id="wishes" className="relative z-10 bg-[#FBF9F4] px-5 py-24 md:py-36">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#857461]">Sổ lưu bút</p>
          <h2 className="mt-4 font-serif text-4xl leading-none md:text-5xl text-[#28312A]">Gửi lời chúc yêu thương</h2>
          <div className="mx-auto mt-6 h-px w-24 bg-[#8C7A6B]/30" />
        </div>

        <div className="space-y-12">
          {visibleWishes.map((wish, index) => (
            <motion.article 
              key={wish.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
              className="group relative"
            >
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#EAE2D4] border border-[#8C7A6B]/20 flex items-center justify-center text-2xl shadow-inner">
                  {wish.emoji}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-sans font-bold uppercase tracking-widest text-[#28312A] text-sm">
                      {wish.name}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#8C7A6B]/40" />
                    <span className="font-sans text-[10px] uppercase tracking-wider text-[#8C7A6B]/70">
                      {wish.timestamp}
                    </span>
                  </div>
                  
                  <p className="font-serif text-xl md:text-2xl text-[#59534E] leading-relaxed italic">
                    "{wish.message}"
                  </p>
                  
                  <div className="mt-4 flex items-center gap-3">
                    <button 
                      onClick={() => handleLike(wish.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                        wish.liked ? "border-[#8C7A6B] text-[#8C7A6B] bg-[#EAE2D4]" : "border-transparent text-[#8C7A6B]/60 hover:bg-[#EAE2D4]/50"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${wish.liked ? "fill-[#8C7A6B]" : ""}`} />
                      {wish.likes > 0 && <span>{wish.likes}</span>}
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          {!showAll && wishes.length > 5 && (
            <button 
              onClick={() => setShowAll(true)}
              className="text-xs uppercase tracking-widest text-[#857461] border-b border-[#857461]/30 pb-1 hover:border-[#857461] transition-colors"
            >
              Xem thêm {wishes.length - 5} lời chúc
            </button>
          )}

          <AnimatePresence>
            {!showForm ? (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setShowForm(true)}
                className="mt-8 flex items-center gap-2 rounded-full border border-[#857461] bg-transparent px-8 py-3.5 text-sm font-semibold tracking-widest text-[#857461] uppercase transition hover:bg-[#857461] hover:text-white"
              >
                <PenLine className="w-4 h-4" />
                Viết lời chúc
              </motion.button>
            ) : (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-2xl mt-8 bg-white/50 backdrop-blur-md border border-[#8C7A6B]/20 p-6 md:p-10 rounded-[2rem] shadow-xl"
                onSubmit={handleSubmit}
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#8C7A6B] mb-2">Tên của bạn</label>
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent border-b border-[#8C7A6B]/30 pb-2 text-[#28312A] focus:border-[#8C7A6B] focus:outline-none font-serif text-lg transition-colors placeholder:text-[#8C7A6B]/40"
                      placeholder="Nhập tên..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#8C7A6B] mb-2">Lời chúc</label>
                    <textarea 
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-transparent border-b border-[#8C7A6B]/30 pb-2 text-[#28312A] focus:border-[#8C7A6B] focus:outline-none font-serif text-xl md:text-2xl transition-colors placeholder:text-[#8C7A6B]/40 resize-none italic"
                      placeholder="Gửi gắm lời yêu thương..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#8C7A6B] mb-3">Biểu tượng</label>
                    <div className="flex flex-wrap gap-2">
                      {emojiOptions.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setSelectedEmoji(emoji)}
                          className={`w-10 h-10 rounded-full text-xl flex items-center justify-center transition-all ${
                            selectedEmoji === emoji ? "bg-[#8C7A6B] text-white scale-110 shadow-lg" : "bg-white border border-[#8C7A6B]/20 hover:bg-[#EAE2D4]"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-6 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 text-xs uppercase tracking-widest text-[#857461] border border-[#857461]/30 rounded-full hover:bg-[#857461]/5 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSending}
                      className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-widest text-white bg-[#857461] rounded-full hover:bg-[#6D5E4D] transition-colors disabled:opacity-70"
                    >
                      {isSending ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Gửi lời chúc
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
