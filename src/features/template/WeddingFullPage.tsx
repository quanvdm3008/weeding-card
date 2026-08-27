import { lazy, Suspense, useEffect, useState, type ComponentType, type CSSProperties, type LazyExoticComponent } from "react";
import NavBar from "@/components/wedding/hero/NavBar";
import { HeroSection } from "@/components/wedding/hero/HeroVariants";
import CountdownSection from "@/components/wedding/sections/CountdownSection";
import CoupleSection from "@/components/wedding/sections/CoupleSection";
import StorySection from "@/components/wedding/sections/StorySection";
import ChatStorySection from "@/components/wedding/sections/ChatStorySection";
import EventsSection from "@/components/wedding/EventsSection";
import RSVPSection from "@/components/wedding/RSVPSection";
import ParentsSection from "@/components/wedding/sections/ParentsSection";
import TimelineSection from "@/components/wedding/sections/TimelineSection";
import { DEFAULT_SECTION_FLOW, getTemplateExperience } from "@/data/templateExperiences";
import { WEDDING_SEED_DATA, getThemeMessage } from "@/data/seedData";
import { templates } from "@/data/templates";
import { isTemplateId, type TemplateId } from "@/data/templateIds";
import { Heart, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import WishesWall from "@/components/wedding/wishes/WishesWall";
import MusicPlayer from "@/components/MusicPlayer";
import LiveWishToast from "@/components/LiveWishToast";
import TemplateOpening from "@/components/TemplateOpening";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import ScrollProgress from "@/components/ScrollProgress";
import LoveQuote from "@/components/LoveQuote";
import ScrollToTop from "@/components/ScrollToTop";
import CinematicLightBG from "@/components/cinematic/CinematicLightBG";
import GalleryDispatcher from "@/components/galleries/GalleryDispatcher";
import { StoryViewer } from "@/components/galleries/StoryViewer";
import InvitationMagicLayer from "@/components/wedding/InvitationMagicLayer";
import TravelMap from "@/components/cinematic/TravelMap";
import WeatherWidget from "@/components/cinematic/WeatherWidget";
import MemoriesSection from "@/components/cinematic/MemoriesSection";
import PhotoFrame from "@/components/PhotoFrame";
import FloatingDock from "@/components/wedding/FloatingDock";
import InvitationActionRail from "@/components/wedding/InvitationActionRail";
import { BankRegistrySection } from "@/components/wedding/sections/BankRegistrySection";
import type { TemplateProps } from "./components/types";

import { getTheme, type WeddingTheme } from "@/data/themes";
import { resolveBuilderConfig, resolveInvitationContentConfig } from "@/lib/builderConfig";
import { getLayoutStrategy } from "@/features/template/layouts";
// ─── Dedicated Templates ─────────────────────────────
// Props contract shared by every dedicated template component.
export type DedicatedTemplateProps = TemplateProps;

// Template ids with a signature layout of their own. The remaining public IDs
// deliberately use the configurable section canvas below; no unknown IDs are registered.
type DedicatedTemplateComponent = LazyExoticComponent<ComponentType<DedicatedTemplateProps>>;

const DEDICATED_TEMPLATES: Partial<Record<TemplateId, DedicatedTemplateComponent>> = {
  romantic: lazy(() => import("@/features/templates/catalog/romantic/RomanticTemplate").then((module) => ({ default: module.RomanticTemplate }))),
  luxury: lazy(() => import("@/features/templates/catalog/luxury/LuxuryTemplate").then((module) => ({ default: module.LuxuryTemplate }))),
  modern: lazy(() => import("../templates/catalog/modern/ModernTemplate").then((module) => ({ default: module.ModernTemplate }))),
  minimalist: lazy(() => import("@/features/templates/catalog/minimal/MinimalTemplate").then((module) => ({ default: module.MinimalTemplate }))),
  royal: lazy(() => import("../templates/catalog/royal/RoyalTemplate").then((module) => ({ default: module.RoyalTemplate }))),
  traditional: lazy(() => import("../templates/catalog/traditional/TraditionalTemplate").then((module) => ({ default: module.TraditionalTemplate }))),
  garden: lazy(() => import("../templates/catalog/botanical/BotanicalTemplate").then((module) => ({ default: module.BotanicalTemplate }))),
  vintage: lazy(() => import("@/features/templates/catalog/vintage/VintageTemplate").then((module) => ({ default: module.VintageTemplate }))),
  korean: lazy(() => import("@/features/templates/catalog/korean/KoreanTemplate").then((module) => ({ default: module.KoreanTemplate }))),
  magazine: lazy(() => import("../templates/catalog/editorial/EditorialTemplate").then((module) => ({ default: module.EditorialTemplate }))),
  tropical: lazy(() => import("../templates/catalog/tropical/TropicalTemplate").then((module) => ({ default: module.TropicalTemplate }))),
  flat2d: lazy(() => import("../templates/catalog/flat2d/Flat2DTemplate").then((module) => ({ default: module.Flat2DTemplate }))),
  layered3d: lazy(() => import("../templates/catalog/layered3d/LayeredTemplate").then((module) => ({ default: module.LayeredTemplate }))),
  photo25d: lazy(() => import("@/features/templates/catalog/photo25d/PhotoStack25DTemplate").then((module) => ({ default: module.PhotoStack25DTemplate }))),
  coastal: lazy(() => import("@/features/templates/catalog/coastal/CoastalTemplate").then((module) => ({ default: module.CoastalTemplate }))),
  winter: lazy(() => import("@/features/templates/catalog/winter/WinterTemplate").then((module) => ({ default: module.WinterTemplate }))),
  cosmic: lazy(() => import("../templates/catalog/cosmic/CosmicTemplate").then((module) => ({ default: module.CosmicTemplate }))),
  pixel: lazy(() => import("@/features/templates/catalog/pixel/PixelTemplate").then((module) => ({ default: module.PixelTemplate }))),
  nordic_aurora: lazy(() => import("../templates/catalog/nordicaurora/NordicAuroraTemplate").then((module) => ({ default: module.NordicAuroraTemplate }))),
  cyberpunk_luxe: lazy(() => import("../templates/catalog/neotokyo/NeoTokyoTemplate").then((module) => ({ default: module.NeoTokyoTemplate }))),
  violet_dream: lazy(() => import("@/features/templates/catalog/violet_dream/VioletDreamTemplate").then((module) => ({ default: module.VioletDreamTemplate }))),
  parallax_love: lazy(() => import("@/features/templates/catalog/parallax_love/ParallaxLoveTemplate").then((module) => ({ default: module.ParallaxLoveTemplate }))),
  boho: lazy(() => import("../templates/catalog/boho/BohoTemplate").then((module) => ({ default: module.BohoTemplate }))),
};












// ─── Footer ───────────────────────────────────────────
const WeddingFooter = ({ groomName, brideName, accentColor, decorEmoji, date, theme }: { groomName: string; brideName: string; accentColor: string; decorEmoji?: string; date?: string; theme: WeddingTheme }) => (
  <footer className="py-20 px-4 text-center relative overflow-hidden">
    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${accentColor}08, transparent)` }} />
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10">
      <div className="w-28 h-28 mx-auto mb-6">
        <PhotoFrame variant={theme.styleVariant} accentColor={accentColor} className="rounded-2xl w-full h-full">
          <img src={WEDDING_SEED_DATA.galleryImageUrls[2]} alt="" className="w-full h-full object-cover" />
        </PhotoFrame>
      </div>
      <motion.div
        className="text-5xl mb-6"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {decorEmoji || "❤️"}
      </motion.div>
      <p className="font-body text-xs tracking-[0.5em] uppercase text-muted-foreground mb-4">Forever & Always</p>
      <h3 className="font-display text-4xl @md:text-5xl font-bold text-foreground">{groomName} & {brideName}</h3>
      <div className="flex items-center justify-center gap-4 my-6">
        <div className="w-12 h-[1px]" style={{ backgroundColor: `${accentColor}40` }} />
        <Heart className="w-4 h-4" fill={accentColor} style={{ color: accentColor }} />
        <div className="w-12 h-[1px]" style={{ backgroundColor: `${accentColor}40` }} />
      </div>
      {(() => {
        if (!date) return null;
        const d = new Date(date);
        if (isNaN(d.getTime())) return null;
        return (
          <p className="font-body text-sm text-muted-foreground">
            {d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        );
      })()}
      <p className="text-muted-foreground font-body text-xs mt-6 opacity-50">
        Created with 💕 by Wedding Cards Online
      </p>
    </motion.div>
  </footer>
);

// ─── Invitation Message ───────────────────────────────
const MessageSection = ({ message, groomName, brideName, accentColor, theme }: { message?: string; groomName: string; brideName: string; accentColor: string; theme: WeddingTheme }) => (
  <section className="py-20 px-4">
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`max-w-2xl mx-auto text-center bg-card/70 backdrop-blur-sm ${theme.cardRadius} p-10 @md:p-14 border border-border shadow-lg`}>
      <div className="w-24 h-24 mx-auto mb-6">
        <PhotoFrame variant={theme.styleVariant} accentColor={accentColor} className="rounded-2xl w-full h-full">
          <img src={WEDDING_SEED_DATA.galleryImageUrls[3]} alt="" className="w-full h-full object-cover" />
        </PhotoFrame>
      </div>
      <span className="text-xs tracking-[0.4em] uppercase font-body" style={{ color: accentColor }}>Opening statement</span>
      <p className="font-display text-xl @md:text-2xl italic text-foreground leading-relaxed mt-6">
        {message?.trim()}
      </p>
      <div className="w-12 h-[1px] mx-auto my-6" style={{ backgroundColor: accentColor }} />
      <p className="font-body text-sm text-muted-foreground tracking-wider">— {groomName} & {brideName}</p>
    </motion.div>
  </section>
);

// ─── Main Component ───────────────────────────────────
export interface WeddingPageProps {
  groomName?: string;
  brideName?: string;
  date?: string;
  time?: string;
  venue?: string;
  address?: string;
  message?: string;
  accentColor?: string;
  templateId?: string;
  skipIntro?: boolean;
  publicSlug?: string;
  publicGuestName?: string;
  publicGuestToken?: string;
  rsvpEnabled?: boolean;
  wishesEnabled?: boolean;
  musicUrl?: string;
  coverImageUrl?: string;
  galleryImageUrls?: string[];
  extraInfoTitle?: string;
  extraInfoContent?: string;
  /** Builder configuration JSON (H8) — takes precedence over legacy config tucked in extraInfoContent. */
  builderConfig?: string | null;
  contentConfig?: string | null;
  embeddedPreview?: boolean;
  previewMode?: boolean;
  weddingConfig?: import("@/data/weddingConfig").WeddingConfigData;
}

const WeddingFullPage = ({
  groomName: groomNameProp = "Minh Anh",
  brideName: brideNameProp = "Thanh Ha",
  date: dateProp = "2027-02-14",
  time: timeProp = "17:30",
  venue: venueProp = "White Palace Convention Center",
  address: addressProp = "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
  message: messageProp = "",
  accentColor: accentColorProp,
  templateId: templateIdProp = "romantic",
  skipIntro = false,
  publicSlug,
  publicGuestName,
  publicGuestToken,
  rsvpEnabled = true,
  wishesEnabled = true,
  musicUrl: musicUrlProp,
  coverImageUrl: coverImageUrlProp,
  galleryImageUrls: galleryImageUrlsProp,
  extraInfoTitle,
  extraInfoContent,
  builderConfig,
  contentConfig,
  embeddedPreview = false,
  previewMode = false,
  weddingConfig,
}: WeddingPageProps) => {
  const groomName = weddingConfig?.couple.groom ?? groomNameProp;
  const brideName = weddingConfig?.couple.bride ?? brideNameProp;
  const date = weddingConfig?.wedding.date ?? dateProp;
  const time = weddingConfig?.wedding.time ?? timeProp;
  const venue = weddingConfig?.wedding.venue ?? venueProp;
  const address = weddingConfig?.wedding.address ?? addressProp;
  const message = weddingConfig?.story.message ?? messageProp;
  const templateId = weddingConfig?.theme.template ?? templateIdProp;
  const musicUrl = weddingConfig?.music.url ?? musicUrlProp;
  const coverImageUrl = weddingConfig?.gallery.coverImage ?? coverImageUrlProp;
  const galleryImageUrls = weddingConfig?.gallery.images ?? galleryImageUrlsProp;
  const theme = getTheme(templateId);
  const templateConfig = templates.find((t) => t.id === templateId);
  const category = templateConfig?.category || "romantic";
  const defaultMessage = getThemeMessage(category);
  const finalMessage = message?.trim() ? message : defaultMessage;

  const accentColor = accentColorProp || theme.textAccent;

  /* H8: field builderConfig priority; fallback config legacy in extraInfoContent*/
  const { config, content: legacyFreeExtraInfo } = resolveBuilderConfig(builderConfig, extraInfoContent);
  const invitationContent = resolveInvitationContentConfig(contentConfig, builderConfig, extraInfoContent);
  const activeSections = config.customSections;
  const activeStyles = config.sectionStyles;
  const activeCursorType = config.cursorType;
  const activeParticlesType = config.particlesType;
  const activePhotoFilter = config.photoFilter || "none";
  const templateTypography = templateId === "magazine"
    ? { headingFont: "Playfair Display", bodyFont: "Inter", headingWeight: 900, headingCase: "uppercase" as const, accentStyle: "editorial" as const }
    : templateId === "luxury"
      ? { headingFont: "Playfair Display", bodyFont: "Inter", headingWeight: 300, headingCase: "normal" as const, accentStyle: "minimal" as const }
      : templateId === "traditional"
        ? { headingFont: "Playfair Display", bodyFont: "Inter", headingWeight: 500, headingCase: "normal" as const, accentStyle: "minimal" as const }
        : null;

  const useTemplateTypography = !builderConfig && templateTypography !== null;
  const effectiveHeadingFont = useTemplateTypography ? templateTypography.headingFont : config.headingFont || "Cormorant Garamond";
  const effectiveBodyFont = useTemplateTypography ? templateTypography.bodyFont : config.bodyFont || "Inter";
  const effectiveHeadingWeight = useTemplateTypography ? templateTypography.headingWeight : config.headingWeight || 600;
  const effectiveHeadingCase = useTemplateTypography ? templateTypography.headingCase : config.headingCase || "normal";
  const effectiveAccentStyle = useTemplateTypography ? templateTypography.accentStyle : config.accentStyle || "minimal";
  
  const typographyStyle = {
    "--invitation-heading-font": `'${effectiveHeadingFont}', serif`,
    "--invitation-body-font": `'${effectiveBodyFont}', sans-serif`,
    "--invitation-heading-weight": String(effectiveHeadingWeight),
    "--invitation-accent-color": accentColor,
    // Add subtle premium typography tweaks
    letterSpacing: templateId === "luxury" ? "0.02em" : "normal",
  } as CSSProperties;
  
  const displayExtraInfoContent = legacyFreeExtraInfo;
  const useDemoFamilyData = !publicSlug && !builderConfig && !weddingConfig;
  const groomParents = weddingConfig?.couple.groomParents ?? invitationContent.groomParents ?? (useDemoFamilyData ? WEDDING_SEED_DATA.groomParents : undefined);
  const brideParents = weddingConfig?.couple.brideParents ?? invitationContent.brideParents ?? (useDemoFamilyData ? WEDDING_SEED_DATA.brideParents : undefined);
  const schedule = weddingConfig?.wedding.schedule ?? invitationContent.schedule ?? (useDemoFamilyData ? WEDDING_SEED_DATA.schedule : undefined);
  const stories = weddingConfig?.story.timeline ?? invitationContent.stories ?? (useDemoFamilyData ? WEDDING_SEED_DATA.stories : []);
  const dressCodeColors = invitationContent.dressCodeColors ?? WEDDING_SEED_DATA.dressCodeColors;
  const faqs = invitationContent.faqs ?? WEDDING_SEED_DATA.faqs;

  const filterClass = activePhotoFilter === "none" ? "" : `wedding-photo-filter-${activePhotoFilter}`;

  const isDark = templateId === "modern" || templateId === "royal" || templateId === "luxury";
  const isMinimal = theme.styleVariant === "minimal";
  const isSignatureTemplate = templateId === "nordic_aurora" || templateId === "cyberpunk_luxe" || templateId === "parallax_love";
  // User requested all templates to have falling petals and beautiful backgrounds
  const showLightBG = !isMinimal && !isSignatureTemplate && !isDark;
  // Builder and visual QA previews must show the page itself; public links retain their opening ritual.
  const [introComplete, setIntroComplete] = useState(skipIntro || previewMode);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const experience = getTemplateExperience(templateId);

  useEffect(() => {
    if (!introComplete || !window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    const frame = window.requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    return () => window.cancelAnimationFrame(frame);
  }, [introComplete, templateId]);
  const isUntouchedDefaultFlow =
    activeSections.length === DEFAULT_SECTION_FLOW.length &&
    activeSections.every((sectionId, index) => sectionId === DEFAULT_SECTION_FLOW[index]);
  const displaySections = isUntouchedDefaultFlow
    ? experience.sectionOrder.filter((sectionId) => activeSections.includes(sectionId))
    : activeSections;

  const galleryImages = galleryImageUrls?.length ? [coverImageUrl, ...galleryImageUrls].filter(Boolean) as string[] : undefined;

  const allComponentsRegistry: Record<string, JSX.Element | null> = {
    couple: <CoupleSection groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />,
    story: <StorySection accentColor={accentColor} theme={theme} />,
    chat: <ChatStorySection groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />,
    message: <MessageSection message={finalMessage} groomName={groomName} brideName={brideName} accentColor={accentColor} theme={theme} />,
    details: <TravelMap venue={venue} address={address} accentColor={accentColor} theme={theme} />,
    gallery: <GalleryDispatcher theme={theme} accentColor={accentColor} images={galleryImages} />,
    events: <EventsSection date={date} time={time} venue={venue} address={address} accentColor={accentColor} theme={theme} />,
    parents: <ParentsSection groomParents={groomParents} brideParents={brideParents} accentColor={accentColor} theme={theme} />,
    timeline: <TimelineSection schedule={schedule} accentColor={accentColor} theme={theme} />,
    schedule: <TimelineSection schedule={schedule} accentColor={accentColor} theme={theme} />,
    countdown: <CountdownSection date={date} accentColor={accentColor} sectionBg={theme.sectionBg1} theme={theme} />,
    wishes: wishesEnabled ? <WishesWall accentColor={accentColor} theme={theme} publicSlug={publicSlug} /> : null,
    rsvp: rsvpEnabled ? <RSVPSection accentColor={accentColor} sectionBg={theme.sectionBg1} theme={theme} publicSlug={publicSlug} guestName={publicGuestName} guestToken={publicGuestToken} /> : null,
    bank: <BankRegistrySection groomBank={weddingConfig?.groomBank ?? invitationContent.groomBank} brideBank={weddingConfig?.brideBank ?? invitationContent.brideBank} accentColor={accentColor} theme={theme} />,
    memories: <MemoriesSection accentColor={accentColor} />,
    weather: <WeatherWidget date={date} accentColor={accentColor} />,
    dresscode: dressCodeColors && dressCodeColors.length > 0 ? (
      <section className="py-16 px-4">
        <div className={`max-w-2xl mx-auto bg-card/70 backdrop-blur-sm ${theme.cardRadius} p-8 border border-border shadow-lg text-center`}>
          <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: accentColor }}>Dress Code</p>
          <h3 className="font-display text-2xl font-bold text-foreground mb-6">Trang phục tham dự</h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {dressCodeColors.map((color, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full border-2 border-border shadow-md transition-transform hover:scale-110" style={{ backgroundColor: color }} />
                <span className="text-[10px] font-mono text-muted-foreground uppercase">{color}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    faq: faqs && faqs.length > 0 ? (
      <section className="py-16 px-4">
        <div className={`max-w-2xl mx-auto bg-card/70 backdrop-blur-sm ${theme.cardRadius} p-8 border border-border shadow-lg`}>
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: accentColor }}>F.A.Q</p>
            <h3 className="font-display text-2xl font-bold text-foreground">Câu hỏi thường gặp</h3>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-border/70 bg-background/50 p-4">
                <h4 className="font-medium text-foreground text-sm mb-1">{faq.q}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ) : null,
    extraInfo: (
      <section className="py-12 px-4">
        <div className={`max-w-2xl mx-auto bg-card/70 backdrop-blur-sm ${theme.cardRadius} p-10 border border-border shadow-lg text-center`}>
          <h3 className="font-display text-2xl font-bold text-foreground mb-4">{extraInfoTitle || "Additional Information"}</h3>
          <p className="text-muted-foreground font-body text-sm leading-relaxed whitespace-pre-line">{displayExtraInfoContent}</p>
        </div>
      </section>
    )
  };


  const DedicatedTemplate = isTemplateId(templateId) ? DEDICATED_TEMPLATES[templateId] : undefined;

  return (
    <div className="@container wedding-invitation-viewport h-full w-full">
      {!embeddedPreview && !isSignatureTemplate && <CustomCursor type={activeCursorType} />}
      {/* Intro overlay - hides everything behind it */}
      <AnimatePresence>
        {!introComplete && (
          <TemplateOpening
            key="template-opening"
            templateId={templateId}
            variant={experience.opening}
            line={experience.inviteLine}
            groomName={groomName}
            brideName={brideName}
            accentColor={accentColor}
            date={date}
            onComplete={() => setIntroComplete(true)}
          />
        )}
      </AnimatePresence>

      {/* Main content only renders after the intro is dismissed */}
      {introComplete && (
          <main
            className={`wedding-invitation-shell wedding-template-${theme.id} ${embeddedPreview ? "is-embedded-preview" : ""} ${filterClass}`}
            data-heading-case={effectiveHeadingCase}
            data-accent-style={effectiveAccentStyle}
            style={typographyStyle}
          >
          {!embeddedPreview && <div className="invitation-mobile-frame" aria-hidden="true" />}
          {/* Global overlays that make the site magical */}
          {!embeddedPreview && !isSignatureTemplate && <ScrollProgress accentColor={accentColor} />}
          {!embeddedPreview && showLightBG && <CinematicLightBG accentColor={accentColor} />}
          {!embeddedPreview && !isSignatureTemplate && <InvitationMagicLayer effect={theme.specialEffect} accentColor={accentColor} intensity={theme.animationIntensity} />}
          {!isSignatureTemplate && <FloatingParticles type={activeParticlesType} color={accentColor} count={embeddedPreview ? 18 : 30} contained={embeddedPreview} />}
          {!embeddedPreview && !isSignatureTemplate && <NavBar accentColor={accentColor} theme={theme} />}
          {!embeddedPreview && !isSignatureTemplate && <LiveWishToast accentColor={accentColor} />}
          {!embeddedPreview && (
            <InvitationActionRail publicSlug={publicSlug} accentColor={accentColor}>
              <MusicPlayer url={musicUrl} accentColor={accentColor} theme={theme} />
            </InvitationActionRail>
          )}
          {!embeddedPreview && !isSignatureTemplate && <FloatingDock accentColor={accentColor} theme={theme} onOpenStory={() => setIsStoryOpen(true)} />}

          {isStoryOpen && stories && stories.length > 0 && (
            <StoryViewer 
              stories={stories} 
              onClose={() => setIsStoryOpen(false)} 
              accentColor={accentColor}
            />
          )}

          {DedicatedTemplate ? (
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <DedicatedTemplate
                groomName={groomName}
                brideName={brideName}
                date={date}
                time={time}
                venue={venue}
                address={address}
                message={finalMessage}
                accentColor={accentColor}
                publicSlug={publicSlug}
                publicGuestName={publicGuestName}
                publicGuestToken={publicGuestToken}
                rsvpEnabled={rsvpEnabled}
                wishesEnabled={wishesEnabled}
                musicUrl={isSignatureTemplate ? undefined : musicUrl}
                coverImageUrl={coverImageUrl || undefined}
                galleryImageUrls={galleryImageUrls?.filter(Boolean).length ? galleryImageUrls.filter(Boolean) : undefined}
                extraInfoTitle={extraInfoTitle}
                extraInfoContent={extraInfoContent}
                groomBank={weddingConfig?.groomBank ?? invitationContent.groomBank}
                brideBank={weddingConfig?.brideBank ?? invitationContent.brideBank}
                stories={stories}
                groomParents={groomParents}
                brideParents={brideParents}
                schedule={schedule}
                dressCodeColors={dressCodeColors}
                faqs={faqs}
                theme={theme}
              />
            </Suspense>
          ) : (
            <motion.div
              className={`min-h-screen relative overflow-x-hidden ${isDark ? "dark" : ""}`}
              style={{ background: theme.bgGradient }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {/* Always render Hero at the top */}
              <HeroSection groomName={groomName} brideName={brideName} date={date} accentColor={accentColor} heroOverlay={theme.heroOverlay} themeId={theme.id} style={theme.heroStyle} />
              
              <LoveQuote accentColor={accentColor} />

              {/* Dynamic canvas builder: the template LayoutStrategy controls composition;
                  the section list still follows the user's customSections. */}
              {getLayoutStrategy(experience.layout).renderSections({
                sections: displaySections
                  .map((secId) => ({ id: secId, node: allComponentsRegistry[secId], style: activeStyles[secId] || {} }))
                  .filter((item) => item.node),
                theme,
                accentColor,
              })}

              <WeddingFooter groomName={groomName} brideName={brideName} accentColor={accentColor} decorEmoji={theme.decorEmoji} date={date} theme={theme} />
              
              <ScrollToTop accentColor={accentColor} />
            </motion.div>
          )}
        </main>
      )}
    </div>
  );
};

export default WeddingFullPage;
