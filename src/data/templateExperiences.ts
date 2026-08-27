import { isTemplateId, type TemplateId } from "./templateIds";

export type OpeningVariant = "letter" | "cinema" | "seal" | "vintage" | "minimal" | "fluid" | "glass" | "map" | "gallery" | "rustic" | "coastal" | "winter" | "aurora" | "cyber" | "violet_dream" | "parallax_love" | "luxury";
export type BonusSectionKey = "memories" | "weather" | "extraInfo";
export type ExperienceLayout = "storybook" | "editorial" | "destination" | "royal" | "minimal" | "timeline";

export interface TemplateExperience {
  layout: ExperienceLayout;
  opening: OpeningVariant;
  /** Curated default flow. Builder ordering still wins after the user customizes it. */
  sectionOrder: string[];
  bonusSections: BonusSectionKey[];
  chapterLabels: Record<string, string>;
  inviteLine: string;
}

const commonLabels: Record<string, string> = {
  couple: "The Two of Us",
  countdown: "Until We Say I Do",
  story: "Our Journey",
  message: "A Word From Us",
  details: "The Journey There",
  gallery: "Album",
  events: "The Celebration",
  wishes: "Guest Book",
  rsvp: "Kindly Respond",
};

export const DEFAULT_SECTION_FLOW = [
  "couple",
  "countdown",
  "story",
  "message",
  "details",
  "gallery",
  "events",
  "wishes",
  "bank", "rsvp",
];

export const templateExperiences: Record<TemplateId, TemplateExperience> = {
  canvas: {
    layout: "minimal",
    opening: "minimal",
    sectionOrder: DEFAULT_SECTION_FLOW,
    bonusSections: [],
    chapterLabels: commonLabels,
    inviteLine: "A celebration shaped entirely by you",
  },
  romantic: {
    layout: "storybook",
    opening: "letter",
    sectionOrder: ["message", "couple", "story", "gallery", "events", "countdown", "bank", "wishes", "bank", "rsvp", "details"],
    bonusSections: ["memories", "extraInfo"],
    chapterLabels: { ...commonLabels, story: "Love Letters", gallery: "Memory Lane" },
    inviteLine: "A love letter is waiting to be opened",
  },
  modern: {
    layout: "editorial",
    opening: "cinema",
    sectionOrder: ["countdown", "events", "couple", "gallery", "story", "message", "bank", "bank", "rsvp", "wishes", "details"],
    bonusSections: ["extraInfo"],
    chapterLabels: { ...commonLabels, gallery: "Editorial Frames", events: "The Run of Show" },
    inviteLine: "A clean schedule for a modern celebration",
  },
  tropical: {
    layout: "destination",
    opening: "map",
    sectionOrder: ["details", "countdown", "events", "gallery", "couple", "story", "message", "bank", "bank", "rsvp", "wishes"],
    bonusSections: ["weather", "extraInfo"],
    chapterLabels: { ...commonLabels, gallery: "Beach Album", events: "Island Schedule" },
    inviteLine: "Your destination wedding pass",
  },
  rustic: {
    layout: "storybook",
    opening: "rustic",
    sectionOrder: ["message", "couple", "story", "events", "gallery", "details", "countdown", "bank", "wishes", "bank", "rsvp"],
    bonusSections: ["memories", "extraInfo"],
    chapterLabels: { ...commonLabels, gallery: "polaroid", story: "Handwritten Chapters" },
    inviteLine: "A handmade note for our favorite people",
  },
  sakura: {
    layout: "storybook",
    opening: "glass",
    sectionOrder: ["message", "couple", "gallery", "story", "countdown", "events", "bank", "wishes", "bank", "rsvp", "details"],
    bonusSections: ["extraInfo"],
    chapterLabels: { ...commonLabels, gallery: "Photo Wall", events: "Quiet Ceremony" },
    inviteLine: "A quiet ceremony under sakura petals",
  },
  minimalist: {
    layout: "minimal",
    opening: "minimal",
    sectionOrder: ["events", "countdown", "message", "couple", "gallery", "story", "bank", "bank", "rsvp", "wishes", "details"],
    bonusSections: [],
    chapterLabels: { ...commonLabels, events: "Essential Details", gallery: "Selected Frames" },
    inviteLine: "Essential details, beautifully arranged",
  },
  vintage: {
    layout: "storybook",
    opening: "vintage",
    sectionOrder: ["message", "story", "couple", "gallery", "events", "countdown", "bank", "wishes", "bank", "rsvp", "details"],
    bonusSections: ["memories", "extraInfo"],
    chapterLabels: { ...commonLabels, story: "Old Romance", gallery: "Film Archive" },
    inviteLine: "An old-world invitation unfolds",
  },
  boho: {
    layout: "timeline",
    opening: "gallery",
    sectionOrder: ["gallery", "story", "couple", "message", "events", "details", "countdown", "bank", "wishes", "bank", "rsvp"],
    bonusSections: ["memories", "extraInfo"],
    chapterLabels: { ...commonLabels, gallery: "Scrapbook", story: "The Road So Far" },
    inviteLine: "A scrapbook of a personal journey",
  },
  royal: {
    layout: "royal",
    opening: "seal",
    sectionOrder: ["message", "events", "countdown", "couple", "story", "gallery", "bank", "bank", "rsvp", "wishes", "details"],
    bonusSections: ["extraInfo"],
    chapterLabels: { ...commonLabels, gallery: "The Royal Portraits", events: "Ceremony Programme" },
    inviteLine: "The royal invitation is sealed",
  },
  garden: {
    layout: "storybook",
    opening: "fluid",
    sectionOrder: ["couple", "story", "gallery", "message", "events", "countdown", "bank", "wishes", "bank", "rsvp", "details"],
    bonusSections: ["memories", "extraInfo"],
    chapterLabels: { ...commonLabels, story: "Chapter One", gallery: "Magic Garden" },
    inviteLine: "Turn the first page of our story",
  },
  flat2d: {
    layout: "minimal",
    opening: "minimal",
    sectionOrder: ["gallery", "events", "countdown", "couple", "story", "message", "bank", "bank", "rsvp", "wishes", "details"],
    bonusSections: ["memories"],
    chapterLabels: { ...commonLabels, gallery: "2D flat photo grid" },
    inviteLine: "Please touch to see flat wedding invitation",
  },
  layered3d: {
    layout: "storybook",
    opening: "fluid",
    sectionOrder: ["story", "gallery", "couple", "message", "events", "countdown", "bank", "wishes", "bank", "rsvp", "details"],
    bonusSections: ["memories", "extraInfo"],
    chapterLabels: { ...commonLabels, gallery: "3D sticker album", story: "Multi-layered journey" },
    inviteLine: "Flip through each layer of the book to reveal the story",
  },
  photo25d: {
    layout: "editorial",
    opening: "gallery",
    sectionOrder: ["story", "gallery", "countdown", "events", "message", "bank", "bank", "rsvp", "wishes", "details", "couple"],
    bonusSections: ["memories"],
    chapterLabels: { ...commonLabels, gallery: "Overlapping albums", story: "Every layer of memory" },
    inviteLine: "Tap to open each layer of our memories",
  },
  cosmic: {
    layout: "editorial",
    opening: "cinema",
    sectionOrder: ["countdown", "story", "gallery", "events", "message", "bank", "bank", "rsvp", "wishes", "details", "couple"],
    bonusSections: ["memories", "extraInfo"],
    chapterLabels: { ...commonLabels, story: "Star map", gallery: "Memory planets" },
    inviteLine: "An invitation sent from the middle of the galaxy",
  },
  pixel: {
    layout: "timeline",
    opening: "minimal",
    sectionOrder: ["countdown", "story", "gallery", "events", "message", "bank", "bank", "rsvp", "wishes", "details", "couple"],
    bonusSections: ["memories"],
    chapterLabels: { ...commonLabels, story: "Love Quest", gallery: "Memory Inventory" },
    inviteLine: "Press start to enter our story",
  },
  luxury: {
    layout: "royal",
    opening: "luxury",
    sectionOrder: ["countdown", "events", "gallery", "couple", "message", "story", "bank", "bank", "rsvp", "wishes", "details"],
    bonusSections: ["extraInfo"],
    chapterLabels: { ...commonLabels, gallery: "The Gilded Edit" },
    inviteLine: "An evening written in gold",
  },
  korean: {
    layout: "minimal",
    opening: "minimal",
    sectionOrder: ["message", "gallery", "couple", "events", "countdown", "story", "bank", "bank", "rsvp", "wishes", "details"],
    bonusSections: ["extraInfo"],
    chapterLabels: { ...commonLabels, gallery: "Seoul Studio" },
    inviteLine: "A quiet day, held close",
  },
  magazine: {
    layout: "editorial",
    opening: "cinema",
    sectionOrder: ["gallery", "couple", "events", "story", "countdown", "message", "bank", "bank", "rsvp", "wishes", "details"],
    bonusSections: ["extraInfo"],
    chapterLabels: { ...commonLabels, gallery: "The Cover Story" },
    inviteLine: "The wedding issue is now open",
  },
  traditional: {
    layout: "royal",
    opening: "seal",
    sectionOrder: ["message", "events", "couple", "countdown", "story", "gallery", "bank", "bank", "rsvp", "wishes", "details"],
    bonusSections: ["extraInfo"],
    chapterLabels: { ...commonLabels, events: "Marriage Ceremony" },
    inviteLine: "Sincerely invite the wedding day",
  },
  cyberpunk_luxe: {
    layout: "editorial",
    opening: "cyber",
    sectionOrder: ["countdown", "story", "gallery", "events", "message", "bank", "bank", "rsvp", "wishes", "details", "couple"],
    bonusSections: ["memories", "extraInfo"],
    chapterLabels: { ...commonLabels, story: "Signal Log", gallery: "Neon Frames" },
    inviteLine: "A signal from two hearts is ready to connect",
  },
  nordic_aurora: {
    layout: "storybook",
    opening: "aurora",
    sectionOrder: ["message", "couple", "events", "countdown", "gallery", "story", "bank", "wishes", "bank", "rsvp", "details"],
    bonusSections: ["memories", "extraInfo"],
    chapterLabels: { ...commonLabels, story: "Under Northern Lights", gallery: "Aurora Frames" },
    inviteLine: "A quiet promise beneath the northern lights",
  },
  coastal: {
    layout: "destination",
    opening: "coastal",
    sectionOrder: ["countdown", "events", "couple", "story", "gallery", "message", "bank", "bank", "rsvp", "wishes", "details"],
    bonusSections: ["weather", "extraInfo"],
    chapterLabels: { ...commonLabels, gallery: "Seaside Memories" },
    inviteLine: "Feel the ocean breeze",
  },
  winter: {
    layout: "storybook",
    opening: "winter",
    sectionOrder: ["message", "couple", "events", "countdown", "gallery", "story", "bank", "wishes", "bank", "rsvp", "details"],
    bonusSections: ["extraInfo"],
    chapterLabels: { ...commonLabels, gallery: "Frozen Frames" },
    inviteLine: "A winter wonderland awaits",
  },
  violet_dream: {
    layout: "editorial",
    opening: "violet_dream" as OpeningVariant,
    sectionOrder: ["message", "couple", "events", "gallery", "story", "countdown", "bank", "wishes", "bank", "rsvp", "details"],
    bonusSections: ["extraInfo"],
    chapterLabels: { ...commonLabels, gallery: "Dreamy Moments", events: "The Celebration" },
    inviteLine: "Step into our violet dream",
  },
  parallax_love: {
    layout: "editorial",
    opening: "parallax_love" as OpeningVariant,
    sectionOrder: ["message", "events", "countdown", "couple", "story", "gallery", "bank", "wishes", "bank", "rsvp", "details"],
    bonusSections: ["extraInfo"],
    chapterLabels: { ...commonLabels, story: "The Journey", gallery: "Cinematic Frames" },
    inviteLine: "Experience the depth of our love",
  }
};

export const getTemplateExperience = (templateId: string): TemplateExperience =>
  isTemplateId(templateId) ? templateExperiences[templateId] : templateExperiences.romantic;
