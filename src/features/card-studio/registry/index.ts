/**
 * Register all available Card Studio components (side-effect imports).
 * Add new type: create file in ./components and import here — do not edit editor core.
 */
import "./components/content";
import "./components/media";
import "./components/decor";
import "./components/widgets";

export * from "./types";
export * from "./registry";
export * from "./styleUtils";
