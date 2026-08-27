import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, MailOpen } from "lucide-react";

interface Props {
  groomName: string;
  brideName: string;
  weddingDate: string;
  guestName?: string;
  onOpen: () => void;
}

export const VintageEnvelopeReveal = ({
  groomName,
  brideName,
  weddingDate,
  guestName = "Quý Quan Khách",
  onOpen,
}: Props) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleBreakSeal = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 1100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A130E]/90 backdrop-blur-md p-4 selection:bg-[#9A7B56] selection:text-white"
    >
      {/* Subtle Warm Glow in Background */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#C5A880]/15 blur-[120px] pointer-events-none" />

      {/* Main Vintage Envelope Structure */}
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg bg-[#FAF7F2] p-8 sm:p-12 rounded-3xl border border-[#C5A880]/60 shadow-[0_30px_70px_rgba(0,0,0,0.5)] text-center overflow-hidden"
      >
        {/* Envelope Top Flap Shadow/Accents */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-[#C5A880]/30 to-transparent" />
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#C5A880]/60" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#C5A880]/60" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#C5A880]/60" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#C5A880]/60" />

        <div className="relative z-10 flex flex-col items-center">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.35em] text-[#9A7B56] font-semibold mb-2">
            LETTRE D'INVITATION • THIỆP MỜI HÔN LỄ
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-normal uppercase tracking-widest text-[#2C2523] mt-2 mb-1">
            {groomName} & {brideName}
          </h2>

          <p className="text-xs font-serif italic text-[#8C7A70] mb-6">
            {weddingDate} • Save The Date
          </p>

          {/* Guest Badge */}
          <div className="w-full max-w-xs py-2 px-4 rounded-xl bg-[#F3EDE2] border border-[#C5A880]/40 text-[#2C2523] text-xs font-serif mb-8 flex items-center justify-center gap-2 shadow-inner">
            <span className="text-[#9A7B56] text-[10px] font-mono uppercase font-bold">Kính gửi:</span>
            <span className="font-bold text-sm">{guestName}</span>
          </div>

          {/* 3D Wax Seal Button */}
          <div className="relative my-2 cursor-pointer group" onClick={handleBreakSeal}>
            <motion.div
              animate={isOpening ? { scale: 1.4, opacity: 0 } : { scale: [1, 1.06, 1] }}
              transition={isOpening ? { duration: 0.6 } : { duration: 2.8, repeat: Infinity }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#8B2635] via-[#721C24] to-[#450A0A] text-amber-200 border-2 border-amber-300/50 shadow-[0_15px_35px_rgba(114,28,36,0.45)] flex items-center justify-center group-hover:scale-110 transition-transform"
            >
              <div className="absolute inset-1.5 rounded-full border border-amber-200/40 pointer-events-none" />
              <div className="text-center leading-none">
                <span className="block font-serif text-2xl font-bold tracking-tighter">M&H</span>
                <span className="block text-[8px] font-mono tracking-widest uppercase mt-1 opacity-90">
                  {isOpening ? "ĐANG MỞ..." : "CHẠM ĐỂ MỞ"}
                </span>
              </div>
            </motion.div>
          </div>

          <p className="mt-8 text-xs font-serif italic text-[#6B5D55] flex items-center gap-1.5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            Chạm vào con dấu sáp đỏ để mở thiệp cưới
          </p>

          <button
            type="button"
            onClick={onOpen}
            className="mt-4 text-[11px] font-mono uppercase tracking-widest text-[#9A7B56] hover:text-[#2C2523] underline underline-offset-4 cursor-pointer transition-colors"
          >
            Bỏ qua & Xem trực tiếp →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
