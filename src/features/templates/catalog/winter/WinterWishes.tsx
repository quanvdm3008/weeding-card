import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, Snowflake, Sparkles } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";

interface WinterWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: any;
}

const EMOJI_OPTIONS = ["❄️", "💌", "💎", "💐", "✨", "❤️", "🥂", "🎁", "💖", "🎉"];

export const WinterWishes: React.FC<WinterWishesProps> = ({
  publicSlug,
  accentColor = "#0F172A",
}) => {
  const { wishes, handleLike, handleSubmit } = useWishesData(publicSlug);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("❄️");
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
    <section id="wishes" className="py-32 px-6 relative z-20 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] font-sans">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center">
          <Snowflake className="w-6 h-6 text-[#94A3B8] mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="font-sans text-xs uppercase tracking-[0.4em] text-[#0F172A] mb-2 font-semibold">
            Guestbook
          </h3>
          <p className="font-serif italic text-3xl md:text-5xl text-[#0F172A]">
            Warm Wishes in Winter
          </p>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/70 backdrop-blur-md p-8 md:p-12 border border-[#E2E8F0] shadow-sm text-left"
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-semibold text-[#0F172A] mb-2">
                Họ và Tên của bạn
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Anh Tuấn & Chị Mai"
                className="w-full px-5 py-3.5 bg-white border border-[#E2E8F0] focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] outline-none text-[#0F172A] text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-semibold text-[#0F172A] mb-2">
                Biểu tượng chúc mừng
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 text-lg flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? "bg-[#0F172A] text-white shadow-sm scale-105"
                        : "bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#E2E8F0]"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-semibold text-[#0F172A] mb-2">
                Lời chúc của bạn
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Gửi đến chú rể & cô dâu những lời chúc ấm áp nhất..."
                className="w-full px-5 py-3.5 bg-white border border-[#E2E8F0] focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] outline-none text-[#0F172A] text-sm transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 bg-[#0F172A] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#334155] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
              className="bg-white p-6 border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-[#F1F5F9] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-[#F8FAFC]">
                      {wish.emoji || "❄️"}
                    </span>
                    <div>
                      <h4 className="font-serif italic text-lg text-[#0F172A]">
                        {wish.name}
                      </h4>
                      <span className="text-[10px] uppercase tracking-wider text-[#94A3B8]">
                        {wish.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-serif italic text-[#334155] leading-relaxed mb-4">
                  "{wish.message}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-xs text-[#94A3B8] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#64748B]" />
                  Lời chúc mừng
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(wish.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    wish.liked
                      ? "bg-[#0F172A] text-white shadow-sm"
                      : "bg-[#F8FAFC] text-[#0F172A] hover:bg-[#E2E8F0]"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      wish.liked ? "fill-white text-white" : "text-[#0F172A]"
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

export default WinterWishes;
