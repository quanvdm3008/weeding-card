import type { ExperienceLayout } from "@/data/templateExperiences";
import { storybookLayout } from "./storybook";
import { timelineLayout } from "./timeline";
import { editorialLayout } from "./editorial";
import { destinationLayout } from "./destination";
import { royalLayout } from "./royal";
import { minimalLayout } from "./minimal";
import type { LayoutStrategy } from "./types";

/** Registry maps each art direction to an independent card body layout. */
const strategies: Record<ExperienceLayout, LayoutStrategy> = {
  storybook: storybookLayout,
  editorial: editorialLayout,
  destination: destinationLayout,
  royal: royalLayout,
  minimal: minimalLayout,
  timeline: timelineLayout,
};

export function getLayoutStrategy(layout: ExperienceLayout | undefined): LayoutStrategy {
  return (layout && strategies[layout]) || storybookLayout;
}
