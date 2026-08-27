import { Theme } from "@/types/wedding";

export const luxuryTheme: Theme = {
  id: "luxury",
  name: "Imperial Gold",
  description: "Matte black and radiant gold for a truly cinematic and luxurious experience.",
  colors: {
    primary: "#CDAF63", // Imperial Gold
    secondary: "#120E0D", // Deep Matte Black
    accent: "#F4EDE0", // Warm Off-White
    background: "#090807", // True Dark
    text: {
      primary: "#F4EDE0", // Off-White
      secondary: "#CDAF63", // Gold
      muted: "rgba(244, 237, 224, 0.6)",
    },
    surface: {
      light: "#1A1614",
      dark: "#050505",
    },
  },
  typography: {
    fontFamily: {
      sans: "'Inter', sans-serif",
      serif: "'Cinzel', 'Cormorant Garamond', serif",
      script: "'Great Vibes', cursive",
    },
  },
};
