import { useEffect, useState } from "react";
import { CalendarHeart, HeartHandshake, Home, Images, MapPin, MessageCircleHeart } from "lucide-react";
import { motion } from "framer-motion";
import { type WeddingTheme } from "@/data/themes";
import { useLocale } from "@/i18n/LocaleProvider";

const navItems = [
  { labelKey: "invitation.home", href: "#hero", icon: Home },
  { labelKey: "invitation.story", href: "#story", icon: HeartHandshake },
  { labelKey: "invitation.album", href: "#gallery", icon: Images },
  { labelKey: "invitation.events", href: "#events", icon: MapPin },
  { labelKey: "invitation.rsvp", href: "#rsvp", icon: CalendarHeart },
];

const NavBar = ({ accentColor, theme }: { accentColor: string; theme: WeddingTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLocale();
  const isDark = ["modern", "royal", "luxury", "magazine", "traditional", "cosmic", "pixel", "cyberpunk_luxe", "nordic_aurora"].includes(theme.id);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-3 z-50 px-3"
    >
      <div
        className={`mx-auto flex max-w-4xl items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-2 shadow-xl backdrop-blur-2xl min-[520px]:justify-start ${
          scrolled
            ? isDark
              ? "border-white/15 bg-black/60"
              : "border-white/70 bg-white/80"
            : isDark
              ? "border-white/20 bg-black/35"
              : "border-white/50 bg-white/25"
        }`}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              aria-label={t(item.labelKey)}
              title={t(item.labelKey)}
              className={`group inline-flex h-10 w-10 shrink-0 items-center justify-center gap-1.5 rounded-full font-body text-[11px] font-semibold transition min-[520px]:h-auto min-[520px]:w-auto min-[520px]:px-3 min-[520px]:py-2 @sm:px-4 @sm:text-sm ${
                scrolled
                  ? isDark
                    ? "text-white/70 hover:bg-white/10 hover:text-white"
                    : "text-foreground/72 hover:bg-background/70 hover:text-foreground"
                  : isDark
                    ? "text-white/85 hover:bg-white/10 hover:text-white"
                    : "text-foreground/80 hover:bg-white/30 hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
              <span className="hidden min-[520px]:inline">{t(item.labelKey)}</span>
            </a>
          );
        })}
        <div className="ml-auto" />
        <span
          className="hidden h-8 w-8 shrink-0 place-items-center rounded-full @sm:grid"
          style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
          aria-hidden="true"
        >
          <MessageCircleHeart className="h-4 w-4" />
        </span>
      </div>
    </motion.nav>
  );
};

export default NavBar;
