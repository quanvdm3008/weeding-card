import type { WeddingTheme as AppWeddingTheme } from "@/data/themes";

export type WeddingTheme = AppWeddingTheme;

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: { primary: string; secondary: string; muted: string };
    surface: { light: string; dark: string };
  };
  typography: { fontFamily: { sans: string; serif: string; script: string } };
}
