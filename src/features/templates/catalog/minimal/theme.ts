import { Theme } from "@/types/wedding";

export const minimalTheme: Theme = {
  id: "minimalist",
  name: "Pure White",
  description: "Ultra clean, massive whitespace, stark geometric typography for a modern editorial feel.",
  colors: {
    primary: "#000000", // Pure Black
    secondary: "#FFFFFF", // Pure White
    accent: "#E5E5E5", // Light Grey
    background: "#FFFFFF", // Pure White
    text: {
      primary: "#000000",
      secondary: "#666666",
      muted: "#999999",
    },
    surface: {
      light: "#FAFAFA",
      dark: "#111111",
    },
  },
  typography: {
    fontFamily: {
      sans: "'Inter', sans-serif",
      serif: "'Inter', sans-serif", // No serif in minimal
      script: "'Inter', sans-serif", // No script in minimal
    },
  },
};
