import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Car,
  Compass,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  venue: string;
  address: string;
  accentColor?: string;
  lat?: number;
  lng?: number;
}

export const SmartNavigationRide: React.FC<Props> = ({
  venue,
  address,
  accentColor = "#9A7B56",
}) => {
  const [showParkingGuide, setShowParkingGuide] = useState(false);

  const query = encodeURIComponent(`${venue} ${address}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${query}`;

  // Deeplink Grab & Be
  const grabUrl = `https://r.grab.com/drive?destination=${query}`;
  const beUrl = `https://be.com.vn/`;

  return (
    <div className="w-full max-w-3xl mx-auto my-10 px-4 select-none">
      <div className="bg-[#FDFBF7] rounded-3xl border border-[#C5A880]/60 p-6 sm:p-8 shadow-[0_20px_50px_rgba(154,123,86,0.12)] text-center relative overflow-hidden">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#C5A880]/50 text-[#9A7B56] text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
          <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>CHỈ ĐƯỜNG & ĐẶT XE THÔNG MINH</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-normal uppercase tracking-wider text-[#2C2523] mb-1">
          {venue}
        </h3>
        <p className="text-xs sm:text-sm text-[#6B5D55] italic mb-6 max-w-lg mx-auto">
          {address}
        </p>

        {/* 🚗 1-Click Ride & Navigation Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-6">
          {/* Google Maps */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#C5A880]/50 text-[#2C2523] hover:bg-[#F3EDE2] hover:border-[#9A7B56] transition-all shadow-sm group"
          >
            <div className="w-9 h-9 rounded-full bg-[#EFE8DE] flex items-center justify-center text-[#9A7B56] mb-2 group-hover:scale-110 transition-transform">
              <Navigation className="w-4 h-4 fill-current" />
            </div>
            <span className="text-xs font-serif font-bold">Google Maps</span>
            <span className="text-[10px] text-[#8C7A70] font-mono">Dẫn đường</span>
          </a>

          {/* Apple Maps */}
          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#C5A880]/50 text-[#2C2523] hover:bg-[#F3EDE2] hover:border-[#9A7B56] transition-all shadow-sm group"
          >
            <div className="w-9 h-9 rounded-full bg-[#EFE8DE] flex items-center justify-center text-[#9A7B56] mb-2 group-hover:scale-110 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-xs font-serif font-bold">Apple Maps</span>
            <span className="text-[10px] text-[#8C7A70] font-mono">Dành cho iPhone</span>
          </a>

          {/* Grab */}
          <a
            href={grabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#E8F5E9] border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-all shadow-sm group"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Car className="w-4 h-4" />
            </div>
            <span className="text-xs font-serif font-bold">Đặt Xe Grab</span>
            <span className="text-[10px] text-emerald-700 font-mono">1-Chạm mở App</span>
          </a>

          {/* Be */}
          <a
            href={beUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#FFF9C4] border border-amber-300 text-amber-900 hover:bg-amber-100 transition-all shadow-sm group"
          >
            <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Car className="w-4 h-4" />
            </div>
            <span className="text-xs font-serif font-bold">Đặt Xe Be</span>
            <span className="text-[10px] text-amber-700 font-mono">Ưu đãi chuyến đi</span>
          </a>
        </div>

        {/* 🅿️ Parking Guide Toggle Button */}
        <button
          type="button"
          onClick={() => setShowParkingGuide(!showParkingGuide)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF7F2] border border-[#C5A880]/60 text-[#9A7B56] text-xs font-serif font-bold uppercase tracking-wider hover:bg-[#F3EDE2] transition-all cursor-pointer"
        >
          <Info className="w-4 h-4" />
          <span>{showParkingGuide ? "Ẩn Hướng Dẫn Đỗ Xe" : "Xem Hướng Dẫn Vị Trí Đỗ Xe & Thang Máy"}</span>
        </button>

        {/* Parking & Elevator Accordion Content */}
        <AnimatePresence>
          {showParkingGuide && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-dashed border-[#C5A880]/40 text-left"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#6B5D55]">
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C5A880]/40 space-y-2">
                  <div className="font-bold text-[#2C2523] flex items-center gap-1.5 uppercase font-mono tracking-wider text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    BÃI ĐỖ XE MÁY & Ô TÔ
                  </div>
                  <p>• <strong>Xe máy:</strong> Hầm B1 (Có nhân viên bảo vệ đón và phát vé tự động).</p>
                  <p>• <strong>Ô tô:</strong> Hầm B2 & Bãi đỗ xe ngoài trời cạnh sảnh chính.</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#C5A880]/40 space-y-2">
                  <div className="font-bold text-[#2C2523] flex items-center gap-1.5 uppercase font-mono tracking-wider text-[11px]">
                    <CheckCircle2 className="w-4 h-4 text-[#9A7B56]" />
                    LỐI THANG MÁY LÊN SẢNH TIỆC
                  </div>
                  <p>• Từ hầm B1/B2 đi theo biển chỉ dẫn thang máy số 1 & 2 lên thẳng Tầng 3 - Sảnh Grand Ballroom.</p>
                  <p>• Bàn lễ tân đón khách và chụp ảnh photobooth đặt ngay trước cửa thang máy.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default SmartNavigationRide;
