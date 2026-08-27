import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Menu, X, LogOut, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLocale } from "@/i18n/LocaleProvider";

const links = [
  { href: "#templates", labelKey: "nav.templates" },
  { href: "#features", labelKey: "nav.features" },
  { href: "#how-it-works", labelKey: "nav.how" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const { t } = useLocale();
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goBuilder = () => navigate(user ? "/dashboard#template-marketplace" : "/#start");

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
      {/* Animated backdrop */}
      <motion.div
        className="absolute inset-0 border-b"
        style={{
          opacity: navOpacity,
          background: "hsl(18 100% 98% / 0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "hsl(var(--border) / 0.5)",
        }}
      />
      {/* Gold accent line at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] origin-left"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(38 55% 65% / 0.5), transparent)",
          scaleX: navOpacity,
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.span
            className="relative w-9 h-9 rounded-full flex items-center justify-center shadow-gold overflow-hidden"
            style={{ background: "linear-gradient(135deg, hsl(346 45% 65%), hsl(38 55% 62%))" }}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Heart className="w-4 h-4 text-white fill-white relative z-10" />
          </motion.span>
          <span className="font-display text-xl font-semibold tracking-tight text-foreground">
            Mireia<span style={{ color: "hsl(var(--accent))" }}>.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => <a key={link.href} href={link.href} className="relative font-body text-sm font-medium text-foreground/70 transition-colors hover:text-foreground group">
            {t(link.labelKey)}
            <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 rounded-full transition-all duration-300 group-hover:w-full" style={{ background: "hsl(var(--accent))" }} />
          </a>)}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="font-body text-sm font-medium text-foreground/75 hover:text-foreground transition-colors">
                {t("nav.myInvitations")}
              </Link>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border font-body text-xs font-medium hover:bg-muted transition-colors"
                style={{ borderColor: "hsl(var(--border) / 0.8)" }}
              >
                <LogOut className="w-3.5 h-3.5" /> {t("nav.logout")}
              </button>
            </>
          ) : (
            <Link to="/login" className="font-body text-sm font-medium text-foreground/75 hover:text-foreground transition-colors">
              {t("nav.login")}
            </Link>
          )}
          <motion.button
            onClick={goBuilder}
            className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-body text-sm font-semibold overflow-hidden shadow-gold"
            style={{ background: "linear-gradient(135deg, hsl(346 45% 60%), hsl(38 55% 62%))" }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Sparkles className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">{t("nav.create")}</span>
          </motion.button>
        </div>

        {/* Mobile menu toggle */}
        <motion.button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2.5 rounded-full border bg-card/80 backdrop-blur"
          style={{ borderColor: "hsl(var(--border) / 0.6)" }}
          whileTap={{ scale: 0.9 }}
          aria-label="Menu"
        >
          <AnimatePresence mode="wait">
            {open
              ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-5 h-5" /></motion.div>
              : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Menu className="w-5 h-5" /></motion.div>
            }
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="lg:hidden mt-2 mx-4 rounded-2xl border p-5 flex flex-col gap-1 origin-top"
            style={{
              background: "hsl(18 100% 98% / 0.95)",
              backdropFilter: "blur(20px)",
              borderColor: "hsl(var(--border) / 0.5)",
              boxShadow: "0 16px 40px -12px hsl(346 40% 50% / 0.15)",
            }}
          >
            {links.map((link, index) => <motion.div key={link.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
              <a href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 font-body text-base font-medium text-foreground/80 transition-colors hover:bg-muted/60">{t(link.labelKey)}</a>
            </motion.div>)}
            <div className="h-px my-2" style={{ background: "hsl(var(--border) / 0.5)" }} />
            {user ? (
              <Link to="/dashboard" onClick={() => setOpen(false)} className="block font-body text-base text-foreground/80 py-2.5 px-3 rounded-xl hover:bg-muted/60 transition-colors">
                {t("nav.myInvitations")}
              </Link>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="block font-body text-base text-foreground/80 py-2.5 px-3 rounded-xl hover:bg-muted/60 transition-colors">
                {t("nav.login")}
              </Link>
            )}
            <motion.button
              onClick={() => { setOpen(false); goBuilder(); }}
              className="mt-1 w-full py-3.5 rounded-2xl text-white font-body text-sm font-semibold shadow-gold"
              style={{ background: "linear-gradient(135deg, hsl(346 45% 60%), hsl(38 55% 62%))" }}
              whileTap={{ scale: 0.97 }}
            >
              {t("nav.create")}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
