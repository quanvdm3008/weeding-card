import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Heart, MessageSquare } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";

interface KoreanWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: any;
}

const EMOJI_OPTIONS = ["🌸", "☁️", "🤍", "💌", "🕊️", "✨", "🌷", "🎀"];

export const KoreanWishes: React.FC<KoreanWishesProps> = ({
  publicSlug,
  accentColor = "#AEC6CF",
}) => {
  const { wishes, handleLike, handleSubmit } = useWishesData(publicSlug);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🌸");
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
    <section id="wishes" className="py-32 px-6 bg-[#FDFBF7] font-sans font-light tracking-wide text-[#5A514B]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#8C837C] mb-3">Sổ Lưu Bút Studio</p>
          <h2 className="text-3xl font-light tracking-widest text-[#5A514B]">Lời Chúc Chúc Phúc</h2>
          <div className="w-[1px] h-8 bg-[#AEC6CF] mx-auto mt-4" />
        </div>

        {/* Wish Submission Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_10px_30px_rgba(174,198,207,0.12)] border border-[#AEC6CF]/20 mb-16"
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#8C837C] font-medium mb-2">
                Họ và Tên
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="w-full px-5 py-3.5 rounded-2xl bg-[#FDFBF7] border border-[#AEC6CF]/30 focus:border-[#AEC6CF] focus:ring-2 focus:ring-[#AEC6CF]/20 outline-none text-[#5A514B] text-sm transition-all font-light"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#8C837C] font-medium mb-2">
                Chọn biểu tượng
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 rounded-2xl text-lg flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? "bg-[#AEC6CF] text-white shadow-sm scale-105"
                        : "bg-[#FDFBF7] border border-[#AEC6CF]/30 hover:bg-[#AEC6CF]/20"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#8C837C] font-medium mb-2">
                Lời chúc của bạn
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Gửi đến chú rể & cô dâu thông điệp ngọt ngào..."
                className="w-full px-5 py-3.5 rounded-2xl bg-[#FDFBF7] border border-[#AEC6CF]/30 focus:border-[#AEC6CF] focus:ring-2 focus:ring-[#AEC6CF]/20 outline-none text-[#5A514B] text-sm transition-all resize-none font-light leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#AEC6CF] text-white text-xs tracking-[0.2em] uppercase font-medium shadow-md shadow-[#AEC6CF]/30 hover:bg-[#97b3bd] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
              className="bg-white p-6 rounded-3xl border border-[#AEC6CF]/20 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl p-2 rounded-2xl bg-[#FDFBF7]">
                    {wish.emoji || "🌸"}
                  </span>
                  <div>
                    <h4 className="font-medium text-base text-[#5A514B] tracking-wide">
                      {wish.name}
                    </h4>
                    <span className="text-[10px] tracking-wider text-[#8C837C]">
                      {wish.timestamp}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#8C837C] leading-relaxed italic mb-4">
                  "{wish.message}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#AEC6CF]/15 flex items-center justify-between">
                <span className="text-[10px] text-[#8C837C] tracking-wider uppercase flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#AEC6CF]" />
                  Lời chúc mừng
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(wish.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    wish.liked
                      ? "bg-[#AEC6CF] text-white shadow-sm"
                      : "bg-[#FDFBF7] text-[#5A514B] border border-[#AEC6CF]/30 hover:bg-[#AEC6CF]/20"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${wish.liked ? "fill-white" : "text-[#AEC6CF]"}`} />
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

export default KoreanWishes;
