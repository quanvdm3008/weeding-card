import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, MessageCircle } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";

interface RomanticWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: any;
}

const EMOJI_OPTIONS = ["🤍", "✨", "🕊️", "🌿", "🥂", "💍"];

export const RomanticWishes: React.FC<RomanticWishesProps> = ({
  publicSlug,
  accentColor = "#CDB4B5",
}) => {
  const { wishes, handleLike, handleSubmit } = useWishesData(publicSlug);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🤍");
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

  const textDark = "#3A3534";
  const textMuted = "#8C8381";
  const borderLight = "#E8E1DE";

  return (
    <section className="py-32 px-6 relative overflow-hidden" style={{ color: textDark }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] font-medium mb-4 block" style={{ color: accentColor }}>
            Sổ Lưu Bút
          </span>
          <h2 className="font-display text-4xl sm:text-5xl italic font-light mb-6">
            Lời Chúc Trân Trọng
          </h2>
          <p className="font-sans text-xs tracking-wider max-w-md mx-auto opacity-70 leading-relaxed">
            Sự góp mặt của bạn là món quà ý nghĩa nhất. Hãy để lại vài dòng yêu thương cho ngày vui của chúng tôi.
          </p>
        </div>

        {/* Submission Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 sm:p-14 border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] mb-24 relative"
          style={{ borderColor: borderLight }}
        >
          {/* Decorative corner lines */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l" style={{ borderColor: borderLight }} />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r" style={{ borderColor: borderLight }} />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l" style={{ borderColor: borderLight }} />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r" style={{ borderColor: borderLight }} />

          <form onSubmit={onSubmit} className="space-y-10 relative z-10">
            <div>
              <label className="block text-[9px] font-sans uppercase tracking-[0.3em] font-medium mb-3" style={{ color: textMuted }}>
                Họ và Tên của bạn
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full bg-transparent border-b pb-3 outline-none font-display text-xl italic transition-colors focus:border-black placeholder:opacity-30"
                style={{ borderColor: borderLight }}
              />
            </div>

            <div>
              <label className="block text-[9px] font-sans uppercase tracking-[0.3em] font-medium mb-4" style={{ color: textMuted }}>
                Cảm xúc
              </label>
              <div className="flex flex-wrap gap-4">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className="w-10 h-10 flex items-center justify-center text-lg transition-all rounded-full"
                    style={{ 
                      backgroundColor: selectedEmoji === emoji ? accentColor : "transparent",
                      border: `1px solid ${selectedEmoji === emoji ? accentColor : borderLight}`,
                      opacity: selectedEmoji === emoji ? 1 : 0.6
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-sans uppercase tracking-[0.3em] font-medium mb-3" style={{ color: textMuted }}>
                Lời chúc
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Chúc hai bạn trăm năm hạnh phúc..."
                className="w-full bg-transparent border-b pb-3 outline-none font-display text-xl italic transition-colors focus:border-black placeholder:opacity-30 resize-none"
                style={{ borderColor: borderLight }}
              />
            </div>

            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-4 font-sans text-[10px] font-semibold uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 mx-auto disabled:opacity-50 hover:opacity-80"
                style={{ backgroundColor: textDark, color: "#fff" }}
              >
                {isSubmitting ? "Đang gửi..." : "Gửi Lời Chúc"}
                <Send className="w-3 h-3" />
              </button>
            </div>
          </form>
        </motion.div>

        {/* Wishes List */}
        <div className="space-y-6">
          {wishes.map((wish, idx) => (
            <motion.div
              key={wish.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 3) * 0.1 }}
              className="bg-transparent border-b py-8 flex flex-col sm:flex-row gap-6 sm:gap-10"
              style={{ borderColor: borderLight }}
            >
              <div className="shrink-0 text-center sm:text-left">
                <span className="text-3xl block mb-2">{wish.emoji || "🤍"}</span>
                <span className="text-[9px] font-sans uppercase tracking-widest block" style={{ color: textMuted }}>
                  {wish.timestamp}
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-sans text-[11px] uppercase tracking-[0.2em] font-medium mb-4">
                  {wish.name}
                </h4>
                <p className="font-display text-xl sm:text-2xl italic leading-relaxed opacity-90 mb-6">
                  "{wish.message}"
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <button
                    type="button"
                    onClick={() => handleLike(wish.id)}
                    className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest transition-all hover:opacity-70"
                    style={{ color: wish.liked ? accentColor : textMuted }}
                  >
                    <Heart className={`w-3.5 h-3.5 ${wish.liked ? "fill-current" : ""}`} />
                    {wish.likes} Thích
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RomanticWishes;
