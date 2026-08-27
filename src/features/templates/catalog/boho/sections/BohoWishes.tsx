import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, Sparkles } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";
import { bohoTheme } from "../theme";

interface BohoWishesProps {
  publicSlug?: string;
  accentColor?: string;
}

const EMOJI_OPTIONS = ["🤍", "🌸", "🌿", "✨", "🕊️", "🥂"];

export const BohoWishes: React.FC<BohoWishesProps> = ({
  publicSlug,
  accentColor = bohoTheme.colors.accent,
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
      // Error handled in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-xl mx-auto bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-lg border border-white/50">
        <h3 className="text-3xl mb-6 text-center" style={{ fontFamily: bohoTheme.typography.display, color: bohoTheme.colors.text }}>
          Gửi lời chúc
        </h3>
        <form onSubmit={onSubmit} className="space-y-5">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên của bạn"
            className="w-full px-5 py-4 rounded-xl bg-white border border-transparent focus:border-white shadow-sm outline-none transition-all"
            style={{ fontFamily: bohoTheme.typography.sans, color: bohoTheme.colors.text }}
          />
          <div className="flex justify-center gap-3 py-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setSelectedEmoji(emoji)}
                className={`w-10 h-10 text-xl flex items-center justify-center rounded-full transition-all ${
                  selectedEmoji === emoji ? "bg-white shadow-md scale-110" : "hover:scale-110 opacity-70"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Viết lời chúc..."
            className="w-full px-5 py-4 rounded-xl bg-white border border-transparent focus:border-white shadow-sm outline-none transition-all resize-none"
            style={{ fontFamily: bohoTheme.typography.sans, color: bohoTheme.colors.text }}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl text-white font-medium uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: accentColor, fontFamily: bohoTheme.typography.sans }}
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Đang gửi..." : "Gửi đi"}
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto columns-1 md:columns-2 gap-6 space-y-6">
        {wishes.map((wish, idx) => (
          <motion.div
            key={wish.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="break-inside-avoid bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/50 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-12 h-12" style={{ color: accentColor }} />
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{wish.emoji || "🤍"}</span>
              <div>
                <h4 className="font-semibold" style={{ color: bohoTheme.colors.text, fontFamily: bohoTheme.typography.sans }}>
                  {wish.name}
                </h4>
                <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: bohoTheme.colors.accentSecondary }}>
                  {wish.timestamp}
                </span>
              </div>
            </div>
            <p className="leading-relaxed mb-6 italic" style={{ color: bohoTheme.colors.text, fontFamily: bohoTheme.typography.script }}>
              "{wish.message}"
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleLike(wish.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{ 
                  backgroundColor: wish.liked ? accentColor : "rgba(255,255,255,0.8)",
                  color: wish.liked ? "white" : bohoTheme.colors.accentSecondary,
                  boxShadow: wish.liked ? `0 2px 10px ${accentColor}40` : "none"
                }}
              >
                <Heart className={`w-3.5 h-3.5 ${wish.liked ? "fill-white" : ""}`} />
                {wish.likes}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
