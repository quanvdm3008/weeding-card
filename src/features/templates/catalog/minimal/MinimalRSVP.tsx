import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight, Check } from "lucide-react";
import type { RSVPVariantProps } from "@/components/wedding/RSVPSection";

export const MinimalRSVP = ({
  date,
  form,
  updateForm,
  submitted,
  submitting,
  handleSubmit
}: RSVPVariantProps & { date?: string }) => {

  return (
    <section className="py-32 px-8 md:px-24 bg-[#FFFFFF] font-sans text-neutral-900">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.45em] text-neutral-400 mb-4">RSVP</p>
          <h2 className="text-[11px] uppercase tracking-[0.4em] text-neutral-400 font-medium mb-4">
            Xác nhận tham dự
          </h2>
          <h3 className="text-4xl md:text-5xl font-light tracking-tighter text-neutral-900 mb-6">
            Rất mong được đón tiếp
          </h3>
          <p className="text-sm font-light text-neutral-500 tracking-wide">
            Vui lòng phản hồi trước ngày {date?.split("-").reverse().join(".")}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-12 border border-neutral-200"
            >
              <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-white w-5 h-5" />
              </div>
              <h4 className="text-2xl font-light tracking-tight mb-2">Cảm ơn bạn</h4>
              <p className="text-neutral-500 font-light text-sm">Phản hồi của bạn đã được ghi nhận.</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateForm({ attending: "yes" })}
                  className={`py-4 px-6 border transition-all text-sm tracking-widest uppercase font-medium ${
                    form.attending === "yes"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-400 hover:border-neutral-900 hover:text-neutral-900"
                  }`}
                >
                  Tham dự
                </button>
                <button
                  type="button"
                  onClick={() => updateForm({ attending: "no" })}
                  className={`py-4 px-6 border transition-all text-sm tracking-widest uppercase font-medium ${
                    form.attending === "no"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-400 hover:border-neutral-900 hover:text-neutral-900"
                  }`}
                >
                  Rất tiếc
                </button>
              </div>

              <AnimatePresence>
                {form.attending === "yes" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-8 overflow-hidden pt-8"
                  >
                    <div>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => updateForm({ name: e.target.value })}
                        placeholder="Tên khách mời *"
                        className="w-full bg-transparent border-b border-neutral-200 focus:border-neutral-900 py-4 px-0 outline-none text-neutral-900 placeholder:text-neutral-400 font-light transition-colors text-lg"
                      />
                    </div>
                    <div>
                      <select
                        value={form.guests}
                        onChange={(e) => updateForm({ guests: e.target.value })}
                        className="w-full bg-transparent border-b border-neutral-200 focus:border-neutral-900 py-4 px-0 outline-none text-neutral-900 font-light transition-colors text-lg cursor-pointer appearance-none"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} người tham dự
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={form.message}
                        onChange={(e) => updateForm({ message: e.target.value })}
                        placeholder="Lời nhắn nhủ thêm (không bắt buộc)"
                        className="w-full bg-transparent border-b border-neutral-200 focus:border-neutral-900 py-4 px-0 outline-none text-neutral-900 placeholder:text-neutral-400 font-light transition-colors text-lg"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-8 text-center">
                <button
                  type="submit"
                  disabled={submitting || (form.attending === "yes" && !form.name.trim())}
                  className="group inline-flex items-center gap-4 text-xs uppercase tracking-[0.3em] font-medium text-neutral-900 disabled:opacity-30 transition-all hover:gap-6"
                >
                  {submitting ? "Đang gửi..." : "Xác nhận"} 
                  <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
