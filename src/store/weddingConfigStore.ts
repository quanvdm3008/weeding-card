import { create } from "zustand";
import { persist } from "zustand/middleware";
import { templates } from "@/data/templates";
import { getTheme } from "@/data/themes";
import { resolveBuilderConfig, resolveInvitationContentConfig } from "@/lib/builderConfig";
import type { EditorSaveState, GuidedInvitationConfig } from "@/features/editor/domain/types";
import { executeCommand, mutationCommand, redoSnapshot, undoSnapshot } from "@/features/editor/domain/commands";

export type { GuidedInvitationConfig as WeddingConfig, SectionStyle } from "@/features/editor/domain/types";

/** Customize the display of a section in the Builder (all fields are optional — if not, use default when rendering). */
type WeddingConfig = GuidedInvitationConfig;

interface WeddingConfigState extends WeddingConfig {
  past: WeddingConfig[];
  future: WeddingConfig[];
  dirty: boolean;
  saveState: EditorSaveState;
  setField: <K extends keyof WeddingConfig>(key: K, value: WeddingConfig[K]) => void;
  setTemplate: (templateId: string) => void;
  reset: () => void;
  load: (cfg: Partial<WeddingConfig> & { builderConfig?: string | null; contentConfig?: string | null }) => void;
  undo: () => void;
  redo: () => void;
  markSaved: () => void;
  setSaveState: (saveState: EditorSaveState) => void;
}

const HISTORY_LIMIT = 100;

const defaultConfig: WeddingConfig = {
  invitationId: "",
  templateId: "romantic",
  groomName: "Minh Anh",
  brideName: "Thanh Ha",
  date: "2027-02-14",
  time: "17:30",
  venue: "White Palace Convention Center",
  address: "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
  message:
    "Sincerely invite you to attend our wedding ceremony. Your presence is a great honor.",
  accentColor: "#E8B4B8",
  headingFont: "Cormorant Garamond",
  bodyFont: "Inter",
  headingWeight: 600,
  headingCase: "normal",
  accentStyle: "minimal",
  musicUrl: "",
  coverImageUrl: "",
  galleryImageUrls: [],
  extraInfoTitle: "Information for guests",
  extraInfoContent: "",
  slug: "",
  published: false,
  rsvpEnabled: true,
  wishesEnabled: true,
  cursorType: "follow",
  particlesType: "sparkles",
  glassBlur: 16,
  tiltEffect3d: true,
  glowBorder: true,
  particleSpeed: "medium",
  particleDensity: "normal",
  photoAuraGlow: true,
  photoShimmer: true,
  photoTilt3d: true,
  touchSparkles: true,
  photoColorShift: false,
  photoFrameStyle: "brass_corners",
  photoFilter: "none",
  groomBank: undefined,
  brideBank: undefined,
  stories: undefined,
  groomParents: undefined,
  brideParents: undefined,
  schedule: undefined,
  dressCodeColors: undefined,
  faqs: undefined,
  customSections: ["couple", "countdown", "story", "message", "details", "gallery", "events", "wishes", "rsvp"],
  sectionStyles: {},
};

function toConfigSnapshot(state: WeddingConfigState): WeddingConfig {
  const {
    past: _past,
    future: _future,
    dirty: _dirty,
    saveState: _saveState,
    setField: _setField,
    setTemplate: _setTemplate,
    reset: _reset,
    load: _load,
    undo: _undo,
    redo: _redo,
    markSaved: _markSaved,
    setSaveState: _setSaveState,
    ...config
  } = state;
  return structuredClone(config);
}

export function getWeddingConfigSnapshot(): WeddingConfig {
  return toConfigSnapshot(useWeddingConfig.getState());
}

export const useWeddingConfig = create<WeddingConfigState>()(
  persist(
    (set) => ({
      ...defaultConfig,
      past: [],
      future: [],
      dirty: false,
      saveState: "idle",
      setField: (key, value) => set((state) => {
        if (state[key] === value) return state;
        const current = toConfigSnapshot(state);
        const result = executeCommand(
          { present: current, past: state.past, future: state.future },
          mutationCommand(`guided:${String(key)}`, (config) => ({ ...config, [key]: value })),
          HISTORY_LIMIT,
        );
        return {
          ...result.present,
          past: result.past,
          future: result.future,
          dirty: true,
          saveState: "idle" as const,
        };
      }),
      setTemplate: (templateId) => {
        const t = templates.find((x) => x.id === templateId);
        const headingFont: WeddingConfig["headingFont"] = t?.category === "minimalist" ? "Inter" : t?.category === "Modern" || t?.category === "traditional" ? "Playfair Display" : "Cormorant Garamond";
        const bodyFont: WeddingConfig["bodyFont"] = t?.category === "classic" ? "Cormorant Garamond" : "Inter";
        const headingWeight: WeddingConfig["headingWeight"] = t?.category === "Modern" ? 800 : t?.category === "traditional" ? 700 : 600;
        const headingCase: WeddingConfig["headingCase"] = t?.category === "Modern" ? "uppercase" : "normal";
        const accentStyle: WeddingConfig["accentStyle"] = t?.category === "Modern" ? "editorial" : "minimal";
        set((state) => {
          if (state.templateId === templateId) return state;
          const current = toConfigSnapshot(state);
          const result = executeCommand(
            { present: current, past: state.past, future: state.future },
            mutationCommand("guided:template", (config) => ({
              ...config,
              templateId,
              accentColor: getTheme(templateId).textAccent,
              headingFont,
              bodyFont,
              headingWeight,
              headingCase,
              accentStyle,
            })),
            HISTORY_LIMIT,
          );
          return { ...result.present, past: result.past, future: result.future, dirty: true, saveState: "idle" as const };
        });
      },
      reset: () => set({ ...defaultConfig, past: [], future: [], dirty: false, saveState: "idle" }),
      load: (cfg) => {
        const { content: extraInfoContent, config } = resolveBuilderConfig(cfg.builderConfig, cfg.extraInfoContent);
        const contentConfig = resolveInvitationContentConfig(cfg.contentConfig, cfg.builderConfig, cfg.extraInfoContent);
        const { builderConfig: _builderConfig, contentConfig: _contentConfig, ...values } = cfg;

        set({
          ...defaultConfig,
          ...values,
          extraInfoContent,
          ...(config ? config : {}),
          ...contentConfig,
          past: [],
          future: [],
          dirty: false,
          saveState: "idle",
        });
      },
      undo: () => set((state) => {
        const current = toConfigSnapshot(state);
        const result = undoSnapshot({ present: current, past: state.past, future: state.future }, HISTORY_LIMIT);
        if (result.present === current) return state;
        return { ...result.present, past: result.past, future: result.future, dirty: true, saveState: "idle" as const };
      }),
      redo: () => set((state) => {
        const current = toConfigSnapshot(state);
        const result = redoSnapshot({ present: current, past: state.past, future: state.future }, HISTORY_LIMIT);
        if (result.present === current) return state;
        return { ...result.present, past: result.past, future: result.future, dirty: true, saveState: "idle" as const };
      }),
      markSaved: () => set({ dirty: false, saveState: "saved" }),
      setSaveState: (saveState) => set({ saveState }),
    }),
    {
      name: "wedding-config-storage",
      partialize: (state) => toConfigSnapshot(state),
    }
  )
);
