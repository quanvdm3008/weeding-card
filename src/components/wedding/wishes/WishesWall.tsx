import { DefaultWishesWall } from "./DefaultWishesWall";
import { ParallaxLoveWishes } from "./ParallaxLoveWishes";
import { VioletDreamWishes } from "./VioletDreamWishes";
import { LedgerWishes } from "./LedgerWishes";
import { RailWishes } from "./RailWishes";
import { ColumnsWishes } from "./ColumnsWishes";
import { FeaturedWishes } from "./FeaturedWishes";
import type { WeddingTheme } from "@/data/themes";
import { getTemplateLayout } from "@/data/templateLayouts";

export default function WishesWall(props: { accentColor: string; theme?: WeddingTheme; publicSlug?: string; embedded?: boolean }) {
  if (props.theme?.id === "parallax_love") {
    return <ParallaxLoveWishes {...props} />;
  }
  if (props.theme?.id === "violet_dream") {
    return <VioletDreamWishes {...props} />;
  }

  const layoutProfile = getTemplateLayout(props.theme?.id);
  const flow = layoutProfile.wishes.flow;

  switch (flow) {
    case "ledger":
      return <LedgerWishes {...props} />;
    case "rail":
      return <RailWishes {...props} />;
    case "columns":
      return <ColumnsWishes {...props} />;
    case "featured":
      return <FeaturedWishes {...props} />;
    case "grid":
    case "staggered":
    default:
      return <DefaultWishesWall {...props} />;
  }
}
