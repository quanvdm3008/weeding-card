import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Heart,
  Calendar,
  Image as ImageIcon,
  MessageCircle,
  CheckCircle2,
  ChevronUp,
  Compass,
  Pencil,
} from "lucide-react";
import type { WeddingTheme } from "@/data/themes";

interface FloatingDockProps {
  accentColor: string;
  theme: WeddingTheme;
  onTriggerBurst?: () => void;
  onOpenStory?: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  accentColor,
  theme,
  onTriggerBurst,
  onOpenStory,
  onScrollToSection,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [navOpen, setNavOpen] = useState(false);
  const [burstCount, setBurstCount] = useState(0);

  const currentTemplateId = searchParams.get("t") || theme?.id || "romantic";

  const sections = [
    { id: "hero", label: "Top of Page", icon: Heart },
    { id: "story", label: "Journey of Love", icon: Compass },
    { id: "events", label: "Event", icon: Calendar },
    { id: "gallery", label: "Photo Album", icon: ImageIcon },
    { id: "wishes", label: "Wish", icon: MessageCircle },
    { id: "rsvp", label: "RSVP", icon: CheckCircle2 },
  ];

  const handleJump = (id: string) => {
    setNavOpen(false);
    if (onScrollToSection) {
      onScrollToSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleBurstClick = () => {
    setBurstCount((prev) => prev + 1);
    if (onTriggerBurst) onTriggerBurst();
  };

  const handleOpenBuilder = () => {
    navigate(`/templates/${currentTemplateId}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Quick Navigation Popup Menu */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="bg-black/85 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-2xl text-white min-w-[180px] space-y-1.5"
          >
            <p className="text-[10px] uppercase font-sans font-bold tracking-widest text-neutral-400 px-2.5 py-1 border-b border-white/10">
              Quickly Move Sections
            </p>
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleJump(sec.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-sans font-medium text-white/90 hover:bg-white/15 hover:text-white transition duration-200"
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  <span>{sec.label}</span>
                </button>
              );
            })}

            <div className="pt-1.5 border-t border-white/10">
              <button
                onClick={handleOpenBuilder}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-sans font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition duration-200"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Open the Configuration Form</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Control Bar */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-center gap-2 bg-black/80 backdrop-blur-2xl border border-white/20 p-2 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
      >
        {/* Form Builder Button */}
        <button
          onClick={handleOpenBuilder}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 font-sans text-xs font-semibold transition"
          title="Open the Edit UI & Card Content Form"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Edit Form</span>
        </button>

        {/* Navigation Toggle Button */}
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-semibold transition"
          title="Navigation menu"
        >
          <Compass className="w-4 h-4 text-white" />
          <span className="hidden sm:inline">Menu</span>
          <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-300 ${navOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Story Viewer Trigger Button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => {
            handleBurstClick();
            if (onOpenStory) onOpenStory();
          }}
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-rose-400 text-black shadow-md"
          title="Watch our love story"
        >
          <Sparkles className="w-4.5 h-4.5 animate-spin-slow" />
          {burstCount > 0 && (
            <motion.span
              key={burstCount}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full border border-amber-300 pointer-events-none"
            />
          )}
        </motion.button>

        {/* Quick RSVP Button */}
        <button
          onClick={() => handleJump("rsvp")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-wider text-black shadow-lg transition hover:brightness-110"
          style={{ backgroundColor: accentColor }}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>RSVP</span>
        </button>
      </motion.div>
    </div>
  );
};

export default FloatingDock;
