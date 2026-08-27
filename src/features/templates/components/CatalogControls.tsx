import { Heart, Search, SlidersHorizontal } from "lucide-react";
import { templateCategories, type TemplateSort } from "../catalog/templateCatalog";

interface CatalogControlsProps {
  query: string;
  category: string;
  sort: TemplateSort;
  favoritesOnly: boolean;
  favoriteCount: number;
  onQueryChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: TemplateSort) => void;
  onFavoritesOnlyChange: (active: boolean) => void;
}

export function CatalogControls(props: CatalogControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Find names, styles..."
            value={props.query}
            onChange={(event) => props.onQueryChange(event.target.value)}
            className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </div>
        <div className="relative sm:w-44">
          <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={props.sort}
            onChange={(event) => props.onSortChange(event.target.value as TemplateSort)}
            className="h-10 w-full appearance-none rounded-md border border-input bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            aria-label="Sample arrangement"
          >
            <option value="featured">Outstanding</option>
            <option value="popular">Most popular</option>
            <option value="rating">Highly appreciated</option>
            <option value="newest">Newest</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {templateCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => props.onCategoryChange(category)}
            className={`h-9 shrink-0 rounded-md px-3.5 text-xs font-semibold transition ${
              props.category === category ? "bg-accent text-accent-foreground" : "border border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {category}
          </button>
        ))}
        <button
          type="button"
          onClick={() => props.onFavoritesOnlyChange(!props.favoritesOnly)}
          className={`h-9 shrink-0 rounded-md border px-3.5 text-xs font-semibold transition ${
            props.favoritesOnly ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground hover:bg-muted"
          }`}
        >
          <Heart className={`mr-1.5 inline h-3.5 w-3.5 ${props.favoritesOnly ? "fill-current" : ""}`} />
          Favourite ({props.favoriteCount})
        </button>
      </div>
    </div>
  );
}
