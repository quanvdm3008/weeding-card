import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Box, Eye, Heart, Layers, Paintbrush, PenTool, Type, Zap, Star, BadgeCheck, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/LocaleProvider";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { formatUsageCount } from "../catalog/templateCatalog";
import type { TemplateCatalogItem } from "../catalog/templateCatalog";
import { useTemplateFavorites } from "../store/templateFavoritesStore";
import { motion, AnimatePresence } from "framer-motion";

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const FLOAT_ANIMATION = {
  y: [0, -15, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  }
};

export const CanvasDetailPage = ({ template }: { template: TemplateCatalogItem }) => {
  const navigate = useNavigate();
  const { t } = useLocale();
  const favoriteIds = useTemplateFavorites((state) => state.favoriteIds);
  const toggleFavorite = useTemplateFavorites((state) => state.toggleFavorite);
  const reset = useWeddingConfig((state) => state.reset);
  const setTemplate = useWeddingConfig((state) => state.setTemplate);

  useEffect(() => window.scrollTo(0, 0), []);

  if (!template) return <Navigate to="/dashboard" replace />;

  const isFavorite = favoriteIds.includes(template.id);
  
  const editTemplate = () => {
    reset();
    setTemplate(template.id);
    navigate(`/editor?${new URLSearchParams({ template: template.id, workspace: "blank" })}`);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black font-sans relative overflow-x-hidden">
      {/* Dynamic Studio Dot Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40" 
           style={{
             backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
             backgroundSize: '32px 32px'
           }}
      />

      <div className="absolute top-0 inset-x-0 h-[50vh] bg-gradient-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />

      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-neutral-950/80 shadow-sm backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-black border border-white/10"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">{t("template.back")}</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-blue-400" />
            <p className="truncate text-center font-display text-lg font-semibold tracking-tight">Studio Builder</p>
          </div>
          
          <button
            type="button"
            onClick={() => toggleFavorite(template.id)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-sm transition hover:scale-105 active:scale-95"
          >
            <Heart className={`h-4 w-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-neutral-400"}`} />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-32 pt-32 sm:pt-40">
        <motion.section 
          initial="hidden"
          animate="show"
          variants={STAGGER_CONTAINER}
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <motion.div variants={STAGGER_CHILD} className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 mb-8">
            <Zap className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Blank Canvas Edition</span>
          </motion.div>

          <motion.h1 variants={STAGGER_CHILD} className="font-display text-5xl sm:text-7xl lg:text-8xl font-semibold leading-[1.1] tracking-tight">
            Design without <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">limits</span>.
          </motion.h1>
          
          <motion.p variants={STAGGER_CHILD} className="mt-8 text-xl sm:text-2xl font-light leading-relaxed text-neutral-400 max-w-2xl">
            {template.description}
          </motion.p>

          <motion.div variants={STAGGER_CHILD} className="mt-12 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Button 
              className="h-14 rounded-full px-8 text-base shadow-xl transition-all hover:-translate-y-1 hover:shadow-blue-500/20 bg-blue-600 hover:bg-blue-500 text-white border-0" 
              size="lg" 
              onClick={editTemplate}
            >
              <Paintbrush className="mr-2 h-5 w-5" /> Start from Scratch
            </Button>
            <Button
              className="h-14 rounded-full px-8 text-base bg-white/5 backdrop-blur-md border border-white/10 transition-all hover:-translate-y-1 hover:bg-white/10"
              size="lg"
              variant="outline"
              onClick={() => navigate(`/dashboard`)}
            >
              Explore Templates instead
            </Button>
          </motion.div>
        </motion.section>

        {/* Floating Canvas UI Representation */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-24 relative max-w-5xl mx-auto"
        >
          {/* Main Canvas Card */}
          <div className="aspect-video w-full rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-dot-pattern opacity-50" />
            <div className="relative z-10 w-2/3 h-2/3 border-2 border-dashed border-neutral-700 rounded-xl flex items-center justify-center bg-neutral-950/50">
              <span className="text-neutral-500 font-medium">Your Masterpiece Goes Here</span>
            </div>
            
            {/* Floating Editor Widgets */}
            <motion.div 
              animate={FLOAT_ANIMATION} 
              className="absolute top-1/4 left-1/4 p-3 bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl flex items-center gap-2"
            >
              <Type className="h-5 w-5 text-indigo-400" />
              <div className="w-16 h-2 bg-neutral-700 rounded-full" />
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0], transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } }} 
              className="absolute bottom-1/4 right-1/4 p-3 bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl flex items-center gap-2"
            >
              <Box className="h-5 w-5 text-pink-400" />
              <div className="w-12 h-2 bg-neutral-700 rounded-full" />
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, -20, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }} 
              className="absolute top-1/3 right-1/3 p-4 bg-neutral-800 border border-neutral-700 rounded-full shadow-xl"
            >
              <PenTool className="h-6 w-6 text-emerald-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Builder Features Grid */}
        <motion.section 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CONTAINER}
          className="mt-32 grid gap-6 sm:grid-cols-3"
        >
          {[
            {
              icon: <Layers className="h-6 w-6 text-blue-400" />,
              title: "100% Customizable",
              desc: "Don't like our templates? Build yours pixel-perfectly using our extensive component library."
            },
            {
              icon: <Box className="h-6 w-6 text-purple-400" />,
              title: "Drag & Drop UI",
              desc: "Effortlessly drag blocks, sections, and widgets into your canvas. Watch them snap into a responsive grid."
            },
            {
              icon: <Eye className="h-6 w-6 text-emerald-400" />,
              title: "Live Preview",
              desc: "See exactly what your guests will see. Your canvas auto-adapts for Mobile, Tablet, and Desktop displays."
            }
          ].map((feature, idx) => (
            <motion.div key={idx} variants={STAGGER_CHILD} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-md">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-neutral-400 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.section>

        {/* Feedback Section (Optional for Canvas, but kept to show it is a "product") */}
        <motion.section 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CONTAINER}
          className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:p-12 backdrop-blur-md"
        >
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-white/10">
                <Star className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-neutral-400">Builder Feedback</p>
                <h2 className="font-display text-3xl font-semibold">Creator Reviews</h2>
              </div>
            </div>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium">{formatUsageCount(template.usageCount)} Creators</span>
          </div>

          <div className="grid gap-12 pt-10 lg:grid-cols-[200px_minmax(0,1fr)]">
            <motion.div variants={STAGGER_CHILD}>
              <div className="flex items-end gap-3">
                <span className="font-display text-6xl font-bold leading-none tracking-tighter">{template.rating}</span>
                <span className="pb-1 text-lg text-neutral-400 font-medium">/ 5</span>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { name: "Phuong & Huy", date: "August 2, 2026", text: "We wanted something completely out of the box. The blank canvas let us build a retro 80s themed invitation exactly how we imagined it." },
                { name: "Hoang Studio", date: "July 28, 2026", text: "As a designer, I appreciate having a blank slate. The drag and drop tools are incredibly intuitive and responsive." },
              ].map((review) => (
                <motion.article key={review.name} variants={STAGGER_CHILD} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <p className="text-sm font-semibold">{review.name}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                        <BadgeCheck className="h-3 w-3" /> Pro Creator
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-300">{review.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      {/* Sticky Mobile Actions */}
      <AnimatePresence>
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 inset-x-0 z-50 sm:hidden p-4 bg-neutral-950/80 backdrop-blur-2xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        >
          <Button 
            className="w-full h-12 rounded-xl shadow-lg bg-blue-600 hover:bg-blue-500 text-white border-0" 
            onClick={editTemplate}
          >
            <Paintbrush className="mr-2 h-4 w-4" /> Start from Scratch
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
