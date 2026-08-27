import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart } from "lucide-react";
import type { RSVPVariantProps } from "@/components/wedding/RSVPSection";
import { bohoTheme } from "../theme";

export const BohoRSVP = ({
  accentColor = bohoTheme.colors.accent,
  form,
  updateForm,
  submitted,
  submitting,
  handleSubmit
}: RSVPVariantProps) => {

  return (
    <div className="max-w-2xl mx-auto relative z-10 p-8 md:p-12 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-[0_20px_60px_-15px_rgba(200,150,120,0.15)] overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 rounded-tl-xl opacity-30" style={{ borderColor: accentColor }} />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 rounded-tr-xl opacity-30" style={{ borderColor: accentColor }} />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 rounded-bl-xl opacity-30" style={{ borderColor: accentColor }} />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 rounded-br-xl opacity-30" style={{ borderColor: accentColor }} />

      <div className="text-center mb-10 relative z-10">
        <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: bohoTheme.typography.display, color: bohoTheme.colors.text }}>
          Xác nhận tham dự
        </h2>
        <p className="text-sm tracking-[0.15em] uppercase font-medium" style={{ color: bohoTheme.colors.accentSecondary, fontFamily: bohoTheme.typography.sans }}>
          Cùng chung vui với chúng tôi
        </p>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 bg-white shadow-md border" style={{ borderColor: `${accentColor}30` }}>
              <Heart className="w-8 h-8 animate-pulse" fill={accentColor} style={{ color: accentColor }} />
            </div>
            <h3 className="text-2xl mb-2" style={{ fontFamily: bohoTheme.typography.display, color: bohoTheme.colors.text }}>
              Chân thành cảm ơn!
            </h3>
            <p style={{ color: bohoTheme.colors.accentSecondary, fontFamily: bohoTheme.typography.sans }}>
              Phản hồi của bạn đã được gửi đến cô dâu và chú rể.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-6 relative z-10"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-semibold ml-1" style={{ color: bohoTheme.colors.text }}>Tên của bạn</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-transparent focus:border-white shadow-inner outline-none transition-all"
                  style={{ fontFamily: bohoTheme.typography.sans, color: bohoTheme.colors.text }}
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest font-semibold ml-1" style={{ color: bohoTheme.colors.text }}>Số người tham dự</label>
                <select
                  value={form.guests}
                  onChange={(e) => updateForm({ guests: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-transparent focus:border-white shadow-inner outline-none transition-all cursor-pointer appearance-none"
                  style={{ fontFamily: bohoTheme.typography.sans, color: bohoTheme.colors.text }}
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>{num} người</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest font-semibold ml-1" style={{ color: bohoTheme.colors.text }}>Bạn sẽ đến chứ?</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateForm({ attending: "yes" })}
                  className={`py-4 rounded-2xl border-2 transition-all font-semibold tracking-wide ${
                    form.attending === "yes" ? "bg-white shadow-md" : "bg-white/40 border-transparent hover:bg-white/60"
                  }`}
                  style={{ 
                    borderColor: form.attending === "yes" ? accentColor : "transparent",
                    color: form.attending === "yes" ? accentColor : bohoTheme.colors.text
                  }}
                >
                  Có, chắc chắn!
                </button>
                <button
                  type="button"
                  onClick={() => updateForm({ attending: "no" })}
                  className={`py-4 rounded-2xl border-2 transition-all font-semibold tracking-wide ${
                    form.attending === "no" ? "bg-white shadow-md" : "bg-white/40 border-transparent hover:bg-white/60"
                  }`}
                  style={{ 
                    borderColor: form.attending === "no" ? bohoTheme.colors.accentSecondary : "transparent",
                    color: form.attending === "no" ? bohoTheme.colors.accentSecondary : bohoTheme.colors.text
                  }}
                >
                  Rất tiếc...
                </button>
              </div>
            </div>

            <AnimatePresence>
              {form.attending === "yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="block text-xs uppercase tracking-widest font-semibold ml-1 mt-4" style={{ color: bohoTheme.colors.text }}>Lời nhắn</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => updateForm({ message: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-transparent focus:border-white shadow-inner outline-none transition-all resize-none"
                    style={{ fontFamily: bohoTheme.typography.sans, color: bohoTheme.colors.text }}
                    placeholder="Gửi lời yêu thương đến cô dâu chú rể..."
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6">
              <button
                type="submit"
                disabled={submitting || !form.name.trim()}
                className="w-full py-4 rounded-2xl text-white font-semibold uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50"
                style={{ backgroundColor: accentColor, fontFamily: bohoTheme.typography.sans }}
              >
                {submitting ? "Đang gửi..." : "Gửi Xác Nhận"}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
