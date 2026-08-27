import { useState, useRef, useEffect, forwardRef } from "react";

import { motion, AnimatePresence } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import { Heart, MessageCircleHeart, Sparkles, Send, User, PenLine, Star, PartyPopper, Quote } from "lucide-react";
import { toast } from "sonner";
import { Crown } from "lucide-react";
import { emitWish } from "@/components/liveWishBus";
import type { WeddingTheme } from "@/data/themes";
import { getTemplatePresentation } from "@/data/templatePresentation";
import { getTemplateLayout, type TemplateLayoutProfile } from "@/data/templateLayouts";
import { getApiErrorMessage } from "@/lib/api";
import { useWishesData, type Wish } from '@/hooks/useWishesData';

const emojiOptions = ["💌", "🌸", "💍", "💐", "🥂", "❤️", "🎈", "🎁", "💖", "🎊", "✉️", "💘"];

const reactionEmojis = ["❤️", "😍", "🥳", "👍", "💎"];

const FloatingElements = ({ emojis }: { emojis?: string[] }) => {
  const elements = emojis && emojis.length > 0 ? emojis : ["💕", "💗", "✨", "🌸", "💖", "🤝"];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg opacity-20"
          style={{ left: `${10 + i * 15}%`, bottom: 0 }}
          animate={{
            y: [0, -400 - Math.random() * 200],
            x: [0, (Math.random() - 0.5) * 80],
            opacity: [0, 0.3, 0],
            rotate: [0, (Math.random() - 0.5) * 60],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeOut",
          }}
        >
          {elements[i % elements.length]}
        </motion.div>
      ))}
    </div>
  );
};

type WishStyle = "bubble" | "luxury" | "polaroid" | "minimal" | "neon" | "pixel" | "flat2d" | "vintage" | "royal" | "korean" | "romantic" | "platinum" | "ocean" | "dream";

const styleConfig: Record<WishStyle, {
  cardClass: string;
  cardBg: (c: string) => string;
  textClass: string;
  nameClass: string;
  msgClass: string;
  border: (c: string) => string;
  topAccent?: (c: string) => string;
  rotate?: number;
  glow?: boolean;
  decoration?: "quote" | "ribbon" | "tape" | "dot" | "spark";
}> = {
  bubble: {
    cardClass: "rounded-2xl",
    cardBg: () => "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
    textClass: "text-foreground",
    nameClass: "text-foreground",
    msgClass: "text-muted-foreground/80",
    border: () => "border-border/60",
    topAccent: (c) => `linear-gradient(90deg, transparent, ${c}, transparent)`,
    decoration: "spark",
  },
  luxury: {
    cardClass: "rounded-none",
    cardBg: () => "linear-gradient(145deg, #1a0f0f 0%, #2d1810 60%, #1a0a0a 100%)",
    textClass: "text-white",
    nameClass: "text-white",
    msgClass: "text-white/75",
    border: () => "",
    topAccent: (c) => `linear-gradient(90deg, transparent, ${c}, transparent)`,
    glow: true,
    decoration: "quote",
  },
  polaroid: {
    cardClass: "rounded-sm",
    cardBg: () => "#fdfcf7",
    textClass: "text-stone-700",
    nameClass: "text-stone-800",
    msgClass: "text-stone-600",
    border: () => "border-stone-200",
    decoration: "tape",
  },
  minimal: {
    cardClass: "rounded-none border-l-2",
    cardBg: () => "transparent",
    textClass: "text-foreground",
    nameClass: "text-foreground tracking-wide",
    msgClass: "text-muted-foreground",
    border: () => "",
    decoration: "dot",
  },
  neon: {
    cardClass: "rounded-2xl",
    cardBg: () => "linear-gradient(145deg, rgba(15,20,35,0.92), rgba(20,25,45,0.85))",
    textClass: "text-white",
    nameClass: "text-white",
    msgClass: "text-white/70",
    border: () => "",
    topAccent: (c) => `linear-gradient(90deg, transparent, ${c}, transparent)`,
    glow: true,
    decoration: "spark",
  },
  pixel: {
    cardClass: "rounded-none",
    cardBg: () => "transparent",
    textClass: "text-foreground font-mono",
    nameClass: "text-foreground font-mono font-bold uppercase",
    msgClass: "text-muted-foreground font-mono",
    border: () => "border-[3px] border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    decoration: "dot",
  },
  flat2d: {
    cardClass: "rounded-md",
    cardBg: () => "#ffffff",
    textClass: "text-black font-sans",
    nameClass: "text-black font-sans font-black uppercase",
    msgClass: "text-black/80 font-sans",
    border: () => "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    decoration: "dot",
  },
  vintage: {
    cardClass: "rounded-sm",
    cardBg: () => "#F4EFE6",
    textClass: "text-[#5C4033] font-serif",
    nameClass: "text-[#5C4033] font-serif font-bold uppercase tracking-widest",
    msgClass: "text-[#6B4E31] font-serif",
    border: () => "border border-[#8B5A2B]/40 shadow-inner",
    topAccent: (c) => "repeating-linear-gradient(45deg, transparent, transparent 10px, #8B5A2B 10px, #8B5A2B 20px)",
    decoration: "tape",
  },
  royal: {
    cardClass: "rounded-none",
    cardBg: () => "rgba(0,0,0,0.6)",
    textClass: "text-amber-500 font-serif",
    nameClass: "text-amber-500 font-serif font-bold uppercase tracking-widest",
    msgClass: "text-amber-200/80 font-serif",
    border: () => "border border-amber-500/30",
    topAccent: (c) => "linear-gradient(90deg, transparent, #f59e0b, transparent)",
    decoration: "quote",
    glow: true,
  },
  korean: {
    cardClass: "rounded-2xl",
    cardBg: () => "rgba(255,255,255,0.8)",
    textClass: "text-blue-900 font-sans",
    nameClass: "text-blue-900 font-sans font-bold",
    msgClass: "text-blue-700/80 font-sans",
    border: () => "border-none shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
    decoration: "ribbon",
  },
  romantic: {
    cardClass: "rounded-3xl",
    cardBg: () => "rgba(255,245,247,0.9)",
    textClass: "text-pink-900 font-sans",
    nameClass: "text-pink-900 font-sans font-bold",
    msgClass: "text-pink-800/80 font-sans",
    border: () => "border border-pink-200 shadow-sm",
    decoration: "ribbon",
  },
  platinum: {
    cardClass: "rounded-none",
    cardBg: () => "rgba(255,255,255,0.7)",
    textClass: "text-[#0F172A] font-serif",
    nameClass: "text-[#0F172A] font-serif font-light tracking-widest uppercase text-xs",
    msgClass: "text-[#334155] font-serif italic",
    border: () => "border-l border-t border-white/80 shadow-[10px_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-md",
    glow: true,
  },
  ocean: {
    cardClass: "rounded-[2rem] rounded-br-none",
    cardBg: () => "rgba(255,255,255,0.85)",
    textClass: "text-[#004D40]",
    nameClass: "text-[#00838F] font-bold tracking-wider",
    msgClass: "text-[#006064]/80",
    border: () => "border border-[#B2EBF2] shadow-[0_10px_40px_rgba(0,131,143,0.08)] backdrop-blur-sm",
    topAccent: () => "linear-gradient(90deg, #E0F7FA, #00838F, #E0F7FA)",
  },
  dream: {
    cardClass: "rounded-full px-8 py-4",
    cardBg: () => "rgba(255,255,255,0.6)",
    textClass: "text-[#5D4037]",
    nameClass: "text-[#8C6B99] font-serif italic text-lg",
    msgClass: "text-[#5D4037]/80",
    border: () => "border border-white shadow-[0_5px_20px_rgba(140,107,153,0.15)] backdrop-blur-xl",
    glow: true,
  },
};

const WishBubble = forwardRef<HTMLDivElement, {
  wish: Wish;
  index: number;
  accentColor: string;
  onLike: (id: number | string) => void;
  animStyle: "slide" | "pop" | "flip" | "wave" | "float";
  visualStyle: WishStyle;
}>(({
  wish,
  index,
  accentColor,
  onLike,
  animStyle,
  visualStyle,
}, ref) => {
  const isEven = index % 2 === 0;
  const [showReactions, setShowReactions] = useState(false);
  const [particles, setParticles] = useState<{ id: number; emoji: string }[]>([]);
  const cfg = styleConfig[visualStyle];

  const variants = {
    slide: {
      initial: { opacity: 0, x: isEven ? -60 : 60, y: 10 },
      animate: { opacity: 1, x: 0, y: 0 },
      transition: { type: "spring", damping: 20, stiffness: 200, delay: index * 0.08 },
    },
    pop: {
      initial: { opacity: 0, scale: 0.3, rotate: -5 },
      animate: { opacity: 1, scale: 1, rotate: 0 },
      transition: { type: "spring", damping: 15, stiffness: 300, delay: index * 0.06 },
    },
    flip: {
      initial: { opacity: 0, rotateY: 90, scale: 0.8 },
      animate: { opacity: 1, rotateY: 0, scale: 1 },
      transition: { type: "spring", damping: 18, delay: index * 0.1 },
    },
    wave: {
      initial: { opacity: 0, y: 40, scale: 0.9 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { type: "spring", damping: 12, stiffness: 150, delay: index * 0.07 },
    },
    float: {
      initial: { opacity: 0, y: 50, x: (Math.random() - 0.5) * 40 },
      animate: { opacity: 1, y: 0, x: 0 },
      transition: { type: "spring", damping: 20, delay: index * 0.09 },
    },
  };

  const v = variants[animStyle];
  const polaroidRotate = visualStyle === "polaroid" ? (isEven ? -2 : 2) : 0;

  const handleLike = () => {
    onLike(wish.id);
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      emoji: reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1500);
  };

  return (
    <motion.div
      ref={ref}
      initial={v.initial}
      whileInView={v.animate as TargetAndTransition}
      viewport={{ once: true, margin: "-30px" }}
      transition={v.transition}
      className="group relative"
      style={{ perspective: 800, rotate: `${polaroidRotate}deg` }}
    >
      <AnimatePresence>
        {particles.map((p, pi) => (
          <motion.span
            key={p.id}
            className="absolute text-base pointer-events-none z-20"
            style={{ left: "50%", top: "50%" }}
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{
              opacity: 0,
              scale: 1.5,
              x: (Math.random() - 0.5) * 120,
              y: -60 - Math.random() * 80,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: pi * 0.05 }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      <motion.div
        whileHover={{ y: -4, scale: visualStyle === "polaroid" ? 1.03 : 1.01, rotate: visualStyle === "polaroid" ? 0 : undefined }}
        transition={{ type: "spring", stiffness: 400 }}
        className={`relative overflow-hidden ${cfg.cardClass} ${cfg.border(accentColor)} ${visualStyle === "polaroid" ? "shadow-lg pb-10" : "shadow-sm"} hover:shadow-2xl transition-shadow duration-500 ${visualStyle !== "minimal" ? "border" : ""}`}
        style={{
          background: cfg.cardBg(accentColor),
          borderColor: visualStyle === "minimal" ? accentColor : visualStyle === "luxury" ? `${accentColor}40` : visualStyle === "neon" ? `${accentColor}30` : undefined,
          boxShadow: cfg.glow ? `0 8px 40px -8px ${accentColor}40, inset 0 1px 0 ${accentColor}20` : undefined,
        }}
      >
        {cfg.topAccent && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: cfg.topAccent(accentColor) }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.08 + 0.3 }}
          />
        )}

        {visualStyle === "luxury" && (
          <>
            <div className="absolute top-2 left-2 w-6 h-6 border-l border-t pointer-events-none" style={{ borderColor: `${accentColor}80` }} />
            <div className="absolute top-2 right-2 w-6 h-6 border-r border-t pointer-events-none" style={{ borderColor: `${accentColor}80` }} />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-l border-b pointer-events-none" style={{ borderColor: `${accentColor}80` }} />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-r border-b pointer-events-none" style={{ borderColor: `${accentColor}80` }} />
          </>
        )}

        {visualStyle === "polaroid" && (
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-5 opacity-70 z-10 rotate-1"
            style={{ background: "linear-gradient(180deg, rgba(245,235,200,0.6), rgba(220,210,170,0.4))", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
          />
        )}

        {visualStyle === "neon" && (
          <motion.div
            className="absolute inset-x-0 h-12 pointer-events-none"
            style={{ background: `linear-gradient(180deg, transparent, ${accentColor}10, transparent)` }}
            animate={{ y: ["-100%", "400%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: index * 0.3 }}
          />
        )}

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0" style={{ background: `linear-gradient(105deg, transparent 40%, ${accentColor}10 50%, transparent 60%)` }} />
        </div>

        <div className={`relative ${visualStyle === "minimal" ? "p-5 pl-6" : "p-4 @md:p-5"}`}>
          {cfg.decoration === "quote" && (
            <Quote className="absolute top-3 right-3 w-8 h-8 opacity-10" style={{ color: accentColor }} />
          )}

          <div className="flex gap-3.5">
            {visualStyle !== "minimal" && (
              <div className="relative flex-shrink-0">
                <motion.div
                  className={`w-11 h-11 ${visualStyle === "polaroid" ? "rounded-sm" : "rounded-full"} flex items-center justify-center text-lg shadow-sm border-2`}
                  style={{
                    backgroundColor: visualStyle === "luxury" || visualStyle === "neon" ? `${accentColor}15` : `${accentColor}10`,
                    borderColor: `${accentColor}40`,
                  }}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {wish.emoji}
                </motion.div>
                {(visualStyle === "bubble" || visualStyle === "neon") && (
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                    style={{ backgroundColor: "#4ade80", borderColor: visualStyle === "neon" ? "#0f1420" : "white" }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {visualStyle === "minimal" && (
                  <span className="text-base">{wish.emoji}</span>
                )}
                <span className={`font-body text-sm font-bold ${cfg.nameClass} ${visualStyle === "luxury" ? "tracking-wider uppercase text-xs" : ""}`} style={visualStyle === "luxury" ? { color: accentColor } : {}}>
                  {wish.name}
                </span>
                <span className={`font-body text-[10px] ${visualStyle === "luxury" || visualStyle === "neon" ? "text-white/40" : "text-muted-foreground/50"} ${visualStyle !== "minimal" ? "bg-white/5 px-1.5 py-0.5 rounded-full" : ""}`}>
                  {wish.timestamp}
                </span>
              </div>
              <p className={`font-body text-sm ${cfg.msgClass} leading-relaxed ${visualStyle === "luxury" ? "italic" : ""}`}>
                {visualStyle === "luxury" && "“"}{wish.message}{visualStyle === "luxury" && "”"}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <motion.button
                  onClick={handleLike}
                  aria-label={wish.liked ? `Unlike my wishes ${wish.name}` : `Liked your wishes ${wish.name}`}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 border ${
                    wish.liked
                      ? "border-red-200 bg-red-50 text-red-500"
                      : visualStyle === "luxury" || visualStyle === "neon"
                        ? "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                        : "border-transparent bg-muted/30 text-muted-foreground/60 hover:bg-muted/50"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 transition-all ${wish.liked ? "fill-red-500 text-red-500" : ""}`} />
                  {wish.likes > 0 && <span>{wish.likes}</span>}
                </motion.button>

                <div className="relative">
                  <motion.button
                    onClick={() => setShowReactions(!showReactions)}
                    aria-label={`Express your feelings with wishes from ${wish.name}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${visualStyle === "luxury" || visualStyle === "neon" ? "bg-white/5 text-white/50 hover:bg-white/10" : "bg-muted/30 text-muted-foreground/50 hover:bg-muted/50"} transition-colors`}
                  >
                    <Star className="w-3 h-3" />
                  </motion.button>
                  <AnimatePresence>
                    {showReactions && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.9 }}
                        className="absolute bottom-full mb-1 left-0 flex gap-1 bg-card rounded-full px-2 py-1 shadow-lg border border-border z-10"
                      >
                        {reactionEmojis.map((emoji) => (
                          <motion.button
                            key={emoji}
                            aria-label={`Choose emotions ${emoji}`}
                            whileHover={{ scale: 1.4, y: -3 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => setShowReactions(false)}
                            className="w-7 h-7 flex items-center justify-center text-sm hover:bg-muted/30 rounded-full transition-colors"
                          >
                            {emoji}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {visualStyle === "polaroid" && (
            <p className="absolute bottom-2 left-0 right-0 text-center font-display text-xs italic text-stone-400">
              — with love —
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});
WishBubble.displayName = "WishBubble";

const WishForm = ({
  accentColor,
  onSubmit,
  onCancel,
}: {
  accentColor: string;
  onSubmit: (name: string, message: string, emoji: string) => Promise<void>;
  onCancel: () => void;
}) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("💕");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 600));
    try {
      await onSubmit(name, message, selectedEmoji);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.92 }}
      transition={{ type: "spring", damping: 22, stiffness: 260 }}
      onSubmit={handleSubmit}
      className="relative bg-card/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-border overflow-hidden"
    >
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
        style={{
          background: `linear-gradient(90deg, ${accentColor}00, ${accentColor}, ${accentColor}00)`,
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="p-6 pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${accentColor}12` }}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <PenLine className="w-5 h-5" style={{ color: accentColor }} />
          </motion.div>
          <div>
            <h4 className="font-display text-lg font-bold text-foreground">Send greetings</h4>
            <p className="font-body text-xs text-muted-foreground">Share the joy with the bride & groom</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="relative group"
        >
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-foreground transition-colors" />
          <input
            data-testid="wish-name"
            ref={inputRef}
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-border/60 bg-background/50 font-body text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ "--tw-ring-color": `${accentColor}60` } as React.CSSProperties}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <textarea
            data-testid="wish-message"
            placeholder="Write wishes to the bride & groom..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-3.5 rounded-xl border border-border/60 bg-background/50 font-body text-sm focus:outline-none focus:ring-2 resize-none transition-all"
            style={{ "--tw-ring-color": `${accentColor}60` } as React.CSSProperties}
          />
          <span className="absolute bottom-2 right-3 font-body text-[10px] text-muted-foreground/30">
            {message.length}/200
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/60 font-body text-xs text-muted-foreground hover:border-border hover:bg-muted/30 transition-all"
          >
            <motion.span
              className="text-lg"
              animate={showEmojiPicker ? { rotate: [0, 20, -20, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              {selectedEmoji}
            </motion.span>
            Select icon
          </button>
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.9 }}
                className="absolute bottom-full mb-2 left-0 bg-card rounded-2xl p-3 shadow-2xl border border-border grid grid-cols-6 gap-1.5 z-10"
              >
                {emojiOptions.map((emoji, i) => (
                  <motion.button
                    key={emoji}
                    type="button"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ scale: 1.3, y: -4 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => {
                      setSelectedEmoji(emoji);
                      setShowEmojiPicker(false);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                      selectedEmoji === emoji
                        ? "ring-2 scale-110 bg-muted/40"
                        : "hover:bg-muted/30"
                    }`}
                    style={
                      selectedEmoji === emoji
                        ? ({ "--tw-ring-color": accentColor } as React.CSSProperties)
                        : {}
                    }
                  >
                    {emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 pt-2"
        >
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3.5 rounded-xl border border-border/60 font-body text-sm text-muted-foreground hover:bg-muted/30 transition-all"
          >
            Cancel
          </motion.button>
          <motion.button
            data-testid="wish-submit"
            type="submit"
            disabled={isSending}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-body text-sm font-semibold shadow-lg disabled:opacity-70 transition-all"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 6px 24px ${accentColor}30`,
            }}
          >
            {isSending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Sending Wishes
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.form>
  );
};

const animStyles: Array<"slide" | "pop" | "flip" | "wave" | "float"> = ["slide", "pop", "flip", "wave", "float"];

const wishFlowClasses: Record<TemplateLayoutProfile["wishes"]["flow"], string> = {
  grid: "grid grid-cols-1 gap-3.5 @md:grid-cols-2 @lg:grid-cols-3",
  columns: "columns-1 gap-4 @md:columns-2 @lg:columns-3",
  rail: "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-1 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  ledger: "mx-auto max-w-3xl divide-y divide-border/50 border-y border-border/50",
  staggered: "grid grid-cols-1 gap-5 @md:grid-cols-2 @lg:grid-cols-3 @md:pb-6",
  featured: "grid grid-cols-1 gap-4 @md:grid-cols-2 @lg:grid-cols-4",
};

const wishItemClass = (profile: TemplateLayoutProfile["wishes"], index: number) => {
  switch (profile.flow) {
    case "columns":
      return "mb-4 break-inside-avoid";
    case "rail":
      return "w-[82vw] max-w-sm shrink-0 snap-center @md:w-[360px]";
    case "ledger":
      return `py-4 ${index % 2 ? "@md:pl-14" : "@md:pr-14"}`;
    case "staggered":
      return index % 2 ? "@md:translate-y-6 @md:rotate-[0.6deg]" : "@md:-rotate-[0.6deg]";
    case "featured":
      return index === 0 ? "@md:col-span-2 @lg:col-span-2 @lg:row-span-2" : "";
    default:
      return "";
  }
};

const WishesHeader = ({
  visualStyle,
  accentColor,
  eyebrow,
  title,
  label,
  count,
  isEditorialHeader,
}: {
  visualStyle: WishStyle;
  accentColor: string;
  eyebrow: string;
  title: string;
  label: string;
  count: number;
  isEditorialHeader: boolean;
}) => {
  if (visualStyle === "luxury" || visualStyle === "royal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
          <Crown className="w-5 h-5 text-amber-500/70" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
        </div>
        <p className="font-serif text-[10px] tracking-[0.4em] uppercase text-amber-600/60 mb-2">{eyebrow}</p>
        <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">{title}</h2>
        <div className="inline-block border border-amber-500/30 px-6 py-2">
          <span className="font-serif text-[11px] tracking-widest text-amber-600/80 uppercase">{count} {label}</span>
        </div>
      </motion.div>
    );
  }

  if (visualStyle === "vintage" || visualStyle === "polaroid") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12 relative"
      >
        <div className="inline-block relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 opacity-60 z-10 rotate-2" style={{ background: "linear-gradient(180deg, rgba(245,235,200,0.8), rgba(220,210,170,0.6))", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }} />
          <div className="bg-[#fdfcf7] border border-stone-200 shadow-sm px-8 py-6 rotate-[-1deg]">
            <p className="font-mono text-[10px] text-stone-500 tracking-widest uppercase mb-2">{eyebrow}</p>
            <h2 className="font-serif text-4xl text-stone-800">{title}</h2>
            <div className="mt-4 flex justify-center">
              <span className="bg-stone-100 text-stone-600 px-3 py-1 text-xs font-mono border border-stone-200">Archive: {count} {label}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (visualStyle === "pixel" || visualStyle === "flat2d") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-block border-4 border-black bg-white px-8 py-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <p className="font-sans font-black text-xs uppercase tracking-widest text-black mb-2">{eyebrow}</p>
          <h2 className={`font-sans font-black text-4xl md:text-5xl uppercase text-black ${visualStyle === "pixel" ? "font-mono tracking-tighter" : ""}`}>{title}</h2>
          <div className="mt-4 inline-flex items-center gap-2 border-2 border-black px-4 py-1 bg-yellow-300">
            <span className="font-black text-xs uppercase text-black">Total: {count}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  if (visualStyle === "minimal") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="font-sans text-5xl md:text-7xl font-light tracking-tighter text-foreground mb-4">{title}</h2>
        <div className="flex items-center gap-6">
          <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">{eyebrow}</p>
          <span className="w-12 h-[1px] bg-border" />
          <p className="font-sans text-xs text-muted-foreground">{count} {label}</p>
        </div>
      </motion.div>
    );
  }

  // Default / Bubble / Romantic / Korean
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className={`${isEditorialHeader ? "border-y border-border/50 py-8 text-left" : "text-center"} mb-10`}
    >
      <div className={`mb-3 inline-flex items-center gap-2.5 ${isEditorialHeader ? "justify-start" : "justify-center"}`}>
        <span className="h-[1px] w-8" style={{ background: `linear-gradient(to right, transparent, ${accentColor})` }} />
        <MessageCircleHeart className="w-4 h-4" style={{ color: accentColor }} />
        <span className="text-[10px] tracking-[0.5em] uppercase font-body" style={{ color: accentColor }}>
          {eyebrow}
        </span>
        <MessageCircleHeart className="w-4 h-4" style={{ color: accentColor }} />
        <span className="h-[1px] w-8" style={{ background: `linear-gradient(to left, transparent, ${accentColor})` }} />
      </div>

      <h2 className={`font-display text-3xl font-bold text-foreground @md:text-4xl ${isEditorialHeader ? "max-w-2xl @md:text-6xl" : ""}`}>
        {title}
      </h2>

      <div className={`mt-4 flex items-center gap-4 ${isEditorialHeader ? "justify-start" : "justify-center"}`}>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/30 border border-border/40">
          <Heart className="w-3 h-3" style={{ color: accentColor }} />
          <span className="font-body text-[11px] font-semibold text-foreground">{count}</span>
          <span className="font-body text-[10px] text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/30 border border-border/40">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#4ade80" }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="font-body text-[10px] text-muted-foreground">live</span>
        </div>
      </div>
    </motion.div>
  );
};

export const DefaultWishesWall = ({ accentColor, theme, publicSlug, embedded = false }: { accentColor: string; theme?: WeddingTheme; publicSlug?: string; embedded?: boolean }) => {
  const visualStyle: WishStyle = (() => {
    const t = theme?.id || "canvas";
    if (t === "pixel") return "pixel";
    if (t === "flat2d") return "flat2d";
    if (t === "vintage") return "vintage";
    if (t === "royal") return "royal";
    if (t === "cyberpunk_luxe") return "neon";
    if (t === "photo25d") return "polaroid";
    if (t === "korean") return "korean";
    if (t === "romantic") return "romantic";
    if (t === "minimalist") return "minimal";
    if (t === "luxury") return "luxury";
    if (t === "modern" || t === "magazine" || t === "nordic_aurora") return "platinum";
    if (t === "tropical") return "ocean";
    if (t === "rustic") return "vintage";
    if (t === "boho") return "polaroid";
    if (t === "sakura" || t === "garden") return "dream";
    if (t === "layered3d") return "luxury";
    if (t === "cosmic") return "neon";
    if (t === "traditional") return "royal";
    return "bubble";
  })();

  const presentation = getTemplatePresentation(theme?.id);
  const layoutProfile = getTemplateLayout(theme?.id);
  const wishesLayout = layoutProfile.wishes;
  const isEditorialHeader = ["editorial-notes", "reader-columns", "archive-columns"].includes(wishesLayout.composition);

  const { wishes, handleLike, handleSubmit: handleWishSubmit } = useWishesData(publicSlug);
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [animStyle, setAnimStyle] = useState<(typeof animStyles)[number]>(presentation.wishAnimation);

  useEffect(() => {
    setAnimStyle(presentation.wishAnimation);
  }, [presentation.wishAnimation]);

  const handleSubmit = async (name: string, message: string, emoji: string) => {
    await handleWishSubmit(name, message, emoji);
    setShowForm(false);
  };

  const visibleWishes = showAll ? wishes : wishes.slice(0, 6);

  return (
    <section id="wishes" className="scroll-mt-20 py-16 px-4 relative overflow-hidden">
      <FloatingElements emojis={theme?.petalEmojis} />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: `radial-gradient(circle, ${accentColor}, transparent)` }}
          animate={{ scale: [1.3, 1, 1.3] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div className={`relative z-10 mx-auto ${wishesLayout.flow === "rail" ? "max-w-6xl" : "max-w-5xl"}`} data-wishes-layout={wishesLayout.composition}>
        {!embedded && (
          <WishesHeader
            visualStyle={visualStyle}
            accentColor={accentColor}
            eyebrow={presentation.wishes.eyebrow}
            title={presentation.wishes.title}
            label={wishesLayout.label}
            count={wishes.length}
            isEditorialHeader={isEditorialHeader}
          />
        )}

        {embedded && (
          <div className={`mb-8 flex items-center gap-4 border-b border-border/45 pb-4 ${isEditorialHeader ? "justify-start" : "justify-center"}`}>
            <span className="font-body text-[9px] font-bold uppercase tracking-[0.24em]" style={{ color: accentColor }}>{wishesLayout.label}</span>
            <span className="h-px w-10" style={{ backgroundColor: `${accentColor}70` }} />
            <span className="font-body text-[10px] text-muted-foreground">{wishes.length} wishes</span>
          </div>
        )}

        <div className={`${wishFlowClasses[wishesLayout.flow]} mb-8`}>
          <AnimatePresence mode="popLayout">
            {visibleWishes.map((wish, i) => (
              <motion.div layout key={wish.id} className={wishItemClass(wishesLayout, i)}>
                <WishBubble
                  wish={wish}
                  index={i}
                  accentColor={accentColor}
                  onLike={handleLike}
                  animStyle={animStyle}
                  visualStyle={visualStyle}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {wishes.length > 6 && !showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(true)}
              className="font-body text-sm px-6 py-2 rounded-full border border-border/60 hover:bg-muted/30 transition-all"
              style={{ color: accentColor }}
            >
              See more {wishes.length - 6} wishes ✨
            </motion.button>
          </motion.div>
        )}

        <div className={`${wishesLayout.flow === "ledger" ? "max-w-2xl" : "max-w-lg"} mx-auto`}>
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <motion.button
                  data-testid="wish-open-form"
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(true)}
                  className="relative inline-flex items-center gap-3 px-10 py-4 rounded-full text-white font-body font-semibold text-base overflow-hidden group"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 8px 32px ${accentColor}35`,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)`,
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <PartyPopper className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">{presentation.wishes.cta}</span>
                </motion.button>
              </motion.div>
            ) : (
              <WishForm
                key="form"
                accentColor={accentColor}
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};



