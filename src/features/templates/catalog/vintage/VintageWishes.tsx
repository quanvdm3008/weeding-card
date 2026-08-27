import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Stamp, Heart, MessageSquare, Sparkles, Feather } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";

interface VintageWishesProps {
  publicSlug?: string;
  accentColor?: string;
}

const EMOJI_STAMPS = ["💌", "🕊️", "📜", "🖋️", "🍂", "🤎", "💍", "⏳"];

export const VintageWishes: React.FC<VintageWishesProps> = ({
  publicSlug,
  accentColor = "#9A7B56",
}) => {
  const { wishes, handleLike, handleSubmit } = useWishesData(publicSlug);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("💌");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await handleSubmit(name.trim(), message.trim(), selectedEmoji);
      setName("");
      setMessage("");
    } catch {
      // Handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="py-24 px-4 bg-[#FAF7F2] text-[#2C2523] relative z-10 border-t border-[#C5A880]/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14 space-y-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9A7B56] font-semibold">
            LIVRE D'OR DE MARIAGE
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal tracking-[0.1em] text-[#2C2523] uppercase">
            SỔ LƯU BÚT KỶ NIỆM
          </h2>
          <p className="text-xs sm:text-sm italic text-[#6B5D55] max-w-md mx-auto">
            "Mỗi dòng chúc phúc gửi gắm là một nốt nhạc ngân vang trong khúc ca tình yêu."
          </p>
          <div className="w-16 h-[1px] bg-[#C5A880] mx-auto mt-4" />
        </div>

        {/* Wish Form Card - Luxury Parisian Stationery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#FDFBF7] p-6 sm:p-12 rounded-3xl border border-[#C5A880]/60 shadow-[0_15px_40px_rgba(154,123,86,0.1)] mb-16 relative overflow-hidden"
        >
          <form onSubmit={onSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-2 font-serif">
                  Ký tên người gửi *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Bạn thời Đại học, Gia đình Bác..."
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#C5A880]/40 focus:border-[#9A7B56] focus:bg-white focus:ring-1 focus:ring-[#9A7B56] outline-none text-[#2C2523] text-xs sm:text-sm font-serif transition-all placeholder:text-[#A8988E]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-2 font-serif">
                  Con dấu biểu cảm
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_STAMPS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-9 h-9 rounded-xl border text-base flex items-center justify-center transition-all cursor-pointer ${
                        selectedEmoji === emoji
                          ? "bg-[#9A7B56] text-white border-[#9A7B56] shadow-md scale-105"
                          : "bg-[#FAF7F2] border-[#C5A880]/40 hover:bg-[#F3EDE2]"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#2C2523] mb-2 font-serif">
                Bức thư gửi gắm lời chúc *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Gửi gắm những lời chúc phúc ngọt ngào và chân thành nhất tới đôi uyên ương..."
                className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#C5A880]/40 focus:border-[#9A7B56] focus:bg-white focus:ring-1 focus:ring-[#9A7B56] outline-none text-[#2C2523] text-xs sm:text-sm font-serif transition-all resize-none leading-relaxed placeholder:text-[#A8988E]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#9A7B56] bg-[#9A7B56] text-[#FAF7F2] font-semibold text-xs uppercase tracking-widest hover:bg-[#7D6344] transition-all shadow-md flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer active:translate-y-0.5"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Đang gửi lời chúc..." : "GỬI THƯ LƯU BÚT"}
            </button>
          </form>
        </motion.div>

        {/* Wishes Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {wishes.map((wish, idx) => (
            <motion.div
              key={wish.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 4) * 0.06 }}
              className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#C5A880]/40 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-[#C5A880]/20">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl p-1.5 rounded-lg bg-[#FAF7F2] border border-[#C5A880]/30 shadow-inner">
                      {wish.emoji || "💌"}
                    </span>
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base text-[#2C2523]">
                        {wish.name}
                      </h4>
                      <span className="text-[10px] text-[#8C7A70] font-mono">
                        {wish.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-[#5C4D44] italic mb-4">
                  "{wish.message}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#C5A880]/20 flex items-center justify-between">
                <span className="text-[10px] text-[#8C7A70] flex items-center gap-1 font-serif">
                  <MessageSquare className="w-3 h-3 text-[#9A7B56]" />
                  Thư chúc mừng
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(wish.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                    wish.liked
                      ? "bg-[#9A7B56] text-white border-[#9A7B56] shadow-sm"
                      : "bg-[#FAF7F2] border-[#C5A880]/40 text-[#9A7B56] hover:bg-[#F3EDE2]"
                  }`}
                >
                  <Heart className={`w-3 h-3 ${wish.liked ? "fill-white" : "text-[#9A7B56]"}`} />
                  <span>{wish.likes}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VintageWishes;
