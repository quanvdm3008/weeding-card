import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shirt, Heart, AlertCircle, Check } from "lucide-react";

interface ColorItem {
  name: string;
  sub: string;
  hex: string;
}

interface Props {
  colors?: ColorItem[];
}

export const InteractiveDressCode: React.FC<Props> = ({
  colors = [
    { name: "Nâu Espresso", hex: "#3D271D", sub: "Deep Espresso" },
    { name: "Cà Phê Latte", hex: "#8B5A2B", sub: "Warm Latte" },
    { name: "Vàng Champagne", hex: "#C5A880", sub: "Vintage Gold" },
    { name: "Trắng Ngà", hex: "#FAF7F2", sub: "Ivory Silk" },
  ],
}) => {
  const [activeTab, setActiveTab] = useState<"female" | "male">("female");

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4 select-none">
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#C5A880]/60 p-6 sm:p-10 shadow-[0_20px_50px_rgba(154,123,86,0.12)] text-center relative overflow-hidden">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#C5A880]/50 text-[#9A7B56] text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>TRANG PHỤC GỢI Ý (DRESS CODE)</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-serif font-normal uppercase tracking-wider text-[#2C2523] mb-2">
          BẢNG MÀU RETRO VINTAGE & CHAMPAGNE SILK
        </h3>
        <p className="text-xs sm:text-sm text-[#6B5D55] italic mb-8 max-w-md mx-auto">
          Để những khung hình kỷ niệm thêm phần hòa hợp và đồng điệu, kính mời Quý Khách diện trang phục theo bảng màu dưới đây.
        </p>

        {/* 🎨 Color Swatches */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10">
          {colors.map((color, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-[#C5A880]/60 shadow-[0_8px_20px_rgba(154,123,86,0.15)] mb-3 transform hover:scale-105 transition-transform"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs font-semibold text-[#2C2523] uppercase">
                {color.name}
              </span>
              <span className="text-[10px] text-[#8C7A70] font-mono">{color.sub}</span>
            </div>
          ))}
        </div>

        {/* 👗 Gender Tabs */}
        <div className="inline-flex p-1 rounded-full bg-[#EFE8DE] border border-[#C5A880]/40 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("female")}
            className={`px-6 py-2 rounded-full text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "female"
                ? "bg-[#9A7B56] text-[#FAF7F2] shadow-sm"
                : "text-[#6B5D55] hover:text-[#2C2523]"
            }`}
          >
            Quý Cô (Ladies)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("male")}
            className={`px-6 py-2 rounded-full text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "male"
                ? "bg-[#9A7B56] text-[#FAF7F2] shadow-sm"
                : "text-[#6B5D55] hover:text-[#2C2523]"
            }`}
          >
            Quý Ông (Gentlemen)
          </button>
        </div>

        {/* 👔 Style Suggestions */}
        <div className="max-w-2xl mx-auto text-left">
          {activeTab === "female" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#C5A880]/40 space-y-2">
                <div className="font-serif font-bold text-[#2C2523] text-sm flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#9A7B56]" /> ĐẦM DẠ HỘI & VÁY LỤA
                </div>
                <p className="text-xs text-[#6B5D55] leading-relaxed">
                  Váy lụa satin tông Champagne, đầm xòe màu cà phê Latte hoặc ren cổ điển Pháp trang nhã.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#C5A880]/40 space-y-2">
                <div className="font-serif font-bold text-[#2C2523] text-sm flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#9A7B56]" /> PHỤ KIỆN ĐI KÈM
                </div>
                <p className="text-xs text-[#6B5D55] leading-relaxed">
                  Trang sức ngọc trai, khuyên tai ánh kim, túi xách mini hoặc giày cao gót tông nude/beige.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#C5A880]/40 space-y-2">
                <div className="font-serif font-bold text-[#2C2523] text-sm flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#9A7B56]" /> SUIT & SƠ MI LỊCH LÃM
                </div>
                <p className="text-xs text-[#6B5D55] leading-relaxed">
                  Âu phục tông nâu espresso, blazer xám ghi hoặc sơ mi kem kết hợp quần âu thanh lịch.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#C5A880]/40 space-y-2">
                <div className="font-serif font-bold text-[#2C2523] text-sm flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#9A7B56]" /> PHỤ KIỆN QUÝ ÔNG
                </div>
                <p className="text-xs text-[#6B5D55] leading-relaxed">
                  Giày tây da màu nâu da bò, cà vạt lụa hoặc nơ cổ tông vàng vintage đồng điệu.
                </p>
              </div>
            </div>
          )}

          {/* Polite Notice */}
          <div className="mt-6 p-4 rounded-2xl bg-[#FAF7F2] border border-[#C5A880]/40 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#9A7B56] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#6B5D55] italic leading-relaxed">
              <strong>Lưu ý nhỏ:</strong> Quý khách vui lòng hạn chế diện trang phục màu trắng tinh khôi để nhường trọn vẹn sự tỏa sáng cho Cô Dâu trong ngày trọng đại.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InteractiveDressCode;
