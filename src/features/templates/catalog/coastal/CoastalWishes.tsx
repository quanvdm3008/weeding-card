import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, Waves, Sparkles } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";

interface CoastalWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: any;
}

const EMOJI_OPTIONS = ["🌊", "💌", "🐚", "💐", "✨", "❤️", "🏖️", "🥂", "💖", "🕊️"];

export const CoastalWishes: React.FC<CoastalWishesProps> = ({
  publicSlug,
  accentColor = "#00838F",
}) => {
  const { wishes, handleLike, handleSubmit } = useWishesData(publicSlug);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🌊");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try {
      setIsSubmitting(true);
      await handleSubmit(name.trim(), message.trim(), selectedEmoji);
      setName("");
      setMessage("");
    } catch {
      // Error handled in hook toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="py-24 px-6 relative z-20 bg-gradient-to-b from-[#E0F7FA]/60 to-[#B2EBF2] backdrop-blur-lg font-sans">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md mx-auto flex items-center justify-center mb-4 shadow-md text-[#00838F]">
            <Waves className="w-6 h-6" />
          </div>
          <h2 className="font-sans text-xs uppercase tracking-[0.4em] text-[#00838F] mb-2 font-semibold">
            Sổ Lưu Bút Biển Cả
          </h2>
          <p className="font-serif italic text-3xl md:text-4xl text-[#004D40]">
            Lời Chúc Theo Sóng Biển
          </p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/70 backdrop-blur-md p-8 md:p-12 rounded-[3rem] shadow-xl border border-white"
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-semibold text-[#006064] mb-2">
                Họ và Tên của bạn
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Anh Tuấn & Chị Mai"
                className="w-full px-5 py-3.5 rounded-2xl bg-white/80 border border-[#80DEEA]/50 focus:border-[#00838F] focus:ring-2 focus:ring-[#80DEEA]/30 outline-none text-[#004D40] text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-semibold text-[#006064] mb-2">
                Chọn biểu tượng
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? "bg-[#00838F] text-white shadow-md scale-110"
                        : "bg-white/60 border border-[#80DEEA]/40 hover:bg-[#80DEEA]/20"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-semibold text-[#006064] mb-2">
                Lời chúc của bạn
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Gửi đến hai bạn những lời chúc bình an & hạnh phúc..."
                className="w-full px-5 py-3.5 rounded-2xl bg-white/80 border border-[#80DEEA]/50 focus:border-[#00838F] focus:ring-2 focus:ring-[#80DEEA]/30 outline-none text-[#004D40] text-sm transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#00838F] text-white font-xs font-semibold uppercase tracking-[0.2em] shadow-lg shadow-[#00838F]/20 hover:bg-[#006064] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Đang gửi..." : "Gửi Lời Chúc"}
            </button>
          </form>
        </motion.div>

        {/* Wishes List */}
        <div className="grid gap-6 sm:grid-cols-2">
          {wishes.map((wish, idx) => (
            <motion.div
              key={wish.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 4) * 0.08 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-[#80DEEA]/30 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-2xl bg-[#E0F7FA]">
                      {wish.emoji || "🌊"}
                    </span>
                    <div>
                      <h4 className="font-serif italic text-lg text-[#004D40] font-semibold">
                        {wish.name}
                      </h4>
                      <span className="text-[10px] uppercase tracking-wider text-[#00838F]/60 font-medium">
                        {wish.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#006064] leading-relaxed italic mb-4">
                  "{wish.message}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#80DEEA]/20 flex items-center justify-between">
                <span className="text-xs text-[#00838F]/70 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#00838F]" />
                  Lời chúc mừng
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(wish.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    wish.liked
                      ? "bg-[#00838F] text-white shadow-sm"
                      : "bg-[#E0F7FA] text-[#006064] hover:bg-[#80DEEA]/40"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      wish.liked ? "fill-white" : "text-[#00838F]"
                    }`}
                  />
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

export default CoastalWishes;
