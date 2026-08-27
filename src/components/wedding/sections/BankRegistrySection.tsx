import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Copy, Check, QrCode } from "lucide-react";
import type { BankInfo } from "@/data/seedData";
import type { WeddingTheme } from "@/data/themes";
import { copyToClipboard } from "@/lib/clipboard";
import { generateVietQrUrl } from "@/lib/vietqr";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface BankRegistrySectionProps {
  groomBank?: BankInfo;
  brideBank?: BankInfo;
  accentColor?: string;
  theme?: WeddingTheme;
}

export const BankRegistrySection: React.FC<BankRegistrySectionProps> = ({
  groomBank,
  brideBank,
  accentColor = "#15141B",
  theme,
}) => {
  const [selectedQrBank, setSelectedQrBank] = useState<{ title: string; bank: BankInfo } | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  if (!groomBank?.accountNumber && !brideBank?.accountNumber) {
    return null;
  }

  const handleCopy = (accountNumber: string, label: string) => {
    copyToClipboard(accountNumber);
    setCopiedAccount(accountNumber);
    toast.success(`Đã sao chép số tài khoản ${label}`);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const getQrUrl = (bank?: BankInfo, name?: string) => {
    if (bank?.qrCodeUrl) return bank.qrCodeUrl;
    if (bank?.bankName && bank?.accountNumber) {
      return generateVietQrUrl({
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        accountHolder: bank.accountHolder || name || "",
        description: `Mung cuoi ${name || "Co dau Chu re"}`,
        template: "compact2",
      });
    }
    return "";
  };

  const isLuxury = theme?.id === "luxury";

  let Content;
  switch (isLuxury) {
    case true:
      Content = (
        <div className="py-32 bg-[#050505] relative border-y border-[#D5B36A]/10 w-full">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-display text-4xl sm:text-5xl font-light text-[#FFF5D6] mb-8">Hộp Quà Cưới</h2>
            <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#D5B36A] mb-12">Chia sẻ niềm vui cùng Cô dâu & Chú rể</p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { title: "Mừng Chú Rể", data: groomBank },
                { title: "Mừng Cô Dâu", data: brideBank }
              ].filter((b): b is { title: string; data: BankInfo } => Boolean(b.data?.accountNumber)).map((b, i) => (
                <div key={i} className="bg-[#111] border border-[#D5B36A]/20 p-8 flex flex-col items-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D5B36A]/5 to-transparent pointer-events-none" />
                  <h3 className="font-serif text-xl text-[#D5B36A] mb-6">{b.title}</h3>
                  
                  <div className="p-4 rounded-lg flex items-center justify-between mb-6 bg-black/50 border border-[#D5B36A]/10 w-full cursor-pointer hover:border-[#D5B36A]/40 transition-colors"
                       onClick={() => handleCopy(b.data.accountNumber, b.title)}>
                    <div className="text-left">
                      <span className="text-[10px] uppercase tracking-[0.1em] block mb-1 opacity-60 text-[#D5B36A]">Số Tài Khoản</span>
                      <span className="font-mono text-lg font-bold tracking-wider text-[#E5E5E5]">{b.data.accountNumber}</span>
                    </div>
                    {copiedAccount === b.data.accountNumber ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-[#D5B36A]/70" />}
                  </div>

                  <p className="font-display text-lg text-[#FFF5D6]">{b.data?.bankName || "Ngân Hàng"}</p>
                  <p className="font-serif text-sm text-[#D5B36A]/80 mt-2">{b.data?.accountHolder || "NGUYEN VAN A"}</p>
                  
                  <div className="mt-8 bg-white p-3 rounded-xl shadow-lg border border-[#D5B36A]/20">
                    <img
                      src={getQrUrl(b.data, b.title)}
                      alt={`QR Code ${b.title}`}
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
      break;
    default:
      Content = (
        <div className="max-w-4xl mx-auto text-center w-full relative z-10 px-4">
          <div className="mb-14 text-center">
            <span className="text-[10px] tracking-[0.35em] uppercase font-sans font-semibold mb-2 block opacity-75" style={{ color: accentColor }}>
              ✦ Hộp Quà Cưới ✦
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-medium mb-4 text-foreground">
              Gửi Tặng Yêu Thương
            </h2>
            <div className="w-16 h-[1px] mx-auto mb-5 opacity-30" style={{ backgroundColor: accentColor }} />
            <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              Sự hiện diện của quý khách là niềm hạnh phúc lớn nhất. Nếu quý khách muốn gửi gắm quà mừng, xin vui lòng quét mã QR bên dưới.
            </p>
          </div>

          {/* Bank Cards Grid */}
          <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto font-sans text-left">
            {groomBank?.accountNumber && (
              <motion.div
                whileHover={{ y: -4 }}
                className="p-8 sm:p-10 rounded-3xl bg-card/85 backdrop-blur-md shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] border border-border/70 relative overflow-hidden group flex flex-col justify-between"
              >
                {/* Subtle Gold Foil Accent Line on top */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
                
                <div className="text-center md:text-left">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold opacity-60 block mb-1 text-primary">
                    Đại Diện Nhà Trai
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-medium mb-1 text-foreground">
                    {groomBank.accountHolder || "Chú Rể"}
                  </h3>
                  <p className="text-[11px] uppercase tracking-widest mb-6 opacity-60 font-medium">
                    {groomBank.bankName}
                  </p>

                  <div 
                    className="p-4 rounded-2xl flex items-center justify-between mb-6 bg-secondary/40 hover:bg-secondary/60 transition-colors cursor-pointer border border-border/40"
                    onClick={() => handleCopy(groomBank.accountNumber, "Nhà Trai")}
                  >
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.15em] block mb-0.5 opacity-60 font-medium">
                        Số Tài Khoản
                      </span>
                      <span className="font-mono text-lg font-bold tracking-wider text-foreground">
                        {groomBank.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="p-2.5 rounded-xl bg-background/80 shadow-sm transition-all"
                      title="Sao chép"
                    >
                      {copiedAccount === groomBank.accountNumber ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 opacity-60" />}
                    </button>
                  </div>
                </div>

                {/* Direct QR Code with Fine Art Frame */}
                <div className="mt-4 bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#d4af37]/25 inline-block self-center group-hover:scale-105 transition-transform text-center">
                  <img
                    src={getQrUrl(groomBank, "Nhà Trai")}
                    alt="QR Code Nhà Trai"
                    className="w-44 h-44 object-contain mx-auto"
                  />
                  <p className="text-[9px] uppercase tracking-widest text-neutral-400 mt-2 font-medium">Quét để mừng cưới</p>
                </div>
              </motion.div>
            )}

            {brideBank?.accountNumber && (
              <motion.div
                whileHover={{ y: -4 }}
                className="p-8 sm:p-10 rounded-3xl bg-card/85 backdrop-blur-md shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] border border-border/70 relative overflow-hidden group flex flex-col justify-between"
              >
                {/* Subtle Gold Foil Accent Line on top */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />

                <div className="text-center md:text-left">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold opacity-60 block mb-1 text-primary">
                    Đại Diện Nhà Gái
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-medium mb-1 text-foreground">
                    {brideBank.accountHolder || "Cô Dâu"}
                  </h3>
                  <p className="text-[11px] uppercase tracking-widest mb-6 opacity-60 font-medium">
                    {brideBank.bankName}
                  </p>

                  <div 
                    className="p-4 rounded-2xl flex items-center justify-between mb-6 bg-secondary/40 hover:bg-secondary/60 transition-colors cursor-pointer border border-border/40"
                    onClick={() => handleCopy(brideBank.accountNumber, "Nhà Gái")}
                  >
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.15em] block mb-0.5 opacity-60 font-medium">
                        Số Tài Khoản
                      </span>
                      <span className="font-mono text-lg font-bold tracking-wider text-foreground">
                        {brideBank.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="p-2.5 rounded-xl bg-background/80 shadow-sm transition-all"
                      title="Sao chép"
                    >
                      {copiedAccount === brideBank.accountNumber ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 opacity-60" />}
                    </button>
                  </div>
                </div>

                {/* Direct QR Code with Fine Art Frame */}
                <div className="mt-4 bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#d4af37]/25 inline-block self-center group-hover:scale-105 transition-transform text-center">
                  <img
                    src={getQrUrl(brideBank, "Nhà Gái")}
                    alt="QR Code Nhà Gái"
                    className="w-44 h-44 object-contain mx-auto"
                  />
                  <p className="text-[9px] uppercase tracking-widest text-neutral-400 mt-2 font-medium">Quét để mừng cưới</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      );
      break;
  }

  return (
    <section id="gift" className={`relative w-full ${isLuxury ? '' : 'py-24 px-4 border-y border-opacity-10 border-current'}`} style={isLuxury ? {} : { color: accentColor }}>
      {Content}

      {/* QR Code Dialog */}
      <AnimatePresence>
        {selectedQrBank && (
          <Dialog open={!!selectedQrBank} onOpenChange={() => setSelectedQrBank(null)}>
            <DialogContent className="sm:max-w-sm bg-card border-none p-8 text-center font-sans shadow-2xl rounded-3xl text-foreground">
              <DialogTitle className="font-display text-2xl mb-1 text-foreground font-medium">
                {selectedQrBank.title}
              </DialogTitle>
              <DialogDescription className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-8 font-medium">
                {selectedQrBank.bank.bankName} — {selectedQrBank.bank.accountHolder}
              </DialogDescription>

              <div className="bg-white p-5 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] border border-border/50 inline-block mx-auto mb-8">
                <img
                  src={getQrUrl(selectedQrBank.bank, selectedQrBank.title)}
                  alt="QR Code"
                  className="w-56 h-56 object-contain mx-auto"
                />
              </div>

              <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-2xl mb-6">
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-[0.1em] opacity-50 block font-medium">Số tài khoản</span>
                  <span className="font-mono font-bold text-lg tracking-wider text-foreground">
                    {selectedQrBank.bank.accountNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedQrBank.bank.accountNumber, selectedQrBank.title)}
                  className="p-3 rounded-xl bg-background shadow-sm hover:shadow transition-all text-foreground"
                >
                  {copiedAccount === selectedQrBank.bank.accountNumber ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 opacity-50" />}
                </button>
              </div>
              <p className="text-[10px] opacity-40 uppercase tracking-[0.2em] font-medium">
                Trân trọng cảm ơn
              </p>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BankRegistrySection;
