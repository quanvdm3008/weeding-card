import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, Sparkles } from "lucide-react";
import { WeddingTheme } from "@/data/themes";
import { getTemplatePresentation, type TemplatePresentation } from "@/data/templatePresentation";
import { getTemplateLayout, type TemplateLayoutProfile } from "@/data/templateLayouts";
import { isTemplateId } from "@/data/templateIds";
import { useRSVP, type RSVPFormState } from "@/hooks/useRSVP";

import { BohoRSVP } from "@/features/templates/catalog/boho/sections/BohoRSVP";
import { MinimalRSVP } from "@/features/templates/catalog/minimal/MinimalRSVP";
import { LuxuryRSVP } from "@/features/templates/catalog/luxury/LuxuryRSVP";
import { RoyalRSVP } from "@/features/templates/catalog/royal/RoyalRSVP";

export interface RSVPVariantProps {
  theme: WeddingTheme;
  accentColor: string;
  submitted: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  renderSuccess: () => React.ReactNode;
  renderFormContent: () => React.ReactNode;
  copy: TemplatePresentation["rsvp"];
  form: RSVPFormState;
  updateForm: (updates: Partial<RSVPFormState>) => void;
  submitting: boolean;
  date?: string;
}

const RSVPEnvelopeReveal = ({ theme, accentColor, submitted, handleSubmit, renderSuccess, renderFormContent, copy }: RSVPVariantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="max-w-2xl mx-auto relative z-10 min-h-[600px] flex flex-col items-center justify-center">
      {!isOpen ? (
        <motion.div 
          data-testid="rsvp-open"
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsOpen(true)}
          className="cursor-pointer w-full max-w-lg aspect-[4/3] bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center relative overflow-hidden"
          style={{ border: `1px solid ${accentColor}30` }}
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${accentColor} 10px, ${accentColor} 11px)` }} />
          <div className="w-16 h-16 rounded-full border border-dashed flex items-center justify-center bg-white shadow-md z-10" style={{ borderColor: accentColor }}>
            <Heart className="w-8 h-8 animate-heartbeat" fill={accentColor} style={{ color: accentColor }} />
          </div>
          <p className="mt-6 font-display text-2xl text-foreground">{copy.title}</p>
          <p className="text-muted-foreground font-body text-sm mt-2 uppercase tracking-widest">Click to open the message</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">{copy.title}</h2>
            <p className="text-muted-foreground font-body">{copy.note}</p>
          </div>
          <AnimatePresence mode="wait">
            {submitted ? renderSuccess() : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className={`bg-white ${theme.cardRadius} p-8 border shadow-xl`} style={{ borderColor: `${accentColor}20` }}>
                {renderFormContent()}
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

const RSVPChatInterface = ({ accentColor, submitted, handleSubmit, renderFormContent, copy }: RSVPVariantProps) => {
  return (
    <div className="max-w-xl mx-auto relative z-10 bg-gray-50/80 backdrop-blur-md rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
      <div className="bg-white/90 backdrop-blur-xl p-4 border-b flex items-center justify-center relative shadow-sm">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 mb-1 flex items-center justify-center overflow-hidden">
            <Heart className="w-5 h-5" fill={accentColor} style={{ color: accentColor }} />
          </div>
          <p className="text-xs font-semibold">Wedding Bot</p>
        </div>
      </div>
      <div className="flex-1 p-6 flex flex-col justify-end gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
          <p className="font-body text-sm text-gray-800">{copy.note}</p>
        </motion.div>
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="self-end p-4 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] text-white" style={{ backgroundColor: accentColor }}>
              <p className="font-body text-sm">{copy.success}</p>
            </motion.div>
          ) : (
            <motion.form key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 mt-4">
              {renderFormContent()}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const RSVPPremiumCard = ({ accentColor, submitted, handleSubmit, renderFormContent, renderSuccess, copy }: RSVPVariantProps) => {
  return (
    <div className="relative z-10 mx-auto w-full max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/90 p-4 shadow-xl backdrop-blur-xl @sm:p-6 @md:p-8"
        style={{ boxShadow: `0 28px 70px -34px ${accentColor}80` }}
      >
        <div className="absolute inset-x-6 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}90, transparent)` }} />
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{copy.eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-foreground">{copy.title}</h2>
          <p className="mx-auto mt-2 max-w-sm font-body text-sm leading-6 text-muted-foreground">
            {copy.note}
          </p>
        </div>
        <AnimatePresence mode="wait">
          {submitted ? (
            renderSuccess()
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border/50 bg-background/62 p-4 shadow-sm @sm:p-5"
            >
              {renderFormContent()}
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const RSVPThemeComposition = ({
  accentColor,
  submitted,
  handleSubmit,
  renderFormContent,
  renderSuccess,
  copy,
  profile,
}: RSVPVariantProps & { profile: TemplateLayoutProfile["rsvp"] }) => {
  const isDark = profile.surface === "dark";
  const isSplit = profile.arrangement === "split" || profile.arrangement === "split-reverse";
  const isReverse = profile.arrangement === "split-reverse";
  const isStacked = profile.arrangement === "stacked";
  const isFramed = profile.arrangement === "framed";
  const isOrbital = profile.composition === "orbital-signal";
  const isTicket = ["destination-pass", "festival-pass"].includes(profile.composition);
  const isDestinationPass = profile.composition === "destination-pass";
  const isEditorial = ["guest-list", "issue-response"].includes(profile.composition);
  const isTraditional = profile.composition === "red-scroll";
  const isNeoTerminal = profile.composition === "neon-terminal";
  const isAuroraCabin = profile.composition === "aurora-cabin";

  const intro = (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative z-10 ${isSplit ? "text-left" : "mx-auto max-w-xl text-center"} ${isNeoTerminal ? "font-sans uppercase" : ""}`}
    >
      <div className={`mb-5 flex items-center gap-3 ${isSplit ? "justify-start" : "justify-center"}`}>
        <span className="h-px w-9" style={{ backgroundColor: accentColor }} />
        <span className="font-body text-[10px] font-bold uppercase tracking-[0.26em]" style={{ color: accentColor }}>
          {profile.code}
        </span>
        {!isSplit && <span className="h-px w-9" style={{ backgroundColor: accentColor }} />}
      </div>
      {isEditorial && <div className="mb-3 font-display text-6xl leading-none opacity-10 @md:text-8xl">01</div>}
      <p className={`mb-3 font-body text-[11px] uppercase tracking-[0.2em] ${isDark ? "text-white/55" : "text-muted-foreground"}`}>
        {copy.eyebrow}
      </p>
      <h2 className={`font-display font-semibold leading-tight ${isDestinationPass ? "text-3xl @xl:text-[2.75rem]" : isSplit ? "text-4xl @xl:text-5xl" : "text-4xl @md:text-6xl"} ${isDark ? "text-white" : "text-foreground"} ${isNeoTerminal ? "font-sans font-black uppercase" : ""}`}>
        {copy.title}
      </h2>
      <p className={`mt-4 max-w-md font-body text-sm leading-7 ${isDark ? "text-white/70" : "text-muted-foreground"}`}>
        {copy.note}
      </p>
      <div className={`mt-7 flex items-center gap-3 ${isSplit ? "justify-start" : "justify-center"}`}>
        <span className="font-body text-[10px] uppercase tracking-[0.18em]" style={{ color: accentColor }}>{profile.detail}</span>
        <span className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: accentColor }} />
      </div>
    </motion.div>
  );

  const form = (
    <AnimatePresence mode="wait">
      {submitted ? renderSuccess() : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 24, rotateX: isStacked ? 4 : 0 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={handleSubmit}
          className={`relative z-10 border bg-background/95 shadow-2xl backdrop-blur-xl ${isDestinationPass ? "p-5 @md:p-6" : "p-4 @sm:p-6 @md:p-8"} ${
            isNeoTerminal ? "rounded-none border-[#65E7FF]/60 bg-[#050608] shadow-none" :
            isAuroraCabin ? "rounded-sm border-[#72E6C1]/35 bg-[#F4F8F6] shadow-none" :
            isTicket ? "rounded-sm border-dashed" :
            profile.composition === "garden-arch" ? "rounded-t-[8rem] rounded-b-lg pt-14" :
            profile.composition === "quiet-line" ? "rounded-none border-x-0 bg-transparent shadow-none" :
            profile.composition === "telegram" ? "rounded-none border-4 border-double" :
            profile.composition === "color-block" ? "rounded-lg" :
            "rounded-2xl"
          }`}
          style={{
            borderColor: `${accentColor}${profile.composition === "telegram" ? "90" : isNeoTerminal ? "80" : "38"}`,
            boxShadow: profile.composition === "quiet-line" || isNeoTerminal || isAuroraCabin ? "none" : `0 28px 80px -38px ${accentColor}99`,
          }}
          data-rsvp-form={profile.composition}
        >
          {isTicket && (
            <div className="absolute inset-y-5 -left-1 w-2 bg-[radial-gradient(circle,transparent_3px,white_3.5px)] bg-[length:8px_16px]" aria-hidden="true" />
          )}
          {renderFormContent()}
        </motion.form>
      )}
    </AnimatePresence>
  );

  return (
    <div
      data-rsvp-layout={profile.composition}
      className={`relative z-10 mx-auto w-full ${isDestinationPass ? "max-w-5xl" : isSplit ? "max-w-6xl" : isAuroraCabin ? "max-w-5xl" : "max-w-3xl"}`}
      style={{ perspective: "1200px" }}
    >
      {isStacked && !isAuroraCabin && (
        <>
          <div className="absolute inset-x-[8%] bottom-2 top-20 rotate-2 border bg-card/35" style={{ borderColor: `${accentColor}25` }} />
          <div className="absolute inset-x-[11%] bottom-5 top-16 -rotate-2 border bg-card/45" style={{ borderColor: `${accentColor}35` }} />
        </>
      )}
      {isOrbital && (
        <div className="pointer-events-none absolute -left-10 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border opacity-30 @md:h-96 @md:w-96" style={{ borderColor: accentColor, boxShadow: `0 0 80px ${accentColor}28` }}>
          <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: accentColor }} />
        </div>
      )}
      {isTraditional && (
        <div className="pointer-events-none absolute inset-0 border-2" style={{ borderColor: `${accentColor}85`, outline: `1px solid ${accentColor}45`, outlineOffset: "8px" }} />
      )}
      <div className={`${isFramed ? "border px-4 py-10 @md:px-10 @md:py-14" : ""}`} style={isFramed ? { borderColor: `${accentColor}55` } : undefined}>
        {isSplit ? (
          <div className={`grid items-stretch ${isDestinationPass ? "gap-6 @lg:grid-cols-[minmax(0,.88fr)_minmax(0,1.12fr)] @lg:gap-8" : "gap-8 @lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] @lg:gap-10"}`}>
            <div
              className={`flex items-center ${isReverse ? "@lg:order-2" : ""} ${isDark ? "min-h-64 border p-7 @md:p-10" : ""}`}
              style={isDark ? { backgroundColor: "rgba(5,5,8,.86)", borderColor: `${accentColor}35` } : undefined}
            >
              {intro}
            </div>
            <div className={`self-center ${isReverse ? "@lg:order-1" : ""}`}>{form}</div>
          </div>
        ) : (
          <div className="relative space-y-9">
            {intro}
            <div className="mx-auto max-w-xl">{form}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export const RSVPSection = ({
  accentColor,
  sectionBg,
  theme,
  embedded = false,
  publicSlug,
  guestName,
  guestToken,
  date,
}: {
  accentColor: string;
  sectionBg?: string;
  theme: WeddingTheme;
  embedded?: boolean;
  publicSlug?: string;
  guestName?: string;
  guestToken?: string;
  date?: string;
}) => {
  const presentation = getTemplatePresentation(theme.id);
  const layoutProfile = getTemplateLayout(theme.id);
  const darkRsvpHeader = ["modern", "royal", "luxury", "traditional"].includes(theme.id);
  const { form, updateForm, submitted, submitting, handleSubmit } = useRSVP(publicSlug, guestName, guestToken);

  const renderFormContent = () => (
    <div className="space-y-6 @md:space-y-8 relative z-10 w-full pt-2">
      <div data-rsvp-ornament className="flex justify-center mb-5 @md:mb-8 opacity-80">
        <div className="inline-flex items-center gap-3 rounded-full border border-border/50 bg-background/42 px-4 py-2 backdrop-blur-xl">
          <Sparkles className="h-3.5 w-3.5" style={{ color: accentColor }} />
          <svg width="86" height="14" viewBox="0 0 86 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 7H32M54 7H86" stroke={accentColor} strokeWidth="1" strokeLinecap="round" />
            <path d="M43 0L48 7L43 14L38 7L43 0Z" fill={accentColor} />
          </svg>
          <Sparkles className="h-3.5 w-3.5" style={{ color: accentColor }} />
        </div>
      </div>

      {/* Attending Toggle â€” 2 separate grid buttons: old pill layoutId measures wrong position in
          container is animating (whileInView/height) â†’ the colored ball overflows over the text on mobile */}
      <div className="group relative">
        <label className="block font-display text-sm @md:text-base tracking-[0.2em] uppercase text-center mb-5 font-semibold" style={{ color: accentColor }}>Will You Attend?</label>
        <div data-rsvp-attendance className="grid grid-cols-2 gap-1.5 p-1.5 rounded-full bg-muted/40 backdrop-blur-sm border border-border/50 max-w-sm mx-auto shadow-inner">
          {[{ value: "yes", label: "Will come and have fun" }, { value: "no", label: "Unfortunately not possible" }].map((opt) => (
            <button
              key={opt.value}
              type="button"
              data-rsvp-attendance-option
              onClick={() => updateForm({ attending: opt.value as RSVPFormState["attending"] })}
              className={`flex items-center justify-center gap-1.5 min-h-11 px-2 py-2 rounded-full font-body text-[11px] @sm:text-xs uppercase tracking-wide leading-tight font-bold text-center transition-all duration-300 ${
                form.attending === opt.value ? "text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
              }`}
              style={form.attending === opt.value ? { backgroundColor: accentColor } : undefined}
            >
              {opt.value === "yes" && form.attending === "yes" && (
                <Heart className="w-3.5 h-3.5 animate-pulse fill-current shrink-0" />
              )}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {form.attending === "yes" && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }} 
            animate={{ opacity: 1, height: "auto", y: 0 }} 
            exit={{ opacity: 0, height: 0, y: -10 }} 
            transition={{ duration: 0.4 }}
            className="space-y-6 overflow-hidden pt-4"
          >
            <div className="grid @md:grid-cols-[1fr_120px] gap-6">
              <div className="relative">
                <label className="block font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2 pl-1">Honor your name</label>
                <input
                  data-testid="rsvp-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-background/50 font-body text-sm @md:text-base focus:outline-none focus:ring-1 transition-all shadow-sm"
                  style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                  placeholder="Guest name..."
                />
              </div>
              
              <div className="relative">
                <label className="block font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2 pl-1">Quantity</label>
                <select
                  data-testid="rsvp-guests"
                  value={form.guests}
                  onChange={(e) => updateForm({ guests: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-background/50 font-body text-sm @md:text-base focus:outline-none focus:ring-1 transition-all shadow-sm cursor-pointer"
                  style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                >
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} people</option>)}
                </select>
              </div>
            </div>

            <div className="relative">
              <label className="block font-body text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2 pl-1">Sending loving wishes</label>
              <textarea
                data-testid="rsvp-message"
                value={form.message}
                onChange={(e) => updateForm({ message: e.target.value })}
                rows={3}
                className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-background/50 font-body text-sm @md:text-base focus:outline-none focus:ring-1 resize-none transition-all shadow-sm"
                style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
                placeholder="Write wishes to the bride & groom..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {form.attending === "no" && (
           <motion.div 
             initial={{ opacity: 0, height: 0 }} 
             animate={{ opacity: 1, height: "auto" }} 
             exit={{ opacity: 0, height: 0 }} 
             className="pt-4 pb-2"
           >
             <p className="text-center font-display text-lg text-muted-foreground italic leading-relaxed px-4 border-l-2" style={{ borderColor: accentColor }}>
               "Your absence is a regret, but we deeply appreciate your affection."
             </p>
           </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        data-testid="rsvp-submit"
        type="submit"
        disabled={submitting}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full flex items-center justify-center gap-3 py-4 rounded-xl text-white font-body uppercase tracking-[0.2em] text-sm font-bold overflow-hidden group shadow-lg transition-all mt-8"
        style={{ backgroundColor: accentColor }}
      >
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-20"
          style={{ background: `linear-gradient(120deg, transparent 30%, #fff 50%, transparent 70%)` }}
          animate={{ x: ["-150%", "250%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <Send className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        <span className="relative z-10">{form.attending === 'yes' ? 'Send Confirmation' : 'Send Apologies'}</span>
      </motion.button>
    </div>
  );

  const renderSuccess = () => (
    <motion.div
      key="thanks"
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className={`relative overflow-hidden text-center p-8 @md:p-12 min-h-[350px] flex flex-col items-center justify-center bg-card/90 backdrop-blur-2xl ${theme.cardRadius} border border-border/50`}
      style={{ boxShadow: `0 24px 60px -20px ${accentColor}30` }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
      {/* Decorative Stars Background */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: `radial-gradient(circle, ${accentColor} 2px, transparent 2px)`, backgroundSize: '50px 50px' }}
      />
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, delay: 0.1 }}
        className="w-20 h-20 @md:w-24 @md:h-24 mx-auto mb-8 rounded-full flex items-center justify-center relative z-10"
        style={{ backgroundColor: accentColor, boxShadow: `0 10px 40px -10px ${accentColor}` }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-white"
        />
        <Heart className="w-8 h-8 @md:w-10 @md:h-10 text-white fill-white" />
      </motion.div>
      
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-display text-3xl @md:text-5xl font-bold text-foreground mb-6 relative z-10"
      >
        {form.attending === 'yes' ? 'See you again!' : 'Thank you!'}
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground font-body text-sm @md:text-base tracking-wide relative z-10 px-4 leading-relaxed max-w-md mx-auto"
      >
        {form.attending === 'yes' 
          ? presentation.rsvp.success
          : "We have received the message. Even though we can't be together, your love is always appreciated."}
      </motion.p>
    </motion.div>
  );

  const renderLayout = () => {
    if (theme.id === "romantic") {
      return <RSVPEnvelopeReveal theme={theme} accentColor={accentColor} submitted={submitted} handleSubmit={handleSubmit} renderSuccess={renderSuccess} renderFormContent={renderFormContent} copy={presentation.rsvp} form={form} updateForm={updateForm} submitting={submitting} />;
    }

    if (theme.id === "pixel") {
      return <RSVPChatInterface theme={theme} accentColor={accentColor} submitted={submitted} handleSubmit={handleSubmit} renderSuccess={renderSuccess} renderFormContent={renderFormContent} copy={presentation.rsvp} form={form} updateForm={updateForm} submitting={submitting} />;
    }

    if (theme.id === "boho") {
      return <BohoRSVP theme={theme} accentColor={accentColor} submitted={submitted} handleSubmit={handleSubmit} renderSuccess={renderSuccess} renderFormContent={renderFormContent} copy={presentation.rsvp} form={form} updateForm={updateForm} submitting={submitting} date={date} />;
    }
    if (theme.id === "minimalist") {
      return <MinimalRSVP theme={theme} accentColor={accentColor} submitted={submitted} handleSubmit={handleSubmit} renderSuccess={renderSuccess} renderFormContent={renderFormContent} copy={presentation.rsvp} form={form} updateForm={updateForm} submitting={submitting} date={date} />;
    }
    if (theme.id === "luxury") {
      return <LuxuryRSVP theme={theme} accentColor={accentColor} submitted={submitted} handleSubmit={handleSubmit} renderSuccess={renderSuccess} renderFormContent={renderFormContent} copy={presentation.rsvp} form={form} updateForm={updateForm} submitting={submitting} date={date} />;
    }
    if (theme.id === "royal") {
      return <RoyalRSVP theme={theme} accentColor={accentColor} submitted={submitted} handleSubmit={handleSubmit} renderSuccess={renderSuccess} renderFormContent={renderFormContent} copy={presentation.rsvp} form={form} updateForm={updateForm} submitting={submitting} date={date} />;
    }

    switch (theme.styleVariant) {
      case "minimal":
        return <MinimalRSVP theme={theme} accentColor={accentColor} submitted={submitted} handleSubmit={handleSubmit} renderSuccess={renderSuccess} renderFormContent={renderFormContent} copy={presentation.rsvp} form={form} updateForm={updateForm} submitting={submitting} date={date} />;
    }

    if (isTemplateId(theme.id)) {
      return (
        <RSVPThemeComposition
          theme={theme}
          accentColor={accentColor}
          submitted={submitted}
          handleSubmit={handleSubmit}
          renderSuccess={renderSuccess}
          renderFormContent={renderFormContent}
          copy={presentation.rsvp}
          form={form}
          updateForm={updateForm}
          submitting={submitting}
          profile={layoutProfile.rsvp}
        />
      );
    }

    switch (theme.styleVariant) {

        case "letter":
          return <RSVPEnvelopeReveal theme={theme} accentColor={accentColor} submitted={submitted} handleSubmit={handleSubmit} renderSuccess={renderSuccess} renderFormContent={renderFormContent} copy={presentation.rsvp} form={form} updateForm={updateForm} submitting={submitting} />;
        case "magazine":
          return <RSVPPremiumCard theme={theme} accentColor={accentColor} submitted={submitted} handleSubmit={handleSubmit} renderFormContent={renderFormContent} renderSuccess={renderSuccess} copy={presentation.rsvp} form={form} updateForm={updateForm} submitting={submitting} />;

      case "vintage":
        return (
          <div className="max-w-md mx-auto relative z-10 p-6 @md:p-8" style={{ backgroundColor: "#F5E6CC", boxShadow: "0 20px 50px -20px rgba(80,60,20,0.4)" }}>
            <div className="text-center mb-6">
              <h2 className="font-display text-3xl font-bold" style={{ color: "#8B6914" }}>{presentation.rsvp.title}</h2>
              <p className="text-muted-foreground font-body text-sm mt-2">{presentation.rsvp.note}</p>
            </div>
            <AnimatePresence mode="wait">
              {submitted ? renderSuccess() : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="bg-white/70 rounded-sm p-6 border" style={{ borderColor: "#8B691440" }}>
                  {renderFormContent()}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        );

      case "rustic":
        return (
          <div className="max-w-md mx-auto relative z-10 p-6 @md:p-8" style={{ border: `3px solid ${accentColor}50`, backgroundColor: "#F0E6D6" }}>
            <div className="text-center mb-6">
              <h2 className="font-display text-3xl font-bold text-foreground">{presentation.rsvp.title}</h2>
            </div>
            <AnimatePresence mode="wait">
              {submitted ? renderSuccess() : (
                <motion.form key="form" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit} className="bg-white/60 p-6">
                  {renderFormContent()}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        );

      case "glass":
        return (
          <div className="max-w-md mx-auto relative z-10">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl @md:text-4xl font-bold text-foreground">{presentation.rsvp.title}</h2>
            </div>
            <AnimatePresence mode="wait">
              {submitted ? renderSuccess() : (
                <motion.form key="form" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit}
                  className="relative rounded-2xl border border-white/45 bg-white/30 backdrop-blur-xl p-4 shadow-xl @sm:p-6 @md:p-8">
                  {renderFormContent()}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        );

      case "fluid":
        return (
          <div className="max-w-md mx-auto relative z-10">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl @md:text-4xl font-bold text-foreground">{presentation.rsvp.title}</h2>
            </div>
            <AnimatePresence mode="wait">
              {submitted ? renderSuccess() : (
                <motion.form key="form" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit}
                  className="relative bg-card/70 p-8 @md:p-10 shadow-xl" style={{ borderRadius: "42% 58% 65% 35% / 18% 18% 22% 22%" }}>
                  {renderFormContent()}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        );

      case "gallery":
        return (
          <div className="max-w-5xl mx-auto grid @md:grid-cols-2 gap-8 items-center relative z-10">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="hidden @md:block">
              <h2 className="font-display text-4xl @md:text-5xl font-bold text-foreground mb-4">{presentation.rsvp.title}</h2>
              <p className="text-muted-foreground font-body text-lg mb-8">{presentation.rsvp.note}</p>
              <div className="p-8 rounded-2xl bg-card border border-border text-center shadow-xl">
                 <Heart className="w-12 h-12 mx-auto mb-4" style={{ color: accentColor }} />
                 <h3 className="font-display text-xl mb-2">Looking forward to welcoming you</h3>
                 <p className="text-muted-foreground font-body text-sm">Please respond before October 15, 2026</p>
              </div>
            </motion.div>
            <AnimatePresence mode="wait">
              {submitted ? renderSuccess() : (
                <motion.form key="form" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onSubmit={handleSubmit}
                  className={`relative bg-card/95 backdrop-blur-xl ${theme.cardRadius} p-4 @sm:p-6 @md:p-8 border border-border/60`} style={{ boxShadow: `0 24px 60px -24px ${accentColor}30` }}>
                  {renderFormContent()}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        );

      case "map":
        return (
          <div className="max-w-md mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
              <h2 className="font-display text-4xl font-bold text-foreground">{presentation.rsvp.title}</h2>
            </motion.div>
            <div className="relative">
              {/* Stack effect backgrounds */}
              <div className="absolute inset-0 bg-card/40 rounded-2xl -rotate-6 scale-95 border border-border shadow-sm transform transition-transform" />
              <div className="absolute inset-0 bg-card/60 rounded-2xl rotate-3 scale-[0.98] border border-border shadow-sm transform transition-transform" />
              
              <AnimatePresence mode="wait">
                {submitted ? renderSuccess() : (
                  <motion.form key="form" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit}
                    className="relative bg-card rounded-2xl p-4 @sm:p-6 @md:p-8 border border-border shadow-2xl">
                    {renderFormContent()}
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        );

      // centered-form (default)
      default:
        return (
          <div className="max-w-md mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="h-[1px] w-8" style={{ background: `linear-gradient(to right, transparent, ${accentColor})` }} />
                <span className="text-[10px] tracking-[0.5em] uppercase font-body" style={{ color: accentColor }}>{presentation.rsvp.eyebrow}</span>
                <span className="h-[1px] w-8" style={{ background: `linear-gradient(to left, transparent, ${accentColor})` }} />
              </div>
              <h2 className="font-display text-3xl @md:text-4xl font-bold" style={{ color: darkRsvpHeader ? "#F8F3EA" : undefined }}>{presentation.rsvp.title}</h2>
              <p className="font-body text-sm mt-2" style={{ color: darkRsvpHeader ? "rgba(248,243,234,.62)" : undefined }}>{presentation.rsvp.note}</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {submitted ? renderSuccess() : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onSubmit={handleSubmit}
                  className={`relative bg-card/95 backdrop-blur-xl ${theme.cardRadius} p-4 @sm:p-6 @md:p-8 border border-border/60`}
                  style={{ boxShadow: `0 24px 60px -24px ${accentColor}30` }}
                >
                  {renderFormContent()}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        );
    }
  };

  const isBespoke = ["boho", "minimal", "luxury", "royal", "romantic", "pixel"].includes(theme.id) || 
                    (theme.styleVariant && ["boho", "minimal", "luxury", "royal"].includes(theme.styleVariant));

  if (isBespoke) {
    return renderLayout();
  }

  const Wrapper = embedded ? "div" : "section";

  return (
    <Wrapper id="rsvp" className={embedded ? "relative overflow-hidden" : "relative overflow-hidden px-4 py-20"} style={{ backgroundColor: sectionBg }}>
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`,
            backgroundSize: "44px 44px",
          }}
        />
        <svg className="absolute -left-12 top-10 h-44 w-44 opacity-20" viewBox="0 0 180 180" fill="none" aria-hidden="true" style={{ color: accentColor }}>
          <path d="M24 154C54 108 78 65 151 27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M54 113C43 94 47 77 65 62C76 84 74 101 54 113Z" fill="currentColor" opacity=".55" />
          <path d="M91 78C82 60 87 43 108 32C116 54 112 68 91 78Z" fill="currentColor" opacity=".42" />
        </svg>
      </div>
      {renderLayout()}
    </Wrapper>
  );
};

export default RSVPSection;

