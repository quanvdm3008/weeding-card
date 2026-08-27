import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, MessageCircle } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";

interface MinimalWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: any;
}

const EMOJI_OPTIONS = ["✉️", "🤍", "🌸", "💌", "🕊️", "✨", "💍", "🎉"];

export const MinimalWishes: React.FC<MinimalWishesProps> = ({
  publicSlug,
  accentColor = "#000000",
}) => {
  const { wishes, handleLike, handleSubmit } = useWishesData(publicSlug);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("✉️");
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
    <section className="py-28 px-8 md:px-24 bg-white font-sans text-neutral-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-[11px] uppercase tracking-[0.4em] text-neutral-400 font-medium">
            Lời chúc
          </h2>
          <h3 className="text-3xl sm:text-4xl font-light tracking-tight text-neutral-800 mt-3">
            Gửi lời chúc mừng
          </h3>
        </div>

        {/* Wish Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#FAFAFA] p-8 md:p-10 mb-16 shadow-sm border border-neutral-100"
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-medium text-neutral-500 mb-2">
                Tên của bạn
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên..."
                className="w-full px-4 py-3.5 bg-white border border-neutral-200 focus:border-neutral-800 outline-none text-neutral-800 text-sm font-light transition-all"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-medium text-neutral-500 mb-2">
                Biểu tượng
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 text-base flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? "bg-neutral-900 text-white shadow-sm"
                        : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] font-medium text-neutral-500 mb-2">
                Lời chúc
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Viết lời chúc yêu thương dành cho cô dâu chú rể..."
                className="w-full px-4 py-3.5 bg-white border border-neutral-200 focus:border-neutral-800 outline-none text-neutral-800 text-sm font-light transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 text-white font-medium text-xs uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Đang gửi..." : "Gửi Lời Chúc"}
            </button>
          </form>
        </motion.div>

        {/* Wishes List */}
        <div className="space-y-4">
          {wishes.map((wish, idx) => (
            <motion.div
              key={wish.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 4) * 0.08 }}
              className="bg-[#FAFAFA] p-6 border border-neutral-100 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl p-2 bg-white border border-neutral-200">
                      {wish.emoji || "✉️"}
                    </span>
                    <div>
                      <h4 className="text-base font-medium text-neutral-800">
                        {wish.name}
                      </h4>
                      <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                        {wish.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed font-light mb-4">
                  "{wish.message}"
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/40 flex items-center justify-between">
                <span className="text-xs text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-neutral-400" />
                  Lời chúc
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(wish.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs tracking-wider transition-all ${
                    wish.liked
                      ? "bg-neutral-900 text-white font-medium"
                      : "bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${wish.liked ? "fill-white text-white" : "text-neutral-600"}`} />
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

export default MinimalWishes;
