import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Heart, MessageSquare } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";
import { editorialTheme } from "./theme";

interface EditorialWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: any;
}

const EMOJI_OPTIONS = ["🖋️", "🖤", "✨", "📜", "💌", "🕊️", "🥂", "🤍"];

export const EditorialWishes: React.FC<EditorialWishesProps> = ({
  publicSlug,
  accentColor = editorialTheme.colors.accent,
}) => {
  const { wishes, handleLike, handleSubmit } = useWishesData(publicSlug);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🖋️");
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
    <section id="wishes" className="py-24 md:py-32 px-6 border-t" style={{ backgroundColor: editorialTheme.colors.background, borderColor: editorialTheme.colors.border }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.4em] font-semibold mb-3" style={{ fontFamily: editorialTheme.typography.sans, color: editorialTheme.colors.accent }}>
            Editorial Guestbook
          </p>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-wider text-[#36312D]" style={{ fontFamily: editorialTheme.typography.display }}>
            Messages & Wishes
          </h2>
          <div className="w-16 h-[1px] bg-[#36312D] mx-auto mt-6" />
        </div>

        {/* Editorial Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-12 border shadow-sm mb-16"
          style={{ borderColor: editorialTheme.colors.border }}
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2" style={{ fontFamily: editorialTheme.typography.sans, color: editorialTheme.colors.text }}>
                Full Name / Title
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-5 py-3.5 bg-[#Fdfbf7] border focus:border-[#36312D] outline-none text-sm transition-all text-[#36312D]"
                style={{ fontFamily: editorialTheme.typography.sans, borderColor: editorialTheme.colors.border }}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2" style={{ fontFamily: editorialTheme.typography.sans, color: editorialTheme.colors.text }}>
                Select Monogram Mark
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 border text-lg flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? "bg-[#36312D] text-white border-[#36312D]"
                        : "bg-[#Fdfbf7] hover:bg-[#a89172]/20"
                    }`}
                    style={{ borderColor: editorialTheme.colors.border }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-semibold mb-2" style={{ fontFamily: editorialTheme.typography.sans, color: editorialTheme.colors.text }}>
                Editorial Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave your thoughtful note for the newlyweds..."
                className="w-full px-5 py-3.5 bg-[#Fdfbf7] border focus:border-[#36312D] outline-none text-sm transition-all resize-none text-[#36312D]"
                style={{ fontFamily: editorialTheme.typography.sans, borderColor: editorialTheme.colors.border }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-4 bg-[#36312D] text-white text-xs font-bold uppercase tracking-[0.25em] hover:bg-[#a89172] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              style={{ fontFamily: editorialTheme.typography.sans }}
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Submitting..." : "Send Note"}
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
              transition={{ delay: (idx % 4) * 0.08 }}
              className="bg-white p-6 border shadow-sm flex flex-col justify-between hover:border-[#36312D] transition-colors"
              style={{ borderColor: editorialTheme.colors.border }}
            >
              <div>
                <div className="flex items-center gap-3 mb-3 pb-3 border-b" style={{ borderColor: editorialTheme.colors.border }}>
                  <span className="text-xl p-2 bg-[#Fdfbf7] border" style={{ borderColor: editorialTheme.colors.border }}>
                    {wish.emoji || "🖋️"}
                  </span>
                  <div>
                    <h4 className="font-bold text-lg text-[#36312D]" style={{ fontFamily: editorialTheme.typography.display }}>
                      {wish.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-widest text-[#8c8784]" style={{ fontFamily: editorialTheme.typography.sans }}>
                      {wish.timestamp}
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed italic mb-4 text-[#36312D]/90" style={{ fontFamily: editorialTheme.typography.sans }}>
                  "{wish.message}"
                </p>
              </div>

              <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: editorialTheme.colors.border }}>
                <span className="text-[11px] uppercase tracking-wider text-[#8c8784] flex items-center gap-1" style={{ fontFamily: editorialTheme.typography.sans }}>
                  <MessageSquare className="w-3.5 h-3.5 text-[#a89172]" />
                  Guest Note
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(wish.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-all border ${
                    wish.liked
                      ? "bg-[#36312D] text-white border-[#36312D]"
                      : "bg-[#Fdfbf7] text-[#36312D] hover:bg-[#a89172]/20"
                  }`}
                  style={{ borderColor: editorialTheme.colors.border }}
                >
                  <Heart className={`w-3.5 h-3.5 ${wish.liked ? "fill-white" : "text-[#36312D]"}`} />
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

export default EditorialWishes;
