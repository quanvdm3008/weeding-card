import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, Camera, Sparkles } from "lucide-react";
import { useWishesData } from "@/hooks/useWishesData";

interface Photo25DWishesProps {
  publicSlug?: string;
  accentColor?: string;
  theme?: any;
}

const EMOJI_OPTIONS = ["📷", "💌", "🌸", "💐", "✨", "❤️", "🥂", "🎁", "💖", "🎉"];

export const Photo25DWishes: React.FC<Photo25DWishesProps> = ({
  publicSlug,
  accentColor = "#A98054",
}) => {
  const { wishes, handleLike, handleSubmit } = useWishesData(publicSlug);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("📷");
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
    <section id="wishes" className="bg-[#EEE8DE] px-5 py-20 @md:px-10 @md:py-28 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] font-sans text-[#282520]">
      <div className="mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-16 space-y-2">
          <div className="w-12 h-12 rounded-full bg-white mx-auto flex items-center justify-center mb-3 shadow-[0_10px_25px_rgba(58,47,35,.15)] border border-[#CDB89D]">
            <Camera className="w-6 h-6 text-[#A98054]" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#A98054]">
            Lưu Bút Tri Ân
          </p>
          <h2 className="font-serif text-4xl @md:text-5xl text-[#292621]">
            Những Khung Hình Lời Chúc
          </h2>
          <div className="w-16 h-[2px] bg-[#A98054]/40 mx-auto mt-4" />
        </div>

        {/* Submission Form (Polaroid Style) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 @sm:p-10 shadow-[0_22px_55px_rgba(58,47,35,.25)] border-[10px] border-b-[36px] border-white max-w-3xl mx-auto mb-16 -rotate-1 hover:rotate-0 transition-transform duration-500"
        >
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#5F574E] mb-2 font-serif">
                Tên của bạn
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Anh Tuấn & Chị Mai"
                className="w-full px-4 py-3 rounded-md bg-[#F8F5EF] border border-[#CDB89D]/50 focus:border-[#A98054] focus:outline-none text-[#282520] text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#5F574E] mb-2 font-serif">
                Chọn biểu tượng
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 rounded-md text-lg flex items-center justify-center transition-all ${
                      selectedEmoji === emoji
                        ? "bg-[#A98054] text-white shadow-md scale-105"
                        : "bg-[#F8F5EF] border border-[#CDB89D]/40 hover:bg-[#EEE8DE]"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#5F574E] mb-2 font-serif">
                Lời chúc gửi cô dâu chú rể
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Gửi gắm những lời chúc tốt đẹp nhất cho chặng đường mới..."
                className="w-full px-4 py-3 rounded-md bg-[#F8F5EF] border border-[#CDB89D]/50 focus:border-[#A98054] focus:outline-none text-[#282520] text-sm transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-[#292621] text-white font-semibold text-xs uppercase tracking-widest rounded-sm hover:bg-[#A98054] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? "Đang gửi..." : "Gửi Lời Chúc"}
            </button>
          </form>
        </motion.div>

        {/* Wishes List (Photo Stack Cards) */}
        <div className="grid gap-8 sm:grid-cols-2">
          {wishes.map((wish, idx) => {
            const rotationDegree = (idx % 2 === 0 ? 1 : -1) * ((idx % 3) + 1);
            return (
              <motion.div
                key={wish.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 4) * 0.08 }}
                style={{ transform: `rotate(${rotationDegree}deg)` }}
                className="bg-white p-6 shadow-[0_15px_35px_rgba(58,47,35,.15)] border-[8px] border-b-[24px] border-white flex flex-col justify-between hover:rotate-0 transition-transform duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-dashed border-[#CDB89D]/40 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-1.5 bg-[#F8F5EF] rounded-md border border-[#CDB89D]/30">
                        {wish.emoji || "📷"}
                      </span>
                      <div>
                        <h4 className="font-serif text-lg font-bold text-[#292621]">
                          {wish.name}
                        </h4>
                        <span className="text-[10px] uppercase tracking-wider text-[#A98054]">
                          {wish.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-serif italic text-[#5F574E] leading-relaxed mb-4">
                    "{wish.message}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#A98054]" />
                    Lưu niệm
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLike(wish.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      wish.liked
                        ? "bg-[#A98054] text-white shadow-sm"
                        : "bg-[#F8F5EF] text-[#292621] hover:bg-[#CDB89D]/30"
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        wish.liked ? "fill-white text-white" : "text-[#A98054]"
                      }`}
                    />
                    <span>{wish.likes}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Photo25DWishes;
