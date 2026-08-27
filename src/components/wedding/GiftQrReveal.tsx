import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, ScanLine, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface GiftQrRevealProps {
  qrSrc?: string;
  accentColor?: string;
  title?: string;
  buttonLabel?: string;
  subtitle?: string;
  className?: string;
  disabled?: boolean;
  variant?: "button" | "envelope" | "scanner" | "retro" | "flat" | "photo" | "royal" | "minimal" | "coastal" | "winter" | "korean";
}

export function GiftQrReveal({
  qrSrc,
  accentColor = "#E8B4B8",
  title,
  buttonLabel = "Gửi Quà Cưới",
  subtitle = "Quét mã QR để gửi lời chúc",
  className = "",
  disabled = false,
  variant = "envelope",
}: GiftQrRevealProps) {
  const [open, setOpen] = useState(false);

  const dialog = (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md bg-white border-none shadow-2xl p-0 overflow-hidden rounded-[2rem]">
            <DialogTitle className="sr-only">QR Code</DialogTitle>
            <DialogDescription className="sr-only">Quét mã QR để gửi quà cưới</DialogDescription>
            <div className="p-8 text-center bg-gradient-to-br from-gray-50 to-white relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent opacity-50" style={{ '--accent-color': accentColor } as React.CSSProperties} />
              
              <div className="w-16 h-16 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <Gift className="w-8 h-8" style={{ color: accentColor }} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2 font-display">{title || buttonLabel}</h3>
              <p className="text-gray-500 mb-8 font-body">{subtitle}</p>
              
              <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mx-auto max-w-[280px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)] to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{ '--accent-color': accentColor } as React.CSSProperties} />
                {qrSrc ? (
                  <img src={qrSrc} alt="Wedding gift QR code" className="w-full h-auto rounded-xl relative z-10 mix-blend-multiply" />
                ) : (
                  <div className="w-full aspect-square rounded-xl bg-gray-50 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 relative z-10">
                    <ScanLine className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs uppercase tracking-widest font-bold">No QR Data</span>
                  </div>
                )}
                
                {/* Scanner animation line */}
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-[var(--accent-color)] opacity-50 z-20"
                  style={{ '--accent-color': accentColor } as React.CSSProperties}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              <p className="mt-8 text-xs text-gray-400 uppercase tracking-[0.2em] font-semibold">Chân thành cảm ơn</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {variant === "envelope" ? (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <h3 
            className="text-xl md:text-3xl font-bold tracking-[0.2em] uppercase mb-12 drop-shadow-sm" 
            style={{ fontFamily: "serif", color: accentColor }}
          >
            Hộp Quà Mừng
          </h3>
          <motion.button
            type="button"
            aria-label={buttonLabel}
            disabled={disabled}
            onClick={() => setOpen(true)}
            className="relative w-40 h-72 md:w-48 md:h-80 group cursor-pointer disabled:cursor-default"
            whileHover={disabled ? undefined : "hover"}
            whileTap={disabled ? undefined : { scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 shadow-xl rounded-md overflow-hidden border border-white/20"
              style={{ backgroundColor: "#FDE6C8", transformOrigin: "bottom center" }}
              variants={{ hover: { rotate: -12, x: -20, scale: 1.02 } }}
              initial={{ rotate: -6, x: -10 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="absolute top-0 inset-x-0 h-[35%] bg-[#FAD6A5]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }} />
            </motion.div>
            <motion.div
              className="absolute inset-0 shadow-2xl rounded-md overflow-hidden border border-white/30"
              style={{ backgroundColor: "#FAD6A5", transformOrigin: "bottom center" }}
              variants={{ hover: { rotate: 10, x: 20, scale: 1.05 } }}
              initial={{ rotate: 5, x: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <div className="absolute top-0 inset-x-0 h-[35%] bg-[#F8C471] drop-shadow-md z-10" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
              <div className="absolute top-[32%] left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-red-700/90 shadow-lg flex items-center justify-center z-20 border border-amber-300/30">
                <Gift className="w-5 h-5 text-amber-100" />
              </div>
            </motion.div>
          </motion.button>
          <motion.p 
            className="mt-12 text-xs md:text-sm uppercase tracking-[0.3em] font-medium opacity-60" 
            style={{ color: accentColor }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Nhấn để mở
          </motion.p>
        </div>
      ) : variant === "scanner" ? (
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={`group relative inline-flex min-h-[5rem] items-center justify-center gap-4 overflow-hidden rounded-sm border bg-[#050608] px-8 py-4 shadow-[0_0_15px_rgba(0,255,255,0.5)] transition-all hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] disabled:cursor-default disabled:opacity-60 ${className}`}
          style={{ borderColor: accentColor }}
          whileTap={disabled ? undefined : { scale: 0.97 }}
        >
          <span className="relative z-10 grid h-12 w-12 place-items-center rounded-sm bg-black/50 text-white shadow-sm border" style={{ borderColor: accentColor }}>
            <ScanLine className="h-6 w-6" style={{ color: accentColor }} />
          </span>
          <span className="relative z-10 text-left leading-tight text-white">
            <span className="block font-mono text-lg font-bold tracking-wide uppercase" style={{ color: accentColor }}>{buttonLabel}</span>
            <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Initialize scan</span>
          </span>
        </motion.button>
      ) : variant === "retro" ? (
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={`group inline-flex min-h-16 items-center justify-center gap-4 rounded-none border-[3px] bg-background px-8 py-4 shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] disabled:cursor-default disabled:opacity-60 ${className}`}
          style={{ borderColor: "black" }}
          whileTap={disabled ? undefined : { scale: 0.97 }}
        >
          <span className="text-left leading-tight">
            <span className="block text-lg font-mono font-bold tracking-wide">{buttonLabel}</span>
          </span>
        </motion.button>
      ) : variant === "flat" ? (
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={`group inline-flex min-h-16 items-center justify-center gap-4 rounded-md border-2 bg-white px-8 py-4 shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] disabled:cursor-default disabled:opacity-60 ${className}`}
          style={{ borderColor: "black" }}
          whileTap={disabled ? undefined : { scale: 0.97 }}
        >
          <span className="text-left leading-tight text-black">
            <span className="block text-lg font-sans font-black uppercase tracking-wide">{buttonLabel}</span>
          </span>
        </motion.button>
      ) : variant === "photo" ? (
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={`group inline-flex min-h-16 items-center justify-center gap-4 rounded-sm border border-stone-200 bg-stone-50 px-8 py-4 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl disabled:cursor-default disabled:opacity-60 ${className}`}
          whileTap={disabled ? undefined : { scale: 0.97 }}
        >
          <span className="text-left leading-tight text-stone-800">
            <span className="block text-lg font-sans font-bold tracking-wide">{buttonLabel}</span>
          </span>
        </motion.button>
      ) : variant === "royal" ? (
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={`group inline-flex min-h-16 items-center justify-center gap-4 rounded-none border border-amber-500 bg-black/60 px-8 py-4 shadow-inner transition-all hover:bg-amber-500 hover:text-black disabled:cursor-default disabled:opacity-60 text-amber-500 ${className}`}
          whileTap={disabled ? undefined : { scale: 0.97 }}
        >
          <span className="text-left leading-tight">
            <span className="block text-lg font-serif font-bold tracking-[0.2em] uppercase">{buttonLabel}</span>
          </span>
        </motion.button>
      ) : variant === "minimal" ? (
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={`group inline-flex min-h-16 items-center justify-center gap-4 rounded-none border-b-2 border-foreground bg-transparent px-8 py-4 transition-all hover:bg-foreground/5 disabled:cursor-default disabled:opacity-60 text-foreground ${className}`}
          whileTap={disabled ? undefined : { scale: 0.97 }}
        >
          <span className="text-left leading-tight">
            <span className="block text-lg font-sans font-medium tracking-[0.2em] uppercase">{buttonLabel}</span>
          </span>
        </motion.button>
      ) : variant === "coastal" ? (
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={`group relative overflow-hidden inline-flex min-h-[6rem] items-center justify-center gap-4 rounded-full bg-white/80 backdrop-blur px-10 py-5 shadow-[0_8px_30px_rgba(0,172,193,0.2)] transition-all hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,172,193,0.3)] disabled:cursor-default disabled:opacity-60 text-cyan-900 border border-cyan-100 ${className}`}
          whileTap={disabled ? undefined : { scale: 0.97 }}
        >
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 120%, #00ACC1 0%, transparent 60%)" }} />
          <span className="relative grid h-12 w-12 place-items-center rounded-full bg-cyan-50 text-cyan-600 shadow-sm">
            <Gift className="h-6 w-6 transition-transform duration-500 group-hover:rotate-[360deg]" />
          </span>
          <span className="relative text-left leading-tight">
            <span className="block text-lg font-sans font-semibold tracking-wide text-cyan-950">{buttonLabel}</span>
            <span className="mt-0.5 block text-xs font-medium uppercase tracking-[0.1em] text-cyan-700/60">Discover</span>
          </span>
        </motion.button>
      ) : variant === "winter" ? (
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={`group inline-flex min-h-[6rem] items-center justify-center gap-4 rounded-3xl bg-white/40 backdrop-blur-md px-10 py-5 shadow-[0_4px_24px_rgba(144,202,249,0.15)] transition-all hover:bg-white/60 hover:shadow-[0_8px_32px_rgba(144,202,249,0.25)] border border-white disabled:cursor-default disabled:opacity-60 text-slate-700 ${className}`}
          whileTap={disabled ? undefined : { scale: 0.97 }}
        >
          <span className="relative text-left leading-tight">
            <span className="block text-center text-lg font-serif font-light tracking-[0.1em]">{buttonLabel}</span>
            <span className="mt-1 flex items-center justify-center gap-2 text-[10px] font-sans uppercase tracking-[0.2em] text-slate-400">
              <Sparkles className="w-3 h-3 text-blue-300" />
              Unlock Magic
              <Sparkles className="w-3 h-3 text-blue-300" />
            </span>
          </span>
        </motion.button>
      ) : variant === "korean" ? (
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={`group inline-flex flex-col items-center justify-center gap-2 rounded-[2rem] bg-pink-50/50 px-12 py-8 shadow-sm transition-all hover:bg-pink-50 hover:shadow-md border border-pink-100/50 disabled:cursor-default disabled:opacity-60 text-pink-900 ${className}`}
          whileTap={disabled ? undefined : { scale: 0.97 }}
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 text-pink-400 group-hover:scale-110 transition-transform">
            <Gift className="w-5 h-5" />
          </div>
          <span className="text-center leading-tight">
            <span className="block text-sm font-sans font-bold tracking-wide">{buttonLabel}</span>
            <span className="mt-1 block text-[10px] font-sans text-pink-900/40">Tap to open</span>
          </span>
        </motion.button>
      ) : (
        <motion.button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className={`group inline-flex min-h-16 items-center justify-center gap-4 rounded-xl border bg-white/95 px-8 py-4 shadow-md backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl disabled:cursor-default disabled:opacity-60 ${className}`}
          style={{ 
            borderColor: `${accentColor}55`, 
            color: accentColor,
            boxShadow: `0 4px 24px ${accentColor}25`
          }}
          whileTap={disabled ? undefined : { scale: 0.97 }}
          animate={{
            boxShadow: [
              `0 4px 24px ${accentColor}25`,
              `0 4px 32px ${accentColor}50`,
              `0 4px 24px ${accentColor}25`
            ]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="relative grid h-12 w-12 place-items-center rounded-lg text-white shadow-sm" style={{ backgroundColor: accentColor }}>
            <Gift className="h-6 w-6 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-125" />
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute -right-1.5 -top-1.5"
            >
              <Sparkles className="h-4 w-4 text-amber-300 drop-shadow-md" />
            </motion.div>
          </span>
          <span className="text-left leading-tight">
            <span className="block text-lg font-bold tracking-wide">{buttonLabel}</span>
            <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">Nhấn để xem QR</span>
          </span>
        </motion.button>
      )}
      {dialog}
    </>
  );
}
export default GiftQrReveal;
