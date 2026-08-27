import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Crown } from "lucide-react";
import type { RSVPVariantProps } from "@/components/wedding/RSVPSection";

export const RoyalRSVP = ({
  accentColor = "#c9a45a",
  form,
  updateForm,
  submitted,
  submitting,
  handleSubmit
}: RSVPVariantProps) => {
  return (
    <section id="rsvp" className="royal-ink px-4 py-32 text-[#fff8e9]">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[.75fr_1.25fr] md:items-center">
        <header>
          <p className="text-[10px] font-semibold uppercase tracking-[.35em]" style={{ color: accentColor }}>The royal guest list</p>
          <h2 className="mt-4 text-5xl leading-none md:text-6xl">Xác nhận<br />tham dự</h2>
          <p className="mt-6 max-w-sm font-sans text-sm leading-7 text-[#f7e7cc]/65">Xin quý khách dành một phút để hồi âm. Sự hiện diện của quý khách sẽ làm trọn vẹn buổi lễ.</p>
        </header>
        <div className="relative border border-[#c9a45a]/60 bg-[#fffaf1] p-3 text-[#2a1020] shadow-[0_30px_80px_rgba(0,0,0,.35)]">
          <div className="border border-[#c9a45a]/30 p-7 md:p-10">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
                  <Crown className="mx-auto mb-5 h-10 w-10" style={{ color: accentColor }} />
                  <h3 className="text-3xl">Đã ghi danh</h3>
                  <p className="mt-4 font-sans text-sm text-neutral-600">Cảm ơn quý khách đã hồi âm. Hẹn gặp tại buổi lễ!</p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-center text-[10px] font-bold uppercase tracking-[.28em] text-[#9c752e]">Royal RSVP card</p>
                  
                  <label className="block text-xs font-bold uppercase tracking-[.16em]">
                    Danh tính quý khách
                    <input required value={form.name} onChange={(event) => updateForm({ name: event.target.value })} className="mt-2 w-full border-b border-[#c9a45a]/50 bg-transparent py-3 text-base outline-none focus:border-[#2a1020]" placeholder="Nhập họ tên" />
                  </label>
                  
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="text-xs font-bold uppercase tracking-[.16em]">
                      Số khách
                      <select value={form.guests} onChange={(event) => updateForm({ guests: event.target.value })} className="mt-2 w-full border-b border-[#c9a45a]/50 bg-transparent py-3 text-base outline-none cursor-pointer appearance-none">
                        {[1, 2, 3, 4, 5].map((number) => <option key={number} value={number}>{number} người</option>)}
                      </select>
                    </label>
                    <label className="text-xs font-bold uppercase tracking-[.16em]">
                      Phản hồi
                      <select value={form.attending} onChange={(event) => updateForm({ attending: event.target.value as "yes" | "no" })} className="mt-2 w-full border-b border-[#c9a45a]/50 bg-transparent py-3 text-base outline-none cursor-pointer appearance-none">
                        <option value="yes">Sẽ tham dự</option>
                        <option value="no">Rất tiếc không thể</option>
                      </select>
                    </label>
                  </div>
                  
                  <AnimatePresence>
                    {form.attending === "yes" && (
                      <motion.label initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="block text-xs font-bold uppercase tracking-[.16em] overflow-hidden">
                        Lời nhắn
                        <textarea value={form.message} onChange={(event) => updateForm({ message: event.target.value })} rows={3} className="mt-2 w-full border border-[#c9a45a]/35 bg-transparent p-3 text-sm outline-none focus:border-[#2a1020] resize-none" placeholder="Gửi lời chúc đến cô dâu chú rể" />
                      </motion.label>
                    )}
                  </AnimatePresence>
                  
                  <div className="pt-2">
                    <button disabled={submitting || !form.name.trim()} type="submit" className="flex w-full items-center justify-center gap-2 bg-[#2a1020] py-4 text-xs font-bold uppercase tracking-[.2em] text-[#f7e7cc] transition hover:bg-[#c9a45a] hover:text-[#2a1020] disabled:opacity-50">
                      <Send className="h-4 w-4" />
                      {submitting ? "Đang gửi..." : "Đóng dấu xác nhận"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
