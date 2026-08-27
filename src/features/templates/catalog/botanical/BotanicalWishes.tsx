import React, { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Send, Sparkles, Heart, MessageSquare } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";
import { botanicalTheme } from "./theme";

interface BotanicalWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: any;
}

const EMOJI_OPTIONS = ["🌿", "🍃", "🌸", "💐", "💚", "🕊️", "✨", "💌"];

export const BotanicalWishes: React.FC<BotanicalWishesProps> = ({
  publicSlug,
  accentColor = botanicalTheme.colors.accent,
}) => {
  const { wishes, handleLike, handleSubmit } = useWishesData(publicSlug);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🌿");
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
    <section id="wishes" className="py-24 md:py-32 px-6 border-t border-[#d3dcd4] bg-[#f9f7f1] relative overflow-hidden">
      {/* Decorative leaf motifs */}
      <div className="absolute top-8 left-6 opacity-15 pointer-events-none text-4xl">🌿</div>
      <div className="absolute bottom-8 right-6 opacity-15 pointer-events-none text-4xl">🍃</div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d3dcd4] bg-white text-[#4a5d4e] shadow-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#8a9b8e]" />
            <span className="text-xs uppercase tracking-widest font-medium" style={{ fontFamily: botanicalTheme.typography.sans }}>
              Sổ Lưu Bút Khu Vườn
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-medium text-[#4a5d4e]" style={{ fontFamily: botanicalTheme.typography.display }}>
            Lời Chúc Yêu Thương
          </h2>
          <p className="mt-3 text-sm text-[#8a9b8e] max-w-md mx-auto" style={{ fontFamily: botanicalTheme.typography.sans }}>
            Hãy gửi tặng những chiếc mầm yêu thương và lời chúc tốt đẹp nhất cho đôi bạn trẻ.
          </p>
        </div>

        {/* Wish Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-10 rounded-3xl border border-[#d3dcd4] shadow-[0_10px_40px_rgba(74,93,78,0.05)] mb-16"
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#4a5d4e] font-semibold mb-2" style={{ fontFamily: botanicalTheme.typography.sans }}>
                Tên của bạn
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên của bạn..."
                className="w-full px-5 py-3.5 rounded-2xl bg-[#f9f7f1]/60 border border-[#d3dcd4] focus:border-[#4a5d4e] focus:ring-2 focus:ring-[#8a9b8e]/20 outline-none text-[#4a5d4e] text-sm transition-all"
                style={{ fontFamily: botanicalTheme.typography.sans }}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#4a5d4e] font-semibold mb-2" style={{ fontFamily: botanicalTheme.typography.sans }}>
                Chọn biểu cảm khu vườn
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? "bg-[#4a5d4e] text-white shadow-md scale-110"
                        : "bg-[#f9f7f1] border border-[#d3dcd4] hover:bg-[#8a9b8e]/20"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#4a5d4e] font-semibold mb-2" style={{ fontFamily: botanicalTheme.typography.sans }}>
                Lời chúc gửi trao
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Viết lời chúc ý nghĩa của bạn tại đây..."
                className="w-full px-5 py-3.5 rounded-2xl bg-[#f9f7f1]/60 border border-[#d3dcd4] focus:border-[#4a5d4e] focus:ring-2 focus:ring-[#8a9b8e]/20 outline-none text-[#4a5d4e] text-sm transition-all resize-none"
                style={{ fontFamily: botanicalTheme.typography.sans }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#4a5d4e] text-white text-xs font-semibold uppercase tracking-widest hover:bg-[#394a3d] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
              style={{ fontFamily: botanicalTheme.typography.sans }}
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Đang gửi..." : "Gửi Lời Chúc"}
            </button>
          </form>
        </motion.div>

        {/* Wishes Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {wishes.map((wish, idx) => (
            <motion.div
              key={wish.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 4) * 0.08 }}
              className="bg-white p-6 rounded-3xl border border-[#d3dcd4] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl p-2 rounded-2xl bg-[#f9f7f1] border border-[#d3dcd4]/50">
                    {wish.emoji || "🌿"}
                  </span>
                  <div>
                    <h4 className="font-medium text-lg text-[#4a5d4e]" style={{ fontFamily: botanicalTheme.typography.display }}>
                      {wish.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider text-[#8a9b8e]" style={{ fontFamily: botanicalTheme.typography.sans }}>
                      {wish.timestamp}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[#4a5d4e]/90 leading-relaxed italic mb-4" style={{ fontFamily: botanicalTheme.typography.sans }}>
                  "{wish.message}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#d3dcd4]/40 flex items-center justify-between">
                <span className="text-xs text-[#8a9b8e] flex items-center gap-1" style={{ fontFamily: botanicalTheme.typography.sans }}>
                  <MessageSquare className="w-3.5 h-3.5 text-[#8a9b8e]" />
                  Mầm yêu thương
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(wish.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    wish.liked
                      ? "bg-[#4a5d4e] text-white shadow-sm"
                      : "bg-[#f9f7f1] text-[#4a5d4e] border border-[#d3dcd4] hover:bg-[#8a9b8e]/20"
                  }`}
                  style={{ fontFamily: botanicalTheme.typography.sans }}
                >
                  <Heart className={`w-3.5 h-3.5 ${wish.liked ? "fill-white" : "text-[#4a5d4e]"}`} />
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

export default BotanicalWishes;
