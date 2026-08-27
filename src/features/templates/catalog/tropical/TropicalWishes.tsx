import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Heart, MessageSquare, Sun } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";
import { tropicalTheme } from "./theme";

interface TropicalWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: any;
}

const EMOJI_OPTIONS = ["🌺", "🌴", "🌊", "☀️", "🥥", "🐚", "🧡", "🍹"];

export const TropicalWishes: React.FC<TropicalWishesProps> = ({
  publicSlug,
  accentColor = tropicalTheme.colors.accent,
}) => {
  const { wishes, handleLike, handleSubmit } = useWishesData(publicSlug);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🌺");
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
      // Handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="wishes" className="py-24 md:py-32 px-6 relative overflow-hidden" style={{ backgroundColor: tropicalTheme.colors.background }}>
      {/* Decorative Tropical Palms background elements */}
      <div className="absolute top-10 right-10 text-4xl opacity-10 pointer-events-none">🌴</div>
      <div className="absolute bottom-10 left-10 text-4xl opacity-10 pointer-events-none">🌺</div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-white shadow-sm mb-4" style={{ borderColor: tropicalTheme.colors.border }}>
            <Sun className="w-3.5 h-3.5" style={{ color: tropicalTheme.colors.accent }} />
            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: tropicalTheme.colors.accent, fontFamily: tropicalTheme.typography.sans }}>
              Island Aloha Wishes
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl mb-3 font-medium" style={{ fontFamily: tropicalTheme.typography.display, color: tropicalTheme.colors.text }}>
            Lời Chúc Biển Đảo
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.textMuted }}>
            Gửi tới đôi uyên ương những lời chúc rực rỡ và ấm áp như ánh nắng nhiệt đới.
          </p>
        </div>

        {/* Wish Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] border shadow-[0_10px_40px_rgba(199,91,57,0.06)] mb-16"
          style={{ borderColor: tropicalTheme.colors.border }}
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.text }}>
                Họ và Tên của bạn
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="w-full px-5 py-3.5 rounded-2xl bg-[#F9F6F0] border focus:ring-2 outline-none text-sm transition-all text-[#2D5016]"
                style={{ fontFamily: tropicalTheme.typography.sans, borderColor: tropicalTheme.colors.border }}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.text }}>
                Chọn biểu tượng nhiệt đới
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 rounded-2xl text-lg flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? "text-white shadow-md scale-110"
                        : "bg-[#F9F6F0] border hover:bg-[#C75B39]/10"
                    }`}
                    style={{
                      backgroundColor: selectedEmoji === emoji ? tropicalTheme.colors.accent : undefined,
                      borderColor: tropicalTheme.colors.border,
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.text }}>
                Lời chúc của bạn
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Viết những lời chúc nồng thắm nhất..."
                className="w-full px-5 py-3.5 rounded-2xl bg-[#F9F6F0] border focus:ring-2 outline-none text-sm transition-all resize-none text-[#2D5016]"
                style={{ fontFamily: tropicalTheme.typography.sans, borderColor: tropicalTheme.colors.border }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-white text-xs font-semibold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
              style={{ backgroundColor: tropicalTheme.colors.accent, fontFamily: tropicalTheme.typography.sans }}
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
              className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              style={{ borderColor: tropicalTheme.colors.border }}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl p-2 rounded-2xl bg-[#F9F6F0]">
                    {wish.emoji || "🌺"}
                  </span>
                  <div>
                    <h4 className="font-medium text-lg" style={{ fontFamily: tropicalTheme.typography.display, color: tropicalTheme.colors.text }}>
                      {wish.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.textMuted }}>
                      {wish.timestamp}
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed italic mb-4" style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.text }}>
                  "{wish.message}"
                </p>
              </div>

              <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: tropicalTheme.colors.border }}>
                <span className="text-xs flex items-center gap-1" style={{ fontFamily: tropicalTheme.typography.sans, color: tropicalTheme.colors.textMuted }}>
                  <MessageSquare className="w-3.5 h-3.5" style={{ color: tropicalTheme.colors.accent }} />
                  Aloha Message
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(wish.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    wish.liked
                      ? "text-white shadow-sm"
                      : "bg-[#F9F6F0] border hover:bg-[#C75B39]/10"
                  }`}
                  style={{
                    backgroundColor: wish.liked ? tropicalTheme.colors.accent : undefined,
                    color: wish.liked ? "#ffffff" : tropicalTheme.colors.text,
                    borderColor: tropicalTheme.colors.border,
                    fontFamily: tropicalTheme.typography.sans,
                  }}
                >
                  <Heart className={`w-3.5 h-3.5 ${wish.liked ? "fill-white" : ""}`} style={{ color: wish.liked ? "#ffffff" : tropicalTheme.colors.accent }} />
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

export default TropicalWishes;
