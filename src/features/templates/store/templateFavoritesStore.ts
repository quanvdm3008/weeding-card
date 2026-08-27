import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TemplateFavoritesState {
  favoriteIds: string[];
  toggleFavorite: (templateId: string) => void;
}

export const useTemplateFavorites = create<TemplateFavoritesState>()(
  persist(
    (set) => ({
      favoriteIds: [],
      toggleFavorite: (templateId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(templateId)
            ? state.favoriteIds.filter((id) => id !== templateId)
            : [...state.favoriteIds, templateId],
        })),
    }),
    { name: "mireia-template-favorites" },
  ),
);
