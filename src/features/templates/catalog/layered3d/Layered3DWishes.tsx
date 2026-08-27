import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, MessageSquare, Sparkles } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";

interface Layered3DWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: any;
}

const EMOJI_OPTIONS = ["💌", "🌸", "🌿", "💐", "✨", "❤️", "🍃", "🎁", "💖", "🥂"];

export const Layered3DWishes: React.FC<Layered3DWishesProps> = ({
  publicSlug,
  accentColor = "#2e5a2e",
}) => {
  const { wishes, handleLike, handleSubmit } = useWishesData(publicSlug);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("💌");
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
    <section id="wishes" className="py-24 px-6 bg-[#f0ebd8]/40 font-serif">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#fcfbfa] flex items-center justify-center mx-auto mb-4 border border-[#e8ebd8] shadow-md">
            <MessageSquare className="w-5 h-5 text-[#2e5a2e]" />
          </div>
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#558155] font-bold font-sans">
            Lời Chúc Ngọt Ngào
          </h2>
          <h3 className="text-3xl font-normal text-[#193a19] drop-shadow-sm">
            Sổ Lưu Bút Tình Yêu
          </h3>
          <div className="w-12 h-[1px] bg-[#8eb08e] mx-auto mt-4" />
        </div>

        {/* Submission Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#fcfbfa] p-8 @sm:p-10 rounded-3xl border border-[#e8ebd8] shadow-[0_20px_50px_rgba(46,90,46,0.12)] mb-14 relative overflow-hidden"
        >
          <form onSubmit={onSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.2em] font-semibold text-[#193a19] mb-2">
                Họ và Tên của bạn
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Anh Tuấn & Chị Mai"
                className="w-full px-5 py-3.5 rounded-2xl bg-white border border-[#e8ebd8] focus:border-[#2e5a2e] focus:ring-2 focus:ring-[#8eb08e]/30 outline-none text-neutral-800 font-sans text-sm transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.2em] font-semibold text-[#193a19] mb-2">
                Biểu tượng may mắn
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? "bg-[#2e5a2e] text-white shadow-lg scale-110"
                        : "bg-white border border-[#e8ebd8] hover:bg-[#e8ebd8]/40"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.2em] font-semibold text-[#193a19] mb-2">
                Lời chúc của bạn
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Chúc hai bạn trăm năm hạnh phúc, cuộc sống tràn ngập niềm vui..."
                className="w-full px-5 py-3.5 rounded-2xl bg-white border border-[#e8ebd8] focus:border-[#2e5a2e] focus:ring-2 focus:ring-[#8eb08e]/30 outline-none text-neutral-800 font-sans text-sm transition-all resize-none shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#2e5a2e] text-white font-sans text-xs font-bold uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(46,90,46,0.25)] hover:bg-[#1f3f1f] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
              className="bg-[#fcfbfa] p-6 rounded-3xl border border-[#e8ebd8] shadow-[0_15px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between hover:shadow-[0_20px_40px_rgba(46,90,46,0.15)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-[#e8ebd8]/60 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-2xl bg-white border border-[#e8ebd8]">
                      {wish.emoji || "💌"}
                    </span>
                    <div>
                      <h4 className="text-lg font-normal text-[#193a19]">
                        {wish.name}
                      </h4>
                      <span className="text-[10px] font-sans uppercase tracking-wider text-neutral-400">
                        {wish.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-neutral-700 leading-relaxed italic mb-4">
                  "{wish.message}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#e8ebd8]/40 flex items-center justify-between font-sans">
                <span className="text-xs text-neutral-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#8eb08e]" />
                  Lời chúc mừng
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(wish.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    wish.liked
                      ? "bg-[#2e5a2e] text-white shadow-sm"
                      : "bg-[#e8ebd8]/50 text-[#193a19] hover:bg-[#8eb08e]/30"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      wish.liked ? "fill-white" : "text-[#2e5a2e]"
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

export default Layered3DWishes;
