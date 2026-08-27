import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feather, Heart, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  groomName: string;
  brideName: string;
  message?: string;
  weddingDate?: string;
}

export const VintageInteractiveLetter = ({
  groomName,
  brideName,
  message = "Chúng mình tin rằng tình yêu đích thực là cuộc hội ngộ đẹp đẽ nhất của định mệnh. Cảm ơn bạn đã luôn là một phần trân quý trên hành trình hạnh phúc của hai chúng mình.",
  weddingDate = "14/02/2027",
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative max-w-3xl mx-auto my-16 px-4">
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9A7B56] font-semibold">
          LETTRE D'AMOUR
        </span>
        <h3 className="text-2xl sm:text-4xl font-normal uppercase tracking-wider text-[#2C2523]">
          TÂM THƯ GỬI QUAN KHÁCH
        </h3>
        <p className="text-xs sm:text-sm font-serif italic text-[#6B5D55]">
          Chạm vào con dấu sáp niêm phong để mở bức thư tình yêu
        </p>
      </div>

      {/* Closed Envelope & Seal (when not open) */}
      {!isOpen && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="cursor-pointer max-w-lg mx-auto bg-[#FDFBF7] p-8 sm:p-12 rounded-3xl border border-[#C5A880]/60 shadow-[0_20px_50px_rgba(154,123,86,0.15)] relative overflow-hidden group text-center"
        >
          {/* Subtle Gold Hairline Flap Lines */}
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/60 to-transparent" />
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C5A880]/60" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C5A880]/60" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C5A880]/60" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#C5A880]/60" />

          <div className="relative z-10 flex flex-col items-center py-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#9A7B56] mb-2 font-mono">
              CONFIDENTIEL • AVEC AMOUR
            </span>
            <p className="text-lg sm:text-xl font-normal uppercase text-[#2C2523] tracking-widest mb-8">
              Kính gửi Quý Khách Trân Quý
            </p>

            {/* Glowing Deep Wine Wax Seal */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#8B2635] via-[#721C24] to-[#450A0A] text-amber-200 border-2 border-amber-300/40 shadow-[0_12px_28px_rgba(114,28,36,0.4)] flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform"
            >
              <div className="absolute inset-1 rounded-full border border-amber-200/30 pointer-events-none" />
              <div className="text-center leading-none">
                <span className="block font-serif text-lg font-bold tracking-tighter">M&H</span>
                <span className="block text-[8px] font-mono tracking-widest uppercase mt-0.5 opacity-80">OUVRIR</span>
              </div>
            </motion.div>

            <span className="mt-6 text-xs text-[#9A7B56] font-semibold tracking-widest uppercase flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" /> BẤM ĐỂ MỞ NIÊM PHONG VÀ XEM THƯ
            </span>
          </div>
        </motion.div>
      )}

      {/* Unfolded Full Letter (when open) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative bg-[#FDFBF7] p-8 sm:p-14 rounded-3xl border border-[#C5A880]/60 shadow-[0_25px_60px_rgba(154,123,86,0.18)] max-w-2xl mx-auto text-left"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF7F2] text-[#6B5D55] hover:text-[#2C2523] hover:bg-[#F3EDE2] transition-colors shadow-sm cursor-pointer"
              title="Gấp lại thư"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Letter Header */}
            <div className="flex items-center justify-between border-b border-[#C5A880]/30 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#9A7B56] font-semibold">
                  HÔN LỄ TRỌNG THỂ • {weddingDate}
                </span>
                <h4 className="text-xl sm:text-2xl font-normal uppercase text-[#2C2523] mt-1 tracking-wider">
                  Thư Ngỏ Gửi Người Thương Mến
                </h4>
              </div>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#8B2635] to-[#721C24] text-amber-200 border border-amber-300/40 flex items-center justify-center text-xs font-serif font-bold shrink-0 shadow-md">
                M&H
              </div>
            </div>

            {/* Letter Body */}
            <div className="space-y-4 text-xs sm:text-sm font-serif leading-loose text-[#3D271D]">
              <p className="indent-6 first-letter:text-3xl first-letter:font-bold first-letter:text-[#9A7B56] first-letter:mr-1 font-normal">
                Kính gửi những người bạn, người thân thương quý nhất của chúng mình,
              </p>
              <p className="italic text-[#5C4D44]">
                "{message}"
              </p>
              <p>
                Sự hiện diện và lời chúc phúc của bạn trong ngày vui này là món quà vô giá nhất đối với chúng mình. Xin chân thành cảm ơn tình cảm ấm áp mà bạn đã luôn dành trọn cho hai đứa suốt những năm tháng qua.
              </p>
            </div>

            {/* Signature Area */}
            <div className="mt-8 pt-6 border-t border-dashed border-[#C5A880]/40 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A7B56] block font-semibold">
                  ĐỒNG KÝ TÊN VỚI TÌNH YÊU
                </span>
                <p className="text-lg sm:text-xl font-normal text-[#2C2523] mt-1 tracking-wider">
                  {groomName} & {brideName}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="text-xs font-serif border-[#C5A880]/60 hover:bg-[#F3EDE2] text-[#2C2523] cursor-pointer rounded-full px-4"
              >
                Gấp lại thư
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
