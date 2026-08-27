import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, MessageCircle } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";
import { modernTheme } from "./theme";

interface ModernWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: any;
}

const EMOJI_OPTIONS = ["🤍", "🖤", "🥂", "✉️", "✨", "💍", "🎉", "🕊️"];

export const ModernWishes: React.FC<ModernWishesProps> = ({
  publicSlug,
  accentColor = modernTheme.colors.accent,
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
    <section className="py-24 md:py-32 px-6" style={{ backgroundColor: modernTheme.colors.background }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="text-xs uppercase tracking-[0.4em] font-bold mb-4"
            style={{ color: accentColor, fontFamily: modernTheme.typography.sans }}
          >
            Guest Book
          </p>
          <h2
            className="text-4xl md:text-6xl font-medium"
            style={{ fontFamily: modernTheme.typography.display, color: modernTheme.colors.text }}
          >
            Messages For Us.
          </h2>
        </div>

        {/* Wish Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 md:p-12 mb-16 border"
          style={{
            backgroundColor: modernTheme.colors.surface,
            borderColor: modernTheme.colors.border,
          }}
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] font-bold mb-3 text-neutral-400">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-5 py-4 bg-white border border-neutral-300 focus:border-black outline-none text-black text-sm tracking-wide transition-all"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.3em] font-bold mb-3 text-neutral-400">
                Select Emoji
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 border text-base flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? "bg-black text-white border-black"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-black"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.3em] font-bold mb-3 text-neutral-400">
                Your Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your wishes for the couple..."
                className="w-full px-5 py-4 bg-white border border-neutral-300 focus:border-black outline-none text-black text-sm tracking-wide transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>

        {/* Wishes List */}
        <div className="grid gap-6 md:grid-cols-2">
          {wishes.map((wish, idx) => (
            <motion.div
              key={wish.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 4) * 0.1 }}
              className="p-6 border bg-white flex flex-col justify-between"
              style={{ borderColor: modernTheme.colors.border }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2 bg-neutral-100 border border-neutral-200">
                      {wish.emoji || "🤍"}
                    </span>
                    <div>
                      <h4 className="text-lg font-medium text-black">
                        {wish.name}
                      </h4>
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                        {wish.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed font-light mb-6">
                  "{wish.message}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                  <MessageCircle className="w-3.5 h-3.5" />
                  WISH
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(wish.id)}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs tracking-wider border transition-all ${
                    wish.liked
                      ? "bg-black text-white border-black font-semibold"
                      : "bg-white text-black border-neutral-300 hover:border-black"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${wish.liked ? "fill-white text-white" : "text-black"}`} />
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

export default ModernWishes;
