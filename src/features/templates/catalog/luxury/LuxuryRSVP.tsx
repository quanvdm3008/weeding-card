import React from "react";
import { Check, Heart } from "lucide-react";
import type { RSVPVariantProps } from "@/components/wedding/RSVPSection";

export const LuxuryRSVP = ({
  accentColor = "#D5B36A",
  form,
  updateForm,
  submitted,
  submitting,
  handleSubmit
}: RSVPVariantProps) => {
  return (
    <section className="py-32 bg-[#050505] relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-felt.png')] opacity-20 pointer-events-none" />
      <div className="max-w-2xl mx-auto px-6 relative z-10 text-center">
        {!submitted ? (
          <div className="border border-[#D5B36A]/30 p-10 sm:p-16 bg-black/80 backdrop-blur-sm">
            <h2 className="font-display text-4xl text-[#FFF5D6] mb-4">Xác Nhận Tham Dự</h2>
            <p className="font-serif text-sm text-[#D5B36A]/80 mb-12">Sự hiện diện của bạn là niềm vinh hạnh của chúng tôi.</p>
            <form onSubmit={handleSubmit} className="space-y-10 text-left">
              <input type="text" name="name" placeholder="Quý danh" required
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                className="w-full bg-transparent border-b border-[#D5B36A]/40 focus:border-[#D5B36A] outline-none pb-2 font-serif text-lg text-[#FFF5D6] placeholder-[#D5B36A]/40 text-center" />
              <div className="flex justify-center gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="attending" value="yes" required className="hidden peer"
                    checked={form.attending === "yes"}
                    onChange={() => updateForm({ attending: "yes" })} />
                  <div className="w-4 h-4 border border-[#D5B36A]/50 peer-checked:bg-[#D5B36A] flex items-center justify-center transition-colors">
                    <Check className="w-3 h-3 text-black opacity-0 peer-checked:opacity-100" />
                  </div>
                  <span className="font-sans text-[11px] tracking-widest text-[#D5B36A]/80 group-hover:text-[#D5B36A] uppercase">Tham Dự</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="attending" value="no" required className="hidden peer"
                    checked={form.attending === "no"}
                    onChange={() => updateForm({ attending: "no" })} />
                  <div className="w-4 h-4 border border-[#D5B36A]/50 peer-checked:bg-[#D5B36A] flex items-center justify-center transition-colors">
                    <Check className="w-3 h-3 text-black opacity-0 peer-checked:opacity-100" />
                  </div>
                  <span className="font-sans text-[11px] tracking-widest text-[#D5B36A]/80 group-hover:text-[#D5B36A] uppercase">Không Thể</span>
                </label>
              </div>
              <input type="number" name="guests" placeholder="Số người tham dự (Gồm cả bạn)" required min="1" max="10"
                value={form.guests}
                onChange={(e) => updateForm({ guests: e.target.value })}
                className="w-full bg-transparent border-b border-[#D5B36A]/40 focus:border-[#D5B36A] outline-none pb-2 font-serif text-lg text-[#FFF5D6] placeholder-[#D5B36A]/40 text-center" />
              <button disabled={submitting || !form.name.trim()} type="submit" className="w-full py-4 bg-[#D5B36A] font-sans text-xs tracking-[0.3em] uppercase text-black font-bold hover:bg-[#FFF5D6] transition-colors mt-8 disabled:opacity-50">
                {submitting ? "Đang gửi..." : "Gửi Xác Nhận"}
              </button>
            </form>
          </div>
        ) : (
          <div className="border border-[#D5B36A]/30 p-16 bg-black text-center">
            <Heart className="w-12 h-12 text-[#D5B36A] mx-auto mb-6" />
            <h3 className="font-display text-3xl text-[#FFF5D6] mb-4">Cảm ơn bạn!</h3>
            <p className="font-serif text-[#D5B36A]/80">Chúng tôi đã nhận được xác nhận của bạn.</p>
          </div>
        )}
      </div>
    </section>
  );
};
