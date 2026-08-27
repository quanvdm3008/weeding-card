import type { BankInfo, FaqItem, ParentInfo, ScheduleEvent, StoryMilestone } from "@/data/seedData";

export const INVITATION_DOCUMENT_VERSION = 1;

export type EditorWorkspace = "guided" | "canvas";
export type EditorSaveState = "idle" | "saving" | "saved" | "error";

export interface SectionStyle {
  paddingY?: number;
  borderRadius?: number;
  shadow?: string;
  glassEffect?: boolean;
  background?: string;
  customTitle?: string;
  visible?: boolean;
}

export interface GuidedInvitationConfig {
  invitationId: string;
  templateId: string;
  groomName: string;
  brideName: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  message: string;
  accentColor: string;
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: 400 | 500 | 600 | 700 | 800 | 900;
  headingCase?: "normal" | "uppercase";
  accentStyle?: "minimal" | "underline" | "highlight" | "editorial";
  musicUrl: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  extraInfoTitle: string;
  extraInfoContent: string;
  slug: string;
  published: boolean;
  rsvpEnabled: boolean;
  wishesEnabled: boolean;
  cursorType?: "default" | "follow" | "ripple";
  particlesType?: "none" | "sparkles" | "petals" | "leaves" | "galaxy" | "pixel" | "sakura" | "hearts" | "gold_stars" | "snow" | "fireflies" | "bubbles" | "gold_dust";
  photoFilter?: "none" | "grayscale" | "sepia" | "vintage" | "blur";
  glassBlur?: number;
  tiltEffect3d?: boolean;
  glowBorder?: boolean;
  particleSpeed?: "slow" | "medium" | "fast";
  particleDensity?: "low" | "normal" | "dense";
  photoAuraGlow?: boolean;
  photoShimmer?: boolean;
  photoTilt3d?: boolean;
  touchSparkles?: boolean;
  photoColorShift?: boolean;
  photoFrameStyle?: "classic" | "brass_corners" | "frosted_glass" | "gold_edge";
  customSections?: string[];
  sectionStyles?: Record<string, SectionStyle>;
  groomBank?: BankInfo;
  brideBank?: BankInfo;
  stories?: StoryMilestone[];
  groomParents?: ParentInfo;
  brideParents?: ParentInfo;
  schedule?: ScheduleEvent[];
  dressCodeColors?: string[];
  faqs?: FaqItem[];
}

export interface InvitationDocument<TCanvas = unknown> {
  schemaVersion: number;
  id: string;
  invitationId: string | null;
  name: string;
  activeWorkspace: EditorWorkspace;
  guided: GuidedInvitationConfig;
  canvas: TCanvas | null;
  metadata: {
    createdAt: string;
    updatedAt: string;
    source: "blank" | "template" | "existing";
    templateVersion?: string;
    serverVersion?: number;
  };
}

export type InvitationDocumentWithoutCanvas = InvitationDocument<never>;
