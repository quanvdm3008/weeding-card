import { WEDDING_SEED_DATA } from "./seedData";

export interface WeddingCoupleConfig {
  groom: string;
  bride: string;
  groomParents?: import("./seedData").ParentInfo;
  brideParents?: import("./seedData").ParentInfo;
}

export interface WeddingEventConfig {
  date: string;
  time: string;
  venue: string;
  address: string;
  schedule?: import("./seedData").ScheduleEvent[];
}

export interface WeddingGalleryConfig {
  coverImage: string;
  images: string[];
}

export interface WeddingStoryConfig {
  timeline: import("./seedData").StoryMilestone[];
  message: string;
  chatMessages?: import("./seedData").ChatMessage[];
}

export interface WeddingThemeConfig {
  template: string;
  accentColor?: string;
  colors?: string[]; // dress code etc
}

export interface WeddingMusicConfig {
  enabled: boolean;
  url?: string;
}

export interface WeddingConfigData {
  couple: WeddingCoupleConfig;
  wedding: WeddingEventConfig;
  gallery: WeddingGalleryConfig;
  story: WeddingStoryConfig;
  theme: WeddingThemeConfig;
  music: WeddingMusicConfig;
  faqs?: import("./seedData").FaqItem[];
  groomBank?: import("./seedData").BankInfo;
  brideBank?: import("./seedData").BankInfo;
}

// Convert from old flat seed data to new structured config for demonstration
export const WEDDING_CONFIG: WeddingConfigData = {
  couple: {
    groom: WEDDING_SEED_DATA.groomName,
    bride: WEDDING_SEED_DATA.brideName,
    groomParents: WEDDING_SEED_DATA.groomParents,
    brideParents: WEDDING_SEED_DATA.brideParents,
  },
  wedding: {
    date: WEDDING_SEED_DATA.date,
    time: WEDDING_SEED_DATA.time,
    venue: WEDDING_SEED_DATA.venue,
    address: WEDDING_SEED_DATA.address,
    schedule: WEDDING_SEED_DATA.schedule,
  },
  gallery: {
    coverImage: WEDDING_SEED_DATA.coverImageUrl,
    images: WEDDING_SEED_DATA.galleryImageUrls,
  },
  story: {
    timeline: WEDDING_SEED_DATA.stories,
    message: WEDDING_SEED_DATA.message,
    chatMessages: WEDDING_SEED_DATA.chatMessages,
  },
  theme: {
    template: "romantic",
    colors: WEDDING_SEED_DATA.dressCodeColors,
  },
  music: {
    enabled: true,
  },
  faqs: WEDDING_SEED_DATA.faqs,
  groomBank: WEDDING_SEED_DATA.groomBank,
  brideBank: WEDDING_SEED_DATA.brideBank,
};
