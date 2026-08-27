import type { WeddingTheme } from "@/data/themes";
import type { BankInfo, ChatMessage, StoryMilestone } from "@/data/seedData";

export type BankAccount = BankInfo;

/**
 * Shared props contract for every dedicated wedding template component.
 * Import this instead of redefining a local interface in each template file.
 */
export interface TemplateProps {
  groomName?: string;
  brideName?: string;
  date?: string;
  time?: string;
  venue?: string;
  address?: string;
  message?: string;
  accentColor?: string;
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
  chatMessages?: ChatMessage[];
  groomBank?: BankInfo;
  brideBank?: BankInfo;
  stories?: StoryMilestone[];
  groomParents?: import("@/data/seedData").ParentInfo;
  brideParents?: import("@/data/seedData").ParentInfo;
  schedule?: import("@/data/seedData").ScheduleEvent[];
  dressCodeColors?: string[];
  faqs?: import("@/data/seedData").FaqItem[];
  theme: WeddingTheme;
}
