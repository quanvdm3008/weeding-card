import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, Sparkles, MessageSquare } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";
import { traditionalTheme } from "./theme";

interface TraditionalWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: any;
}

const EMOJI_OPTIONS = ["囍", "💌", "💖", "🧧", "💐", "🥂", "🌸", "❤️"];

export const TraditionalWishes: React.FC<TraditionalWishesProps> = ({
  publicSlug,
  accentColor = traditionalTheme.colors.accent,
}) => {
  const { wishes, handleLike, handleSubmit } = useWishesData(publicSlug);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("囍");
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
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-4 bg-[#700000] border-t border-[#FFB800]/30 font-serif text-[#E4C77A] relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-4xl font-black font-sans text-[#FFB800] mb-3 drop-shadow">
            Hỷ
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#FFB800]">
            Sổ Xưng Danh
          </h2>
          <p className="text-sm text-white/70 mt-3 font-sans max-w-md mx-auto">
            Gửi ngàn lời chúc tốt đẹp nhất đến đôi uyên ương trăm năm hạnh phúc.
          </p>
          <div className="w-16 h-[2px] bg-[#FFB800] mx-auto mt-4" />
        </div>

        {/* Wish Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#A52A2A] border-4 border-[#FFB800] p-8 sm:p-12 shadow-2xl mb-16 relative"
        >
          <form onSubmit={onSubmit} className="space-y-6 relative z-10 font-sans">
            <div>
              <label className="block text-xs uppercase tracking-[0.1em] font-bold text-[#FFB800] mb-2 font-serif">
                Quý Danh / Họ và Tên
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="w-full px-5 py-3.5 bg-[#8B0000] border border-[#FFB800]/50 focus:border-[#FFB800] outline-none text-white text-sm transition-all placeholder:text-white/40"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.1em] font-bold text-[#FFB800] mb-2 font-serif">
                Chọn Biểu Tượng
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 text-lg flex items-center justify-center border transition-all ${
                      selectedEmoji === emoji
                        ? "bg-[#FFB800] text-[#8B0000] border-[#FFB800] font-bold shadow-md scale-105"
                        : "bg-[#8B0000] text-white border-[#FFB800]/40 hover:border-[#FFB800]"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.1em] font-bold text-[#FFB800] mb-2 font-serif">
                Lời Chúc Hỷ Sự
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Chúc hai bạn trăm năm hạnh phúc, bách niên giai lão..."
                className="w-full px-5 py-3.5 bg-[#8B0000] border border-[#FFB800]/50 focus:border-[#FFB800] outline-none text-white text-sm transition-all resize-none placeholder:text-white/40"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-3.5 bg-[#FFB800] text-[#8B0000] font-serif text-sm font-bold uppercase tracking-[0.1em] hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg rounded-full"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Đang Gửi..." : "Gửi Lời Chúc"}
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
              className="bg-[#A52A2A] p-6 border-2 border-[#FFB800]/70 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2 bg-[#8B0000] border border-[#FFB800]/50 text-[#FFB800]">
                      {wish.emoji || "囍"}
                    </span>
                    <div>
                      <h4 className="text-lg font-bold text-[#FFB800]">
                        {wish.name}
                      </h4>
                      <span className="text-[10px] font-sans uppercase tracking-widest text-white/60">
                        {wish.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-sans text-white/90 leading-relaxed italic mb-6">
                  "{wish.message}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#FFB800]/30 flex items-center justify-between font-sans">
                <span className="text-xs text-[#FFB800]/80 uppercase tracking-widest flex items-center gap-1.5 font-semibold">
                  <MessageSquare className="w-3.5 h-3.5 text-[#FFB800]" />
                  HỶ THƯ
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(wish.id)}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs tracking-wider border transition-all ${
                    wish.liked
                      ? "bg-[#FFB800] text-[#8B0000] border-[#FFB800] font-bold"
                      : "bg-[#8B0000] text-[#FFB800] border-[#FFB800]/60 hover:bg-[#FFB800] hover:text-[#8B0000]"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${wish.liked ? "fill-[#8B0000] text-[#8B0000]" : "text-[#FFB800]"}`} />
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

export default TraditionalWishes;
