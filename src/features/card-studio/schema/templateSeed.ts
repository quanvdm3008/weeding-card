import type { CardComponent, CardDocument, CardSection } from "./types";
import { CARD_DESIGN_WIDTH } from "./types";
import { createComponent, createEmptyDocument, createSection, defaultStyle } from "./defaults";
import { getTheme } from "@/data/themes";
import { templates } from "@/data/templates";
import type { BankInfo, ParentInfo } from "@/data/seedData";
import { getVietQrImageUrl } from "@/lib/vietqr";

/**
 * "Adjust the old model too" in Card Studio: generate a complete CardDocument from a template
 * classic + real card data. Users receive a design of the correct sample quality
 * (theme color palette, animation effects, full sections) and freely adjust each element.
 */

export interface TemplateSeedData {
  groomName: string;
  brideName: string;
  date: string; // ISO yyyy-MM-dd
  time: string; // HH:mm
  venue: string;
  address: string;
  message: string;
  musicUrl?: string;
  coverImageUrl?: string;
  galleryImageUrls?: string[];
  groomBank?: BankInfo;
  brideBank?: BankInfo;
  groomParents?: ParentInfo;
  brideParents?: ParentInfo;
}

interface FontSet {
  script: string;
  heading: string;
  body: string;
}

const FONTS_BY_STYLE: Record<string, FontSet> = {
  elegant: { script: "Great Vibes", heading: "Playfair Display", body: "Cormorant Garamond" },
  classic: { script: "Great Vibes", heading: "Cormorant Garamond", body: "Cormorant Garamond" },
  modern: { script: "Playfair Display", heading: "Inter", body: "Inter" },
  playful: { script: "Great Vibes", heading: "Poppins", body: "Poppins" },
  rustic: { script: "Great Vibes", heading: "Cormorant Garamond", body: "Inter" },
};

/** Falling effects match the mood of each template. */
const EFFECT_BY_TEMPLATE: Record<string, string> = {
  romantic: "petals",
  sakura: "petals",
  garden: "petals",
  boho: "petals",
  tropical: "petals",
  rustic: "petals",
  vintage: "sparkles",
  luxury: "sparkles",
  royal: "sparkles",
  canvas: "sparkles",
  korean: "petals",
  magazine: "sparkles",
  traditional: "sparkles",
  modern: "sparkles",
  minimalist: "sparkles",
  flat2d: "confetti",
  layered3d: "petals",
  photo25d: "sparkles",
  cosmic: "galaxy",
  pixel: "pixel",
};

const DARK_TEXT = "#4A3F3C";

type StudioHeroLayout = "centered" | "split" | "editorial" | "cosmic" | "pixel" | "layered" | "photo-stack";

const HERO_LAYOUT_BY_TEMPLATE: Record<string, StudioHeroLayout> = {
  modern: "editorial",
  magazine: "editorial",
  flat2d: "split",
  tropical: "split",
  boho: "split",
  korean: "split",
  cosmic: "cosmic",
  pixel: "pixel",
  layered3d: "layered",
  photo25d: "photo-stack",
};

const HERO_LABEL_BY_TEMPLATE: Record<string, string> = {
  magazine: "THE WEDDING ISSUE",
  modern: "MODERN WEDDING EDITION",
  traditional: "MARRIAGE CEREMONY · 囍",
  luxury: "Golden Gala Dinner",
  royal: "THE ROYAL INVITATION",
  cosmic: "CELESTIAL VOWS · ORBIT 01",
  pixel: "LOVE QUEST · PRESS START",
  layered3d: "A STORY IN THREE DIMENSIONS",
  photo25d: "TOGETHER IN EVERY LAYER",
};

const HERO_GRADIENT_BY_TEMPLATE: Record<string, [string, string]> = {
  garden: ["#F7F9F5", "#F4F6F0"],
  modern: ["#0F1724", "#1B2838"],
  royal: ["#1A0A0A", "#800020"],
  luxury: ["#050505", "#401820"],
  magazine: ["#F7F7F7", "#FFFFFF"],
  traditional: ["#650D16", "#8B0000"],
  layered3d: ["#F5F2EB", "#DCE4D6"],
  photo25d: ["#F8F5EF", "#E6DCCF"],
  cosmic: ["#050611", "#171934"],
  pixel: ["#15141B", "#292433"],
};

interface StudioVisualProfile {
  section: string;
  sectionAlt: string;
  surface: string;
  text: string;
  radius: number;
  imageMotion: string;
  imageOverlay: string;
  frame: "none" | "plain" | "polaroid";
}

interface TemplateSeedCopy {
  countdown: string;
  invitation: string;
  invitationFallback: string;
  events: string;
  closing: string;
}

const TEMPLATE_COPY: Record<string, TemplateSeedCopy> = {
  romantic: {
    countdown: "Count each beat",
    invitation: "A promise from the heart",
    invitationFallback: "The day we call each other family will be more complete when you are there to witness and share.",
    events: "See you on a happy day",
    closing: "Thank you for being in our story",
  },
  garden: {
    countdown: "Waiting for the Season of Love",
    invitation: "When the garden of love blooms",
    invitationFallback: "Amidst the scent of flowers and blessings, we look forward to welcoming you on a day when two families share joy.",
    events: "The day the garden opens",
    closing: "See you in the midst of the happy flower season",
  },
  modern: {
    countdown: "The date is set",
    invitation: "A note from us",
    invitationFallback: "We choose each other for the days to come, and choose you to witness the beginning.",
    events: "The wedding schedule",
    closing: "See you at the celebration",
  },
  traditional: {
    countdown: "Good days are coming",
    invitation: "The two families respectfully reported the news",
    invitationFallback: "Our two families respectfully invite you to attend the wedding ceremony and celebrate with the young couple.",
    events: "Wedding program",
    closing: "Sincerely thank you for your presence",
  },
};

function copyForTemplate(templateId: string): TemplateSeedCopy {
  if (["garden", "sakura", "tropical", "boho"].includes(templateId)) return TEMPLATE_COPY.garden;
  if (["modern", "minimalist", "magazine", "flat2d", "pixel", "cosmic", "cyberpunk_luxe", "nordic_aurora"].includes(templateId)) return TEMPLATE_COPY.modern;
  if (["traditional", "royal", "luxury", "vintage"].includes(templateId)) return TEMPLATE_COPY.traditional;
  return TEMPLATE_COPY.romantic;
}

function visualProfile(templateId: string, palette: string[], fallbackText: string): StudioVisualProfile {
  if (templateId === "garden") {
    return { section: "#F7F9F5", sectionAlt: "#F4F6F0", surface: "#FFFFFF", text: "#2C3B22", radius: 24, imageMotion: "breathe", imageOverlay: "soft-glow", frame: "plain" };
  }
  if (templateId === "cosmic") {
    return { section: "#090A18", sectionAlt: "#111329", surface: "#171A35", text: "#F6F0E4", radius: 8, imageMotion: "drift", imageOverlay: "glass-sheen", frame: "plain" };
  }
  if (templateId === "pixel") {
    return { section: "#15141B", sectionAlt: "#201D29", surface: "#282431", text: "#FFF9E8", radius: 0, imageMotion: "pan-right", imageOverlay: "none", frame: "none" };
  }
  if (["luxury", "royal", "traditional"].includes(templateId)) {
    return { section: palette[0] || "#281014", sectionAlt: "#120E10", surface: "#21191A", text: "#FFF7E8", radius: 4, imageMotion: "ken-burns", imageOverlay: "gold-wash", frame: "plain" };
  }
  if (["modern", "magazine", "minimalist"].includes(templateId)) {
    return { section: "#F5F3EF", sectionAlt: "#FFFFFF", surface: "#FFFFFF", text: "#171717", radius: 0, imageMotion: "reveal", imageOverlay: templateId === "magazine" ? "film" : "soft-glow", frame: "none" };
  }
  if (templateId === "layered3d") {
    return { section: "#F1F0E8", sectionAlt: "#E4E9DF", surface: "#FBFAF4", text: "#203626", radius: 2, imageMotion: "tilt", imageOverlay: "soft-glow", frame: "polaroid" };
  }
  if (templateId === "photo25d") {
    return { section: "#F8F5EF", sectionAlt: "#EEE8DE", surface: "#FFFFFF", text: "#292621", radius: 0, imageMotion: "depth-float", imageOverlay: "gold-wash", frame: "polaroid" };
  }
  return { section: "#FFFDFC", sectionAlt: palette[1] || "#F8F1F2", surface: "#FFFFFF", text: fallbackText, radius: 8, imageMotion: "breathe", imageOverlay: "soft-glow", frame: "plain" };
}

interface StudioCollageBox {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

function collageLayoutForTemplate(templateId: string): StudioCollageBox[] {
  if (["photo25d", "layered3d"].includes(templateId)) {
    return [
      { x: 92, y: 440, width: 330, height: 500, rotation: -6 },
      { x: 270, y: 410, width: 330, height: 520, rotation: 1 },
      { x: 450, y: 448, width: 270, height: 460, rotation: 7 },
    ];
  }
  if (["modern", "magazine", "minimalist"].includes(templateId)) {
    return [
      { x: 48, y: 408, width: 290, height: 270, rotation: 0 },
      { x: 48, y: 702, width: 290, height: 276, rotation: 0 },
      { x: 362, y: 408, width: 390, height: 570, rotation: 0 },
    ];
  }
  if (templateId === "pixel") {
    return [
      { x: 48, y: 430, width: 214, height: 500, rotation: 0 },
      { x: 293, y: 430, width: 214, height: 500, rotation: 0 },
      { x: 538, y: 430, width: 214, height: 500, rotation: 0 },
    ];
  }
  if (["luxury", "royal", "traditional"].includes(templateId)) {
    return [
      { x: 48, y: 430, width: 220, height: 520, rotation: 0 },
      { x: 290, y: 400, width: 220, height: 580, rotation: 0 },
      { x: 532, y: 430, width: 220, height: 520, rotation: 0 },
    ];
  }
  if (templateId === "cosmic") {
    return [
      { x: 68, y: 470, width: 250, height: 430, rotation: -2 },
      { x: 275, y: 408, width: 250, height: 540, rotation: 0 },
      { x: 482, y: 470, width: 250, height: 430, rotation: 2 },
    ];
  }
  return [
    { x: 48, y: 408, width: 420, height: 570, rotation: 0 },
    { x: 492, y: 408, width: 260, height: 270, rotation: 0 },
    { x: 492, y: 702, width: 260, height: 276, rotation: 0 },
  ];
}

function formatDateVi(date: string): string {
  const d = new Date(`${date}T00:00`);
  if (isNaN(d.getTime())) return date;
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

/** Dark theme background (luxury/royal/traditional/magazine) → light text for section using gradient theme. */
function isDarkGradient(gradient: string): boolean {
  return /#(0|1|2|3)[0-9a-fA-F]{5}|black|rgba\(\s*[0-5]?\d\s*,/.test(gradient);
}

export function seedDocumentFromTemplate(templateId: string, data: TemplateSeedData): CardDocument {
  const theme = getTheme(templateId);
  const fonts = FONTS_BY_STYLE[theme.fontStyle] ?? FONTS_BY_STYLE.elegant;
  const accent = templateId === "garden" ? "#8A9A5B" : theme.textAccent || "#E8B4B8";
  const effect = EFFECT_BY_TEMPLATE[templateId] ?? "petals";
  const catalogTemplate = templates.find((t) => t.id === templateId);
  const templateName = catalogTemplate?.nameVi ?? templateId;
  const heroDark = isDarkGradient(theme.bgGradient);
  const heroText = heroDark ? "#FDF8F2" : DARK_TEXT;
  const heroLayout = HERO_LAYOUT_BY_TEMPLATE[templateId] ?? "centered";
  const isMagazine = templateId === "magazine";
  const palette = catalogTemplate?.colors ?? [accent, "#FDF8F5", "#FFFFFF"];
  const visual = visualProfile(templateId, palette, DARK_TEXT);
  const copy = copyForTemplate(templateId);
  const featureTitleFont = heroLayout === "pixel" ? "Inter" : ["cosmic", "editorial"].includes(heroLayout) ? fonts.heading : fonts.script;
  const featureTitleWeight = heroLayout === "pixel" || heroLayout === "editorial" ? 700 : 400;
  const heroGradient = HERO_GRADIENT_BY_TEMPLATE[templateId] ?? (heroDark ? [palette[0], palette[0]] : ["#FFFDFC", palette[0]]);
  const sectionBackground = visual.section;
  const sectionText = visual.text;

  const doc = createEmptyDocument(`${data.groomName} & ${data.brideName} — ${templateName}`);
  const page = doc.pages[0];
  doc.metadata = { ...doc.metadata, sourceTemplateId: templateId, sourceTemplateName: templateName };
  page.sections = [];
  page.components = [];

  const W = CARD_DESIGN_WIDTH;
  const CX = W / 2;
  const isSideHero = ["split", "editorial", "cosmic", "pixel"].includes(heroLayout);
  const isPhotoStack = heroLayout === "photo-stack";
  const heroFrame = templateId === "garden" ? "organic" : heroLayout === "cosmic" ? "circle" : heroLayout === "pixel" || heroLayout === "editorial" || heroLayout === "split" || heroLayout === "layered" || isPhotoStack ? "none" : "arch";
  const heroImageBox = isMagazine
    ? { x: 430, y: 220, width: 320, height: 650 }
    : heroLayout === "cosmic"
    ? { x: 430, y: 275, width: 320, height: 320 }
    : isSideHero
    ? { x: 430, y: 170, width: 320, height: 640 }
    : isPhotoStack
    ? { x: Math.round(CX - 145), y: 200, width: 290, height: 400 }
    : { x: Math.round(CX - 150), y: 190, width: 300, height: 400 };
  let order = 0;

  const addSection = (partial: Partial<CardSection>): CardSection => {
    const section = createSection({ ...partial, order: page.sections.length });
    page.sections.push(section);
    return section;
  };

  const add = (component: CardComponent): CardComponent => {
    component.order = order++;
    page.components.push(component);
    return component;
  };

  const text = (
    sectionId: string,
    content: string,
    opts: {
      x?: number;
      y: number;
      w?: number;
      h?: number;
      size: number;
      font?: string;
      color?: string;
      weight?: number;
      spacing?: number;
      name: string;
      delay?: number;
      italic?: boolean;
      align?: "left" | "center" | "right";
    }
  ) =>
    add(
      createComponent("text", sectionId, {
        name: opts.name,
        position: { x: opts.x ?? Math.round(CX - (opts.w ?? 600) / 2), y: opts.y },
        size: { width: opts.w ?? 600, height: opts.h ?? Math.round(opts.size * 1.7) },
        style: defaultStyle({
          fontSize: opts.size,
          fontFamily: opts.font ?? fonts.body,
          color: opts.color ?? heroText,
          fontWeight: opts.weight ?? 400,
          letterSpacing: opts.spacing ?? 0,
          fontStyle: opts.italic ? "italic" : "normal",
          textAlign: opts.align ?? "center",
        }),
        content: { text: content },
        animation: {
          entrance: { type: "slide-up", duration: 0.8, delay: opts.delay ?? 0, easing: "ease-out" },
          exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
          loop: { type: "none", duration: 3 },
        },
      })
    );

  /* ---------- Section 1: Introduction (hero) ---------- */
  const hero = addSection({
    name: "Opening",
    height: 1020,
    background: {
      color: heroGradient[0],
      gradient: { enabled: true, from: heroGradient[0], to: heroGradient[1], angle: 180 },
      imageUrl: "",
      imageOpacity: 1,
    },
  });

  /* Drop effect covers the entire hero — pre-locked to prevent clicking on the elements below*/
  add(
    createComponent("effects", hero.id, {
      name: "Falling effect (locked)",
      position: { x: 0, y: 0 },
      size: { width: W, height: 1020 },
      locked: true,
      content: { effect, density: 14, speed: 0.8, size: 18 },
    })
  );

  /* Only classic themes use corner flowers; editorial/cosmic/pixel keeps its own language.*/
  if (heroLayout === "centered") {
    for (const [i, x] of [16, W - 176].entries()) {
      add(
        createComponent("flowers", hero.id, {
          name: `Corner flower ${i === 0 ? "left" : "Right"}`,
          position: { x, y: 12 },
          size: { width: 160, height: 160 },
          rotation: i === 0 ? 0 : 90,
          content: { variant: "corner", tone: accent },
          animation: {
            entrance: { type: "fade", duration: 1.2, delay: 0.2, easing: "ease-out" },
            exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
            loop: { type: "sway", duration: 5 },
          },
        })
      );
    }
  }

  text(hero.id, HERO_LABEL_BY_TEMPLATE[templateId] ?? "SAVE THE DATE", {
    x: isSideHero ? 48 : undefined,
    y: isMagazine ? 100 : isSideHero ? 150 : 120,
    w: isMagazine ? 188 : isSideHero ? 360 : 600,
    size: isMagazine ? 10 : 15,
    spacing: isMagazine ? 1 : heroLayout === "pixel" ? 1 : heroLayout === "cosmic" ? 3 : 6,
    color: accent,
    weight: 700,
    name: "Opening label",
    font: heroLayout === "pixel" ? "Inter" : fonts.body,
    align: isSideHero ? "left" : "center",
  });

  if (heroLayout === "cosmic") {
    [
      { x: 398, y: 242, width: 384, height: 384, opacity: 0.52 },
      { x: 423, y: 267, width: 334, height: 334, opacity: 0.28 },
    ].forEach((ring, index) => add(createComponent("shape", hero.id, {
      name: `Trajectory ${index + 1}`,
      position: { x: ring.x, y: ring.y },
      size: { width: ring.width, height: ring.height },
      rotation: index ? 18 : -12,
      locked: true,
      style: defaultStyle({ opacity: ring.opacity }),
      content: { shape: "ring", fill: "transparent", stroke: accent, strokeWidth: index ? 2 : 3 },
      animation: {
        entrance: { type: "fade", duration: 1.2, delay: 0.1 + index * 0.1, easing: "ease-out" },
        exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
        loop: { type: "spin", duration: index ? 28 : 36 },
      },
    })));
  }

  if (heroLayout === "pixel") {
    [
      { x: 410, y: 146, width: 24, height: 24, color: accent },
      { x: 746, y: 790, width: 22, height: 22, color: palette[2] || "#FFCE67" },
      { x: 382, y: 820, width: 14, height: 14, color: "#FFFFFF" },
    ].forEach((block, index) => add(createComponent("shape", hero.id, {
      name: `Pixel point ${index + 1}`,
      position: { x: block.x, y: block.y },
      size: { width: block.width, height: block.height },
      locked: true,
      content: { shape: "rect", fill: block.color, stroke: "", strokeWidth: 0 },
      animation: {
        entrance: { type: "zoom-in", duration: 0.5, delay: 0.15 + index * 0.12, easing: "spring" },
        exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
        loop: { type: "twinkle", duration: 2.4 + index * 0.4 },
      },
    })));
  }

  if (heroLayout === "editorial") {
    add(createComponent("shape", hero.id, {
      name: "Editorial border",
      position: { x: 48, y: isMagazine ? 154 : 236 },
      size: { width: isMagazine ? 704 : 334, height: isMagazine ? 4 : 2 },
      locked: true,
      content: { shape: "rect", fill: isMagazine ? "#111111" : accent, stroke: "", strokeWidth: 0 },
    }));
    if (isMagazine) {
      text(hero.id, "VOGUE WEDDING", {
        x: 250, y: 82, w: 300, h: 56, size: 30, font: "Inter", color: "#111111", weight: 900, name: "Publication name",
      });
      text(hero.id, "VOL. 2026", {
        x: 620, y: 100, w: 132, h: 28, size: 12, font: "Inter", color: "#111111", weight: 700, name: "Magazine number", align: "right",
      });
    }
  }

  if (heroLayout === "layered") {
    (data.galleryImageUrls ?? []).slice(0, 2).forEach((src, index) => {
      add(
        createComponent("frame", hero.id, {
          name: `3D image layer ${index + 1}`,
          position: { x: 185 + index * 285, y: 225 + index * 35 },
          size: { width: 250, height: 340 },
          rotation: index ? 8 : -8,
          style: defaultStyle({
            background: "#FFFFFF",
            padding: 8,
            shadow: { enabled: true, x: 0, y: 16, blur: 30, spread: 0, color: "rgba(28,45,31,0.2)" },
          }),
          content: { src, frame: "none", borderColor: "#FFFFFF", borderWidth: 8, imageMotion: index ? "pan-left" : "pan-right", imageOverlay: "film" },
          animation: {
            entrance: { type: index ? "slide-left" : "slide-right", duration: 1, delay: 0.2 + index * 0.12, easing: "ease-out" },
            exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
            loop: { type: "float", duration: 4 + index },
          },
        })
      );
    });
  }

  if (isPhotoStack) {
    (data.galleryImageUrls ?? []).slice(0, 2).forEach((src, index) => {
      add(createComponent("frame", hero.id, {
        name: `2.5D image layer ${index + 1}`,
        position: { x: index ? 430 : 120, y: index ? 230 : 250 },
        size: { width: 270, height: 370 },
        rotation: index ? 7 : -8,
        style: defaultStyle({
          background: "#FFFFFF",
          padding: 9,
          shadow: { enabled: true, x: 0, y: 20, blur: 38, spread: 0, color: "rgba(58,47,35,0.2)" },
        }),
        content: { src, frame: "none", borderColor: "#FFFFFF", borderWidth: 0, imageMotion: "perspective-sway", imageOverlay: "gold-wash" },
        animation: {
          entrance: { type: index ? "slide-left" : "slide-right", duration: 0.9, delay: 0.18 + index * 0.14, easing: "ease-out" },
          exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
          loop: { type: "depth-float", duration: 8 + index },
        },
      }));
    });
  }

  /* The main image is kept as a separate component to replace/crop directly in the Inspector.*/
  add(
    createComponent("frame", hero.id, {
      name: "Main wedding photo",
      position: { x: heroImageBox.x, y: heroImageBox.y },
      size: { width: heroImageBox.width, height: heroImageBox.height },
      ...(isMagazine ? {
        style: defaultStyle({
          background: "#111111",
          shadow: { enabled: true, x: 14, y: 14, blur: 0, spread: 0, color: "#111111" },
        }),
      } : heroLayout === "layered" || isPhotoStack ? {
        style: defaultStyle({
          background: "#FFFFFF",
          padding: isPhotoStack ? 10 : 8,
          shadow: { enabled: true, x: 0, y: 18, blur: 34, spread: 0, color: isPhotoStack ? "rgba(58,47,35,0.24)" : "rgba(28,45,31,0.24)" },
        }),
      } : {}),
      content: {
        src: data.coverImageUrl ?? "",
        frame: heroFrame,
        borderColor: isMagazine ? "#111111" : accent,
        borderWidth: heroLayout === "pixel" ? 8 : isMagazine ? 2 : 3,
        imageMotion: heroLayout === "layered" ? "ken-burns" : visual.imageMotion,
        imageOverlay: visual.imageOverlay,
      },
      animation: {
        entrance: { type: "zoom-in", duration: 1, delay: 0.3, easing: "ease-out" },
        exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
        loop: { type: heroLayout === "cosmic" ? "float" : isPhotoStack ? "perspective-sway" : "none", duration: isPhotoStack ? 10 : 6 },
      },
    })
  );

  text(hero.id, isMagazine
    ? `${data.groomName.split(" ")[0]}\n&\n${data.brideName.split(" ")[0]}`
    : `${data.groomName} & ${data.brideName}`, {
    x: isSideHero ? 48 : undefined,
    y: isMagazine ? 270 : isSideHero ? 300 : 640,
    w: isSideHero ? 340 : 600,
    size: heroLayout === "pixel" ? 44 : isMagazine ? 68 : heroLayout === "editorial" ? 54 : 58,
    h: isMagazine ? 320 : isSideHero ? 230 : 110,
    font: isMagazine ? "Inter" : heroLayout === "pixel" ? "Inter" : heroLayout === "editorial" || heroLayout === "cosmic" ? fonts.heading : fonts.script,
    color: isMagazine ? "#111111" : heroDark ? "#F5DFA9" : accent,
    name: "Name of the bride and groom",
    delay: 0.5,
    weight: isMagazine ? 900 : heroLayout === "pixel" || heroLayout === "editorial" ? 700 : 400,
    align: isSideHero ? "left" : "center",
  });

  if (!isMagazine) add(
    createComponent("divider", hero.id, {
      name: "Heart separation",
      position: { x: isSideHero ? 48 : Math.round(CX - 150), y: isSideHero ? 570 : 768 },
      size: { width: isSideHero ? 250 : 300, height: 30 },
      style: defaultStyle({ color: accent }),
      content: { variant: "hearts", thickness: 2 },
    })
  );

  text(hero.id, `${formatDateVi(data.date)} · ${data.time}`, {
    x: isSideHero ? 48 : undefined,
    y: isMagazine ? 650 : isSideHero ? 625 : 815,
    w: isSideHero ? 340 : 600,
    size: 22,
    font: isMagazine ? "Inter" : fonts.heading,
    color: isMagazine ? "#555555" : undefined,
    weight: isMagazine ? 700 : undefined,
    name: "Date and time",
    delay: 0.7,
    align: isSideHero ? "left" : "center",
  });
  text(hero.id, isMagazine ? (data.message || copy.invitationFallback) : data.venue, {
    x: isSideHero ? 48 : undefined,
    y: isMagazine ? 715 : isSideHero ? 680 : 862,
    w: isSideHero ? 340 : 600,
    h: isMagazine ? 150 : undefined,
    size: isMagazine ? 14 : 17,
    font: isMagazine ? "Inter" : undefined,
    color: isMagazine ? "#222222" : undefined,
    weight: isMagazine ? 600 : undefined,
    name: isMagazine ? "Cover lyrics" : "Location",
    delay: 0.8,
    italic: !isMagazine,
    align: isSideHero ? "left" : "center",
  });

  /* Heart-beating couple rings*/
  if (!isMagazine) add(
    createComponent("icon", hero.id, {
      name: "Couple rings",
      position: { x: isSideHero ? 48 : Math.round(CX - 28), y: isSideHero ? 760 : 926 },
      size: { width: 56, height: 56 },
      style: defaultStyle({ color: heroDark ? "#F5DFA9" : accent }),
      content: { icon: "rings" },
      animation: {
        entrance: { type: "bounce", duration: 1, delay: 1, easing: "spring" },
        exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
        loop: { type: "heartbeat", duration: 2.4 },
      },
    })
  );

  if (data.musicUrl) {
    add(createComponent("music", hero.id, {
      name: "Music disc",
      position: { x: W - 92, y: 34 },
      size: { width: 68, height: 92 },
      style: defaultStyle({ color: accent, background: "transparent", radius: 34 }),
      content: { src: data.musicUrl, title: "Our music", releaseNotes: true },
      animation: {
        entrance: { type: "zoom-in", duration: 1.2, delay: 0.8, easing: "spring" },
        exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
        loop: { type: "none", duration: 3 },
      },
    }));
  }

  const families = [
    data.groomParents ? { label: "The groom's family", value: data.groomParents } : null,
    data.brideParents ? { label: "Girl's house", value: data.brideParents } : null,
  ].filter((item): item is { label: string; value: ParentInfo } => item !== null);

  if (families.length) {
    const familySection = addSection({
      name: "Information about two families",
      height: 550,
      background: { color: visual.section, gradient: { enabled: false, from: visual.section, to: visual.sectionAlt, angle: 180 }, imageUrl: "", imageOpacity: 1 },
    });
    text(familySection.id, "WEDDING INFORMATION", {
      y: 46, size: 30, font: fonts.heading, color: accent, weight: 700, name: "Family title",
    });
    text(familySection.id, "The two families respectfully announce the news of our children's marriage", {
      y: 100, w: 620, h: 70, size: 16, color: visual.text, name: "Announcement", italic: true,
    });
    families.forEach(({ label, value }, index) => {
      const width = families.length === 1 ? 480 : 320;
      const x = families.length === 1 ? Math.round(CX - width / 2) : 70 + index * 340;
      const displayLabel = value.familyLabel?.trim() || label;
      text(familySection.id, displayLabel, {
        x, y: 192, w: width, h: 30, size: 13, color: accent, weight: 700, spacing: 2, name: `${label} · label`,
      });
      const parentLines = [
        value.fatherName?.trim() ? `${value.fatherTitle || "Mr."} ${value.fatherName}` : "",
        value.motherName?.trim() ? `${value.motherTitle || "Mrs."} ${value.motherName}` : "",
      ].filter(Boolean).join("\n");
      if (parentLines) text(familySection.id, parentLines, {
        x, y: 236, w: width, h: 112, size: 26, font: fonts.heading, color: visual.text, weight: 600, name: `${label} · parents`,
      });
      if (value.address) {
        text(familySection.id, value.address, {
          x, y: 358, w: width, h: 64, size: 14, color: visual.text, name: `${label} · Address`,
        });
      }
      if (value.phone || value.note) {
        text(familySection.id, [value.phone, value.note].filter(Boolean).join(" · "), {
          x, y: 414, w: width, h: 38, size: 12, color: visual.text, name: `${label} · contact`,
        });
      }
    });
    add(createComponent("divider", familySection.id, {
      name: "Family separation",
      position: { x: Math.round(CX - 120), y: 488 },
      size: { width: 240, height: 26 },
      style: defaultStyle({ color: accent }),
      content: { variant: "flourish", thickness: 2 },
    }));
  }

  /* ---------- Section 2: Countdown ---------- */
  const countdownSection = addSection({
    name: "Countdown",
    height: 380,
    background: { color: visual.sectionAlt, gradient: { enabled: false, from: visual.sectionAlt, to: visual.section, angle: 180 }, imageUrl: "", imageOpacity: 1 },
  });
  text(countdownSection.id, copy.countdown, {
    y: 60,
    size: 34,
    font: featureTitleFont,
    color: accent,
    weight: featureTitleWeight,
    spacing: heroLayout === "pixel" ? 1 : 0,
    name: "Countdown title",
  });
  add(
    createComponent("countdown", countdownSection.id, {
      name: "Countdown timer",
      position: { x: Math.round(CX - 280), y: 150 },
      size: { width: 560, height: 130 },
      style: defaultStyle({
        fontSize: 30,
        fontFamily: fonts.heading,
        color: visual.text,
        background: visual.surface,
        radius: visual.radius,
        border: { enabled: templateId === "pixel" || heroDark, width: templateId === "pixel" ? 2 : 1, style: "solid", color: accent },
        shadow: { enabled: true, x: 0, y: 10, blur: 30, spread: 0, color: `${accent}30` },
      }),
      content: { targetDate: `${data.date}T${data.time || "17:30"}`, showLabels: true },
      animation: {
        entrance: { type: "zoom-in", duration: 0.8, delay: 0.2, easing: "ease-out" },
        exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
        loop: { type: "none", duration: 3 },
      },
    })
  );
  add(
    createComponent("divider", countdownSection.id, {
      name: "Separation",
      position: { x: Math.round(CX - 120), y: 310 },
      size: { width: 240, height: 24 },
      style: defaultStyle({ color: accent }),
      content: { variant: "flourish", thickness: 2 },
    })
  );

  /* ---------- Section 3: Introduction ---------- */
  const messageSection = addSection({
    name: "Opening statement",
    height: data.galleryImageUrls?.length ? 1080 : 500,
    background: { color: sectionBackground, gradient: { enabled: false, from: visual.section, to: visual.sectionAlt, angle: 180 }, imageUrl: "", imageOpacity: 1 },
  });
  text(messageSection.id, copy.invitation, {
    y: 64,
    size: 34,
    font: featureTitleFont,
    color: accent,
    weight: featureTitleWeight,
    spacing: heroLayout === "pixel" ? 1 : 0,
    name: "Introductory title",
  });
  text(messageSection.id, data.message || copy.invitationFallback, {
    y: 140,
    w: 560,
    h: 150,
    size: 18,
    name: "INVITATION",
    color: sectionText,
    italic: true,
    delay: 0.2,
  });
  if (["cosmic", "pixel", "modern", "magazine", "minimalist"].includes(templateId)) {
    add(createComponent("icon", messageSection.id, {
      name: "Theme highlight",
      position: { x: Math.round(CX - 24), y: 302 },
      size: { width: 48, height: 48 },
      style: defaultStyle({ color: accent }),
      content: { icon: templateId === "pixel" ? "heart" : "star" },
      animation: {
        entrance: { type: "zoom-in", duration: 0.7, delay: 0.4, easing: "spring" },
        exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
        loop: { type: "twinkle", duration: 3.2 },
      },
    }));
  } else {
    add(createComponent("sticker", messageSection.id, {
      name: "Sticker hoa",
      position: { x: Math.round(CX - 40), y: 300 },
      size: { width: 80, height: 80 },
      content: { emoji: theme.decorEmoji || "💐" },
      animation: {
        entrance: { type: "zoom-in", duration: 0.7, delay: 0.4, easing: "spring" },
        exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
        loop: { type: "float", duration: 3.6 },
      },
    }));
  }
  if (data.galleryImageUrls?.length) {
    const collage = collageLayoutForTemplate(templateId);
    data.galleryImageUrls.slice(0, 3).forEach((src, index) => {
      const box = collage[index];
      add(createComponent("frame", messageSection.id, {
        name: `Moment ${String(index + 1).padStart(2, "0")}`,
        position: { x: box.x, y: box.y },
        size: { width: box.width, height: box.height },
        rotation: box.rotation,
        style: defaultStyle({
          background: visual.surface,
          padding: visual.frame === "polaroid" ? 8 : 0,
          radius: visual.radius,
          shadow: { enabled: true, x: 0, y: 14, blur: 34, spread: 0, color: heroDark ? "rgba(0,0,0,0.28)" : `${accent}26` },
        }),
        content: {
          src,
          frame: visual.frame,
          borderColor: templateId === "pixel" ? accent : visual.surface,
          borderWidth: templateId === "pixel" ? 6 : 1,
          imageMotion: index === 0 ? visual.imageMotion : index === 1 ? "pan-left" : "pan-right",
          imageOverlay: visual.imageOverlay,
        },
        animation: {
        entrance: { type: index === 0 ? "slide-right" : "slide-left", duration: 1.4, delay: 0.2 + index * 0.18, easing: "ease-out" },
          exit: { type: "none", duration: 0.45, delay: 0, easing: "ease-in" },
          loop: { type: templateId === "layered3d" ? "float" : templateId === "photo25d" ? "depth-float" : "none", duration: 7 + index },
        },
      }));
    });
  }

  /* ---------- Section 4: Events ---------- */
  const eventSection = addSection({
    name: "Event",
    height: 720,
    background: { color: visual.sectionAlt, gradient: { enabled: false, from: visual.sectionAlt, to: visual.section, angle: 180 }, imageUrl: "", imageOpacity: 1 },
  });
  text(eventSection.id, copy.events, { y: 60, size: 34, font: featureTitleFont, color: accent, weight: featureTitleWeight, spacing: heroLayout === "pixel" ? 1 : 0, name: "Event title" });
  add(
    createComponent("timeline", eventSection.id, {
      name: "Ceremony sequence",
      position: { x: Math.round(CX - 210), y: 150 },
      size: { width: 420, height: 250 },
      style: defaultStyle({
        fontSize: 18,
        fontFamily: fonts.body,
        color: visual.text,
        textAlign: "left",
        background: visual.surface,
        padding: 22,
        radius: visual.radius,
        border: { enabled: templateId === "pixel", width: 2, style: "solid", color: accent },
      }),
      content: {
        items: [
          { time: data.time || "17:30", title: "Welcoming guests", description: data.venue },
          { time: "18:30", title: "Marriage Ceremony", description: "" },
          { time: "19:30", title: "Party opening", description: "" },
        ],
        lineColor: accent,
      },
    })
  );
  add(
    createComponent("map", eventSection.id, {
      name: "Map",
      position: { x: Math.round(CX - 280), y: 430 },
      size: { width: 560, height: 200 },
      style: defaultStyle({ radius: visual.radius, border: { enabled: true, width: 1, style: "solid", color: `${accent}66` } }),
      content: { address: data.address || data.venue, zoom: 15 },
    })
  );
  add(
    createComponent("button", eventSection.id, {
      name: "Directions button",
      position: { x: Math.round(CX - 110), y: 650 },
      size: { width: 220, height: 48 },
      style: defaultStyle({ background: accent, color: "#FFFFFF", radius: Math.min(8, visual.radius), fontSize: 15, fontWeight: 600 }),
      content: {
        label: "Directions to the wedding",
        href: `https://maps.google.com/?q=${encodeURIComponent(data.address || data.venue)}`,
      },
      animation: {
        entrance: { type: "fade", duration: 0.6, delay: 0.2, easing: "ease-out" },
        exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
        loop: { type: "pulse", duration: 2.8 },
      },
    })
  );

  /* ---------- Section 5: Wedding gift — QR hidden in gift bag ---------- */
  const giftAccounts = [
    data.groomBank?.accountNumber ? { bank: data.groomBank, owner: data.groomBank.accountHolder || data.groomName, side: "Groom" } : null,
    data.brideBank?.accountNumber ? { bank: data.brideBank, owner: data.brideBank.accountHolder || data.brideName, side: "bride" } : null,
  ].filter((item): item is { bank: BankInfo; owner: string; side: string } => item !== null);

  if (giftAccounts.length) {
    const giftSection = addSection({
      name: "Wedding gift",
      height: 500,
      background: { color: visual.section, gradient: { enabled: false, from: visual.section, to: visual.sectionAlt, angle: 180 }, imageUrl: "", imageOpacity: 1 },
    });
    text(giftSection.id, "Send a gift of blessing", { y: 56, size: 34, font: featureTitleFont, color: accent, weight: featureTitleWeight, spacing: heroLayout === "pixel" ? 1 : 0, name: "Wedding gift title" });
    text(giftSection.id, "The QR code is kept in the gift bag. Guests tap open when they want to send their wishes to the two of you.", {
      y: 118, w: 560, h: 70, size: 17, color: visual.text, name: "Wedding gift message", italic: true,
    });

    giftAccounts.forEach((item, index) => {
      const width = giftAccounts.length === 1 ? 360 : 310;
      const x = giftAccounts.length === 1 ? Math.round(CX - width / 2) : 70 + index * 350;
      text(giftSection.id, `${item.bank.bankName} · ${item.bank.accountNumber}`, {
        x, y: 224, w: width, h: 44, size: 16, color: visual.text, weight: 600, name: `Account ${item.side}`,
      });
      const qrImage = getVietQrImageUrl(item.bank, item.owner);
      add(createComponent("qrcode", giftSection.id, {
        name: `Gift bag ${item.side}`,
        position: { x: x + Math.round((width - 260) / 2), y: 290 },
        size: { width: 260, height: 92 },
        style: defaultStyle({ radius: 8 }),
        content: {
          data: qrImage ? "" : `${item.bank.bankName} | ${item.bank.accountNumber} | ${item.owner}`,
          imageUrl: qrImage || "",
          fgColor: accent,
          bgColor: "#FFFFFF",
          title: `Congratulatory gift ${item.side}`,
          buttonLabel: `Open QR ${item.side}`,
        },
        animation: {
          entrance: { type: "bounce", duration: 0.9, delay: 0.2 + index * 0.15, easing: "spring" },
          exit: { type: "none", duration: 0.4, delay: 0, easing: "ease-in" },
          loop: { type: "pulse", duration: 3.2 + index * 0.4 },
        },
      }));
    });
  }

  /* ---------- RSVP & Guestbook ---------- */
  const rsvpSection = addSection({
    name: "Confirmation & Guestbook",
    height: 900,
    background: { color: visual.sectionAlt, gradient: { enabled: false, from: visual.sectionAlt, to: visual.section, angle: 180 }, imageUrl: "", imageOpacity: 1 },
  });
  text(rsvpSection.id, "Will You Come?", { y: 56, size: 34, font: featureTitleFont, color: accent, weight: featureTitleWeight, spacing: heroLayout === "pixel" ? 1 : 0, name: "RSVP header" });
  add(
    createComponent("rsvp", rsvpSection.id, {
      name: "Confirmation form",
      position: { x: Math.round(CX - 210), y: 140 },
      size: { width: 420, height: 300 },
      style: defaultStyle({
        background: "#FFFFFF",
        radius: visual.radius,
        padding: 20,
        textAlign: "center",
        fontFamily: fonts.body,
        color: DARK_TEXT,
        fontSize: 18,
        shadow: { enabled: true, x: 0, y: 10, blur: 30, spread: 0, color: `${accent}26` },
      }),
      content: { title: "Confirmation of Attendance", buttonLabel: "Send confirmation", accentColor: accent },
    })
  );
  add(
    createComponent("guestbook", rsvpSection.id, {
      name: "Guestbook",
      position: { x: Math.round(CX - 220), y: 480 },
      size: { width: 440, height: 380 },
      style: defaultStyle({
        background: "#FFFFFF",
        radius: visual.radius,
        padding: 20,
        textAlign: "center",
        fontFamily: fonts.body,
        color: DARK_TEXT,
        fontSize: 18,
      }),
      content: { title: "Sending Blessings", accentColor: accent },
    })
  );

  /* ---------- Section 6: Conclusion ---------- */
  const closing = addSection({
    name: "Conclusion",
    height: 420,
    background: {
      color: heroGradient[1],
      gradient: { enabled: true, from: heroGradient[1], to: heroGradient[0], angle: 180 },
      imageUrl: "",
      imageOpacity: 1,
    },
  });
  add(
    createComponent("effects", closing.id, {
      name: "Sparkling link (lock)",
      position: { x: 0, y: 0 },
      size: { width: W, height: 420 },
      locked: true,
      content: { effect: "sparkles", density: 10, speed: 0.6, size: 14 },
    })
  );
  text(closing.id, copy.closing, {
    y: 110,
    size: 26,
    font: fonts.heading,
    color: heroText,
    name: "Conclusion",
    italic: true,
  });
  text(closing.id, `${data.groomName} & ${data.brideName}`, {
    y: 190,
    size: 44,
    h: 90,
    font: fonts.script,
    color: heroDark ? "#F5DFA9" : accent,
    name: "Signature",
    delay: 0.3,
  });
  add(
    createComponent("divider", closing.id, {
      name: "Separation of endings",
      position: { x: Math.round(CX - 120), y: 300 },
      size: { width: 240, height: 26 },
      style: defaultStyle({ color: heroDark ? "#F5DFA9" : accent }),
      content: { variant: "hearts", thickness: 2 },
    })
  );

  doc.settings.outerBackground = heroDark ? palette[0] : (theme.sectionBg2 || "#F5F0EB");
  return doc;
}
