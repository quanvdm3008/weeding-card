export type RSVPArrangement = "centered" | "split" | "split-reverse" | "stacked" | "framed";
export type WishesFlow = "grid" | "columns" | "rail" | "ledger" | "staggered" | "featured";

export interface TemplateLayoutProfile {
  rsvp: {
    composition: string;
    arrangement: RSVPArrangement;
    code: string;
    detail: string;
    surface: "paper" | "glass" | "dark" | "color";
  };
  wishes: {
    composition: string;
    flow: WishesFlow;
    label: string;
  };
}

export const templateLayouts: Record<TemplateId, TemplateLayoutProfile> = {
  canvas: {
    rsvp: { composition: "studio-sheet", arrangement: "centered", code: "RSVP / 01", detail: "A quiet note from our studio", surface: "paper" },
    wishes: { composition: "studio-wall", flow: "grid", label: "THE MESSAGE WALL" },
  },
  romantic: {
    rsvp: { composition: "love-letter", arrangement: "stacked", code: "SEALED WITH LOVE", detail: "Open the letter to reply", surface: "paper" },
    wishes: { composition: "love-letters", flow: "staggered", label: "LETTERS WE WILL KEEP" },
  },
  modern: {
    rsvp: { composition: "guest-list", arrangement: "split", code: "GUEST / 2026", detail: "Private evening admission", surface: "dark" },
    wishes: { composition: "editorial-notes", flow: "columns", label: "GUEST NOTES / VOL. 01" },
  },
  tropical: {
    rsvp: { composition: "destination-pass", arrangement: "split-reverse", code: "GATE LOVE", detail: "Destination wedding boarding pass", surface: "color" },
    wishes: { composition: "postcard-rail", flow: "staggered", label: "POSTCARDS FROM PARADISE" },
  },
  rustic: {
    rsvp: { composition: "handwritten-card", arrangement: "stacked", code: "HANDMADE / 01", detail: "Pinned to our wedding journal", surface: "paper" },
    wishes: { composition: "cork-notes", flow: "staggered", label: "NOTES FROM OUR PEOPLE" },
  },
  sakura: {
    rsvp: { composition: "sakura-window", arrangement: "framed", code: "SAKURA REPLY", detail: "A soft answer beneath the blossoms", surface: "glass" },
    wishes: { composition: "sakura-cascade", flow: "columns", label: "BENEATH THE BLOSSOMS" },
  },
  minimalist: {
    rsvp: { composition: "quiet-line", arrangement: "centered", code: "R.S.V.P", detail: "Kindly Respond", surface: "paper" },
    wishes: { composition: "minimal-index", flow: "ledger", label: "NOTES / INDEX" },
  },
  vintage: {
    rsvp: { composition: "telegram", arrangement: "framed", code: "TELEGRAM No. 09", detail: "Reply from the wedding archive", surface: "paper" },
    wishes: { composition: "archive-columns", flow: "columns", label: "FROM THE ARCHIVE" },
  },
  boho: {
    rsvp: { composition: "festival-pass", arrangement: "split", code: "GOOD VIBES ONLY", detail: "A free-spirited celebration", surface: "color" },
    wishes: { composition: "boho-masonry", flow: "staggered", label: "WARM WORDS & GOOD VIBES" },
  },
  royal: {
    rsvp: { composition: "royal-crest", arrangement: "framed", code: "ROYAL AUDIENCE", detail: "Entered in the book of honored guests", surface: "dark" },
    wishes: { composition: "royal-ledger", flow: "ledger", label: "THE ROYAL GUEST BOOK" },
  },
  garden: {
    rsvp: { composition: "garden-arch", arrangement: "framed", code: "GARDEN No. 12", detail: "A seat is blooming for you", surface: "glass" },
    wishes: { composition: "garden-whispers", flow: "columns", label: "WHISPERS IN THE GARDEN" },
  },
  flat2d: {
    rsvp: { composition: "color-block", arrangement: "split-reverse", code: "YES / NO", detail: "One clear answer, one happy day", surface: "color" },
    wishes: { composition: "flat-tiles", flow: "grid", label: "MESSAGE BOARD" },
  },
  layered3d: {
    rsvp: { composition: "depth-stage", arrangement: "stacked", code: "LAYER/FINAL", detail: "Step into the final chapter", surface: "glass" },
    wishes: { composition: "depth-layers", flow: "featured", label: "STORY LAYERS" },
  },
  photo25d: {
    rsvp: { composition: "photo-stack", arrangement: "split", code: "FRAME / RSVP", detail: "Save your place in this frame", surface: "paper" },
    wishes: { composition: "photo-notes", flow: "staggered", label: "NOTES BEHIND THE PHOTOS" },
  },
  cosmic: {
    rsvp: { composition: "orbital-signal", arrangement: "split-reverse", code: "SIGNAL 08", detail: "Transmit attendance to our orbit", surface: "dark" },
    wishes: { composition: "message-orbit", flow: "featured", label: "SIGNALS FROM EARTH" },
  },
  pixel: {
    rsvp: { composition: "quest-terminal", arrangement: "centered", code: "PLAYER RSVP", detail: "Join the wedding quest", surface: "dark" },
    wishes: { composition: "message-inventory", flow: "grid", label: "LOVE QUEST INVENTORY" },
  },
  luxury: {
    rsvp: { composition: "evening-invitation", arrangement: "split", code: "PRIVATE/08", detail: "An evening reserved in your name", surface: "dark" },
    wishes: { composition: "golden-book", flow: "ledger", label: "THE GOLDEN GUEST BOOK" },
  },
  korean: {
    rsvp: { composition: "seoul-note", arrangement: "centered", code: "MAEUM / REPLY", detail: "A sincere answer from the heart", surface: "paper" },
    wishes: { composition: "seoul-rows", flow: "ledger", label: "WORDS FROM THE HEART" },
  },
  magazine: {
    rsvp: { composition: "issue-response", arrangement: "split-reverse", code: "ISSUE 01 / RSVP", detail: "Confirm your place in this edition", surface: "paper" },
    wishes: { composition: "reader-columns", flow: "columns", label: "LETTERS TO THE EDITORS" },
  },
  traditional: {
    rsvp: { composition: "red-scroll", arrangement: "framed", code: "RSVP", detail: "A gracious reply to the wedding invitation", surface: "dark" },
    wishes: { composition: "blessing-scroll", flow: "ledger", label: "GOLDEN BOOK OF Blessings" },
  },
  cyberpunk_luxe: {
    rsvp: { composition: "neon-terminal", arrangement: "split", code: "ACCESS / RSVP", detail: "Confirm your signal in Neo-Tokyo", surface: "dark" },
    wishes: { composition: "hologram-feed", flow: "rail", label: "TRANSMISSIONS OF LOVE" },
  },
  nordic_aurora: {
    rsvp: { composition: "aurora-cabin", arrangement: "stacked", code: "NORTH / REPLY", detail: "A quiet answer beneath the northern lights", surface: "glass" },
    wishes: { composition: "constellation-notes", flow: "featured", label: "WISHES UNDER THE AURORA" },
  },
  coastal: {
    rsvp: { composition: "sea-glass", arrangement: "split", code: "TIDE / RSVP", detail: "A reply carried by the tide", surface: "glass" },
    wishes: { composition: "shoreline-notes", flow: "rail", label: "WAVES OF WARM WISHES" },
  },
  winter: {
    rsvp: { composition: "winter-letter", arrangement: "framed", code: "SNOW / RSVP", detail: "A warm reply for our winter day", surface: "paper" },
    wishes: { composition: "snowfall-notes", flow: "columns", label: "WISHES IN THE SNOW" },
  },
  violet_dream: {
    rsvp: { composition: "violet-window", arrangement: "framed", code: "VIOLET / RSVP", detail: "A reply from the dream", surface: "glass" },
    wishes: { composition: "starlit-notes", flow: "featured", label: "STARS OF KINDNESS" },
  },
  parallax_love: {
    rsvp: { composition: "sunset-letter", arrangement: "stacked", code: "SUNSET / RSVP", detail: "Meet us at golden hour", surface: "paper" },
    wishes: { composition: "sunset-postcards", flow: "staggered", label: "NOTES AT GOLDEN HOUR" },
  },
};

const DEFAULT_LAYOUT = templateLayouts.canvas;

export function getTemplateLayout(templateId?: string): TemplateLayoutProfile {
  return templateId && isTemplateId(templateId) ? templateLayouts[templateId] : DEFAULT_LAYOUT;
}
import { isTemplateId, type TemplateId } from "./templateIds";
