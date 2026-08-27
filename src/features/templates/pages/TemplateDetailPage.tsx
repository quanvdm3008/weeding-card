import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Check, Eye, Heart, Sparkles, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/LocaleProvider";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { formatUsageCount, getTemplateById } from "../catalog/templateCatalog";
import { useTemplateFavorites } from "../store/templateFavoritesStore";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasDetailPage } from "./CanvasDetailPage";

const STAGGER_CHILD = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const TemplateDetailPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { t } = useLocale();
  const template = getTemplateById(templateId);
  const favoriteIds = useTemplateFavorites((state) => state.favoriteIds);
  const toggleFavorite = useTemplateFavorites((state) => state.toggleFavorite);
  const reset = useWeddingConfig((state) => state.reset);
  const setTemplate = useWeddingConfig((state) => state.setTemplate);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [templateId]);

  if (!template) return <Navigate to="/dashboard" replace />;
  if (template.id === "canvas") return <CanvasDetailPage template={template} />;

  const isFavorite = favoriteIds.includes(template.id);
  const updatedAt = new Date(template.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const editTemplate = () => {
    reset();
    setTemplate(template.id);
    navigate(`/editor?${new URLSearchParams({ template: template.id, workspace: "guided" })}`);
  };

  const primaryColor = template.colors[0] || "#ffffff";
  const secondaryColor = template.colors[1] || primaryColor;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-black selection:text-white">
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-20 dark:opacity-10 animate-pulse"
          style={{ backgroundColor: primaryColor, animationDuration: '10s' }}
        />
        <div 
          className="absolute top-[10%] -right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 dark:opacity-10 animate-pulse"
          style={{ backgroundColor: secondaryColor, animationDuration: '15s' }}
        />
      </div>

      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/60 shadow-sm backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border border-black/5 dark:border-white/10"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">{t("template.back")}</span>
          </button>
          
          <p className="truncate text-center font-display text-lg font-semibold tracking-tight">{template.name}</p>
          
          <button
            type="button"
            onClick={() => toggleFavorite(template.id)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-sm transition hover:scale-105 active:scale-95"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-4 w-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pb-32 pt-24 sm:pt-32">
        {/* Immersive Hero */}
        <motion.section 
          initial="hidden"
          animate="show"
          variants={STAGGER_CONTAINER}
          className="grid lg:grid-cols-[1fr_450px] gap-12 lg:gap-20 items-center min-h-[65vh]"
        >
          {/* Left: Presentation Image */}
          <motion.div variants={STAGGER_CHILD} className="order-2 lg:order-1 relative w-full aspect-[3/4] max-h-[80vh] mx-auto group perspective-1000">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-black/5 to-white/10 transform rotate-1 scale-[1.02] -z-10 transition-transform duration-700 group-hover:rotate-2" />
            <div className="w-full h-full rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl bg-muted relative z-10 transform transition-transform duration-700 group-hover:scale-[1.01]">
              <img
                src={template.previewImages[0]}
                alt={`Preview of ${template.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 flex gap-2">
                <span className="rounded-full bg-black/30 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-white border border-white/20 shadow-sm">
                  {template.category}
                </span>
                {template.isNew && (
                  <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-white border border-white/20 shadow-sm">
                    {t("template.new")}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Template Details */}
          <motion.div variants={STAGGER_CHILD} className="order-1 lg:order-2 flex flex-col justify-center">
            <motion.div variants={STAGGER_CHILD} className="flex items-center gap-3 text-sm font-medium">
              <span className="flex items-center gap-1 rounded-full bg-amber-400/10 text-amber-600 dark:text-amber-400 px-3 py-1">
                <Star className="h-3.5 w-3.5 fill-current" />
                {template.rating}
              </span>
              <span className="text-muted-foreground">{template.reviewCount} reviews</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{formatUsageCount(template.usageCount)}+ used</span>
            </motion.div>

            <motion.h1 variants={STAGGER_CHILD} className="mt-6 font-display text-5xl sm:text-7xl font-semibold leading-[1.1] tracking-tight">
              {template.name}
            </motion.h1>
            
            <motion.p variants={STAGGER_CHILD} className="mt-6 text-xl sm:text-2xl font-light leading-relaxed text-muted-foreground">
              {template.tagline}
            </motion.p>
            
            <motion.p variants={STAGGER_CHILD} className="mt-4 text-sm sm:text-base leading-7 text-muted-foreground/80 max-w-lg">
              {template.description}
            </motion.p>

            <motion.div variants={STAGGER_CHILD} className="mt-8 flex flex-wrap gap-2">
              {template.highlights.slice(0, 3).map((highlight) => (
                <span key={highlight} className="rounded-full border border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-sm px-4 py-2 text-xs font-medium">
                  {highlight}
                </span>
              ))}
            </motion.div>

            <motion.div variants={STAGGER_CHILD} className="mt-8 flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Palette</span>
              <div className="flex gap-2">
                {template.colors.map((color) => (
                  <span 
                    key={color} 
                    className="h-8 w-8 rounded-full border-2 border-background shadow-md transform transition-transform hover:scale-110" 
                    style={{ backgroundColor: color }} 
                    title={color} 
                  />
                ))}
              </div>
            </motion.div>

            <motion.div variants={STAGGER_CHILD} className="mt-12 hidden sm:flex gap-4">
              <Button 
                className="h-14 rounded-full px-8 text-base shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl" 
                size="lg" 
                onClick={editTemplate}
              >
                <Sparkles className="mr-2 h-5 w-5" /> {t("template.customize")}
              </Button>
              <Button
                className="h-14 rounded-full px-8 text-base bg-white/50 dark:bg-black/50 backdrop-blur-md border border-black/10 dark:border-white/10 transition-all hover:-translate-y-1"
                size="lg"
                variant="outline"
                onClick={() => navigate(`/view?t=${template.id}&preview=1`)}
              >
                <Eye className="mr-2 h-5 w-5" /> {t("template.viewDetail")}
              </Button>
            </motion.div>
          </motion.div>
        </motion.section>

        <div className="mt-20 sm:mt-32 w-full flex justify-center text-muted-foreground/50 animate-bounce">
          <ChevronDown className="h-6 w-6" />
        </div>

        {/* Detailed Sections (Glassmorphic Grid) */}
        <motion.section 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CONTAINER}
          className="mt-20 sm:mt-32 grid gap-6 lg:grid-cols-[1.5fr_1fr]"
        >
          <motion.article variants={STAGGER_CHILD} className="rounded-[2rem] border border-white/20 bg-white/40 dark:bg-black/40 p-8 sm:p-12 shadow-xl backdrop-blur-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10">
                <Check className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">Details</p>
                <h2 className="font-display text-3xl font-semibold">Design Specifications</h2>
              </div>
            </div>
            
            <p className="text-base leading-relaxed text-muted-foreground mb-10">
              {template.mood}. A complete invitation layout ready for your names, photos, schedule and wedding details.
            </p>

            <dl className="grid sm:grid-cols-2 gap-4">
              {[
                [t("template.author"), template.author],
                [t("template.version"), template.version],
                [t("template.updated"), updatedAt],
                [t("template.used"), `${formatUsageCount(template.usageCount)} invitations`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/50 dark:bg-black/50 p-6 border border-white/10">
                  <dt className="text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground mb-2">{label}</dt>
                  <dd className="text-lg font-semibold">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-6">Highlights</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {template.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-3 text-sm font-medium">
                    <div className="h-8 w-8 rounded-full bg-white/60 dark:bg-black/60 flex items-center justify-center shadow-sm">
                      <Check className="h-4 w-4" style={{ color: primaryColor }} />
                    </div>
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          </motion.article>

          <motion.aside variants={STAGGER_CHILD} className="rounded-[2rem] border border-white/20 bg-white/40 dark:bg-black/40 p-8 sm:p-12 shadow-xl backdrop-blur-2xl flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">Included</p>
                <h2 className="font-display text-3xl font-semibold">What you receive</h2>
              </div>
            </div>
            
            <ul className="flex-1 flex flex-col gap-3">
              {template.includedPages.map((page) => (
                <li key={page} className="group flex items-center justify-between rounded-2xl border border-white/20 bg-white/50 dark:bg-black/50 px-6 py-4 transition-all hover:bg-white/80 dark:hover:bg-white/10">
                  <span className="font-medium">{page}</span>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-black/5 dark:bg-white/10 text-muted-foreground group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    <Check className="h-3 w-3" />
                  </span>
                </li>
              ))}
            </ul>
          </motion.aside>
        </motion.section>

        {/* Feedback Section */}
        <motion.section 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={STAGGER_CONTAINER}
          className="mt-6 rounded-[2rem] border border-white/20 bg-white/40 dark:bg-black/40 p-8 sm:p-12 shadow-xl backdrop-blur-2xl"
        >
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-black/5 dark:border-white/10 pb-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-muted-foreground">Feedback</p>
                <h2 className="font-display text-3xl font-semibold">Ratings & Reviews</h2>
              </div>
            </div>
            <span className="rounded-full bg-white/60 dark:bg-black/60 px-4 py-2 text-sm font-medium">{template.reviewCount} verified reviews</span>
          </div>

          <div className="grid gap-12 pt-10 lg:grid-cols-[300px_minmax(0,1fr)]">
            <motion.div variants={STAGGER_CHILD}>
              <div className="flex items-end gap-3">
                <span className="font-display text-7xl font-bold leading-none tracking-tighter">{template.rating}</span>
                <span className="pb-2 text-lg text-muted-foreground font-medium">/ 5</span>
              </div>
              <Stars className="mt-4 h-6 w-6" />
              <div className="mt-8 space-y-3">
                {[[5, 79], [4, 15], [3, 4], [2, 1], [1, 1]].map(([stars, percent]) => (
                  <div key={stars} className="grid grid-cols-[2.5rem_1fr_3rem] items-center gap-3 text-sm font-medium text-muted-foreground">
                    <span>{stars} <Star className="inline h-3 w-3 mb-0.5" /></span>
                    <span className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                      <span className="block h-full rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]" style={{ width: `${percent}%` }} />
                    </span>
                    <span className="text-right">{percent}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-6">
              {[
                { name: "Linh & Nam", date: "July 18, 2026", text: `${template.name} looks polished on both phones and laptops. Editing our photos and wedding details was very straightforward.` },
                { name: "Mai & Quang", date: "July 11, 2026", text: "The invitation was easy to personalize and our guests had no trouble viewing the schedule or sending their RSVP. The premium feel is real." },
              ].map((review) => (
                <motion.article key={review.name} variants={STAGGER_CHILD} className="rounded-2xl border border-white/20 bg-white/50 dark:bg-black/50 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <p className="text-base font-semibold">{review.name}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <BadgeCheck className="h-4 w-4" /> Verified order
                      </p>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full">{review.date}</span>
                  </div>
                  <Stars className="h-4 w-4" />
                  <p className="mt-4 text-base leading-relaxed text-foreground/80">{review.text}</p>
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
          className="fixed bottom-0 inset-x-0 z-50 sm:hidden p-4 bg-background/80 backdrop-blur-2xl border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
        >
          <div className="flex gap-3 max-w-md mx-auto">
            <Button 
              className="flex-1 h-12 rounded-xl shadow-lg" 
              onClick={editTemplate}
            >
              <Sparkles className="mr-2 h-4 w-4" /> {t("template.customize")}
            </Button>
            <Button
              className="flex-1 h-12 rounded-xl bg-muted/50 border border-white/20"
              variant="outline"
              onClick={() => navigate(`/view?t=${template.id}&preview=1`)}
            >
              <Eye className="mr-2 h-4 w-4" /> {t("template.viewDetail")}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

function Stars({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <div className="flex gap-1 text-amber-400" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={`${className} fill-current`} />
      ))}
    </div>
  );
}

export default TemplateDetailPage;
