import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, MessageSquare } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";

interface Flat2DWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: any;
}

const EMOJI_OPTIONS = ["💌", "🌸", "💍", "💐", "🥂", "❤️", "🎈", "🎁", "💖", "🎉"];

export const Flat2DWishes: React.FC<Flat2DWishesProps> = ({
  publicSlug,
  accentColor = "#FFD93D",
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
    <section id="wishes" className="py-28 px-6 bg-[#4ECDC4] border-b-4 border-black font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-3 bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-fit mx-auto">
          <div className="w-12 h-12 bg-[#FFD93D] border-4 border-black flex items-center justify-center mx-auto mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <MessageSquare className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-xs uppercase tracking-[0.3em] text-black font-black">Lời Chúc</h2>
          <h3 className="text-3xl font-black text-black">Sổ Lưu Bút Kỷ Niệm</h3>
        </div>

        {/* Submission Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 @md:p-10 mb-12"
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest font-black text-black mb-2">
                Họ và Tên của bạn
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Anh Tuấn & Chị Mai"
                className="w-full px-4 py-3 bg-[#FFD93D]/20 border-2 border-black font-bold text-black focus:outline-none focus:bg-[#FFD93D]/40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-black text-black mb-2">
                Chọn biểu cảm
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 border-2 border-black font-black text-lg flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? "bg-[#FF6B6B] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                        : "bg-white hover:bg-[#FFD93D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-black text-black mb-2">
                Lời chúc gửi cặp đôi
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Chúc hai bạn trăm năm hạnh phúc, vạn sự như ý..."
                className="w-full px-4 py-3 bg-[#FFD93D]/20 border-2 border-black font-bold text-black focus:outline-none focus:bg-[#FFD93D]/40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-[#FF6B6B] border-2 border-black text-black font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ff5252] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
              className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1.5 bg-[#FFD93D] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {wish.emoji || "💌"}
                    </span>
                    <div>
                      <h4 className="font-black text-base text-black uppercase">
                        {wish.name}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-neutral-500">
                        {wish.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-bold text-black leading-relaxed mb-4 bg-[#4ECDC4]/10 p-3 border-2 border-black">
                  "{wish.message}"
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-neutral-500">
                  Thiệp chúc mừng
                </span>
                <button
                  type="button"
                  onClick={() => handleLike(wish.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 border-2 border-black text-xs font-black transition-all ${
                    wish.liked
                      ? "bg-[#FF6B6B] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-[#FFD93D] text-black hover:bg-[#ffc107] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      wish.liked ? "fill-black text-black" : "text-black"
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

export default Flat2DWishes;
