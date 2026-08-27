import { create } from "zustand";
import type { Rect, SnapLine } from "../canvas/interactions";

/** Temporary UI state when interacting with canvas (guide, marquee) — separated from document. */
interface InteractionState {
  guides: SnapLine[];
  /** Marquee in document coordinates (calculated from the top of the page, including section offset). */
  marquee: (Rect & { active: boolean }) | null;
  snapEnabled: boolean;
  /** Component id is opening the image selection dialog (double-click image/frame/gallery). */
  imagePickerFor: string | null;
  setGuides: (guides: SnapLine[]) => void;
  setMarquee: (marquee: (Rect & { active: boolean }) | null) => void;
  toggleSnap: () => void;
  openImagePicker: (componentId: string) => void;
  closeImagePicker: () => void;
}

export const useInteractionStore = create<InteractionState>()((set) => ({
  guides: [],
  marquee: null,
  snapEnabled: true,
  imagePickerFor: null,
  setGuides: (guides) => set({ guides }),
  setMarquee: (marquee) => set({ marquee }),
  toggleSnap: () => set((s) => ({ snapEnabled: !s.snapEnabled })),
  openImagePicker: (imagePickerFor) => set({ imagePickerFor }),
  closeImagePicker: () => set({ imagePickerFor: null }),
}));
