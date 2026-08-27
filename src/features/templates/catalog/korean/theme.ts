import { Theme } from "@/types/wedding";

export const koreanTheme: Theme = {
  id: "korean",
  name: "Korean Studio",
  description: "Airy, clean, and minimalist with subtle peach/lavender accents.",
  colors: {
    primary: "#E2DCD3", // Light Beige / Warm Grey
    secondary: "#F9F8F6", // Off-white
    accent: "#E8D8D3", // Soft Peach / Lavender undertone
    background: "#FFFFFF",
    text: {
      primary: "#2C2C2C",
      secondary: "#666666",
      muted: "#999999",
    },
    surface: {
      light: "#FAFAFA",
      dark: "#F0F0F0",
    },
  },
  typography: {
    fontFamily: {
      sans: "'Pretendard', 'Inter', sans-serif", // Clean, modern Korean sans
      serif: "'Nanum Myeongjo', serif",
      script: "'Alex Brush', cursive",
    },
  },
};
