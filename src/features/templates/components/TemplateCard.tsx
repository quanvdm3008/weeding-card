import { Eye, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import type { WeddingTemplate } from "@/data/templates";
import { getTemplateById, type TemplateCatalogItem } from "@/features/templates/catalog/templateCatalog";
import { useTemplateFavorites } from "@/features/templates/store/templateFavoritesStore";
import TemplatePreview from "./TemplatePreview";

interface TemplateCardProps {
  template: WeddingTemplate | TemplateCatalogItem;
  index: number;
  onSelect?: (template: WeddingTemplate) => void;
}

const TemplateCard = ({ template, index, onSelect }: TemplateCardProps) => {
  const navigate = useNavigate();
  const catalogItem = getTemplateById(template.id);
  const favoriteIds = useTemplateFavorites((state) => state.favoriteIds);
  const toggleFavorite = useTemplateFavorites((state) => state.toggleFavorite);
  const isFavorite = favoriteIds.includes(template.id);
  const primaryColor = template.colors[0] ?? "#C9A96E";
  const secondaryColor = template.colors[1] ?? primaryColor;

  const openDetails = () => {
    if (onSelect) onSelect(template);
    else navigate(`/templates/${template.id}`);
  };

  return (
    <motion.article
      data-testid={`template-card-${template.id}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04 }}
      style={{ "--template-primary": primaryColor, "--template-secondary": secondaryColor } as CSSProperties}
      className="group relative overflow-hidden rounded-[1.25rem] border border-white/60 bg-white/70 backdrop-blur-lg shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_var(--template-primary)]"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" style={{ background: `linear-gradient(135deg, ${primaryColor}, transparent)` }} />
      <button type="button" onClick={openDetails} className="block w-full text-left relative z-10">
        <span className="relative block aspect-[4/3] overflow-hidden bg-muted">
          <TemplatePreview template={template} />
          <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          <span className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.18em] text-white backdrop-blur-md border border-white/20">
            {template.category}
          </span>
          <span className="absolute right-3 top-3 h-8 w-8 rounded-full border border-white/40 shadow-sm" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }} aria-hidden />
          {catalogItem?.isNew && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-black shadow-sm backdrop-blur-md">
              New
            </span>
          )}
        </span>
      </button>

      <div className="p-5 relative z-10">
        <div className="flex items-start justify-between gap-3">
          <button type="button" onClick={openDetails} className="min-w-0 text-left">
            <h3 className="truncate font-display text-xl font-semibold leading-tight text-gray-900 group-hover:text-[color:var(--template-primary)] transition-colors duration-300">
              {template.nameVi}
            </h3>
            <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-gray-600">
              {template.description}
            </p>
          </button>
          <button
            data-testid={`template-favorite-${template.id}`}
            type="button"
            onClick={() => toggleFavorite(template.id)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gray-200/80 bg-white/50 text-gray-400 transition-all hover:border-[color:var(--template-primary)] hover:text-[color:var(--template-primary)] hover:bg-white"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current text-[color:var(--template-primary)]" : ""}`} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {template.highlights.slice(0, 2).map((highlight) => (
            <span key={highlight} className="rounded-full border border-gray-200/80 bg-gray-50/50 px-2.5 py-1 text-[10px] tracking-wide text-gray-600">
              {highlight}
            </span>
          ))}
        </div>

        <p className="mt-5 border-t border-gray-100 pt-4 text-[11px] font-medium uppercase tracking-wider text-gray-500">{template.tagline}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            data-testid={`template-preview-${template.id}`}
            type="button"
            onClick={() => navigate(`/view?t=${template.id}&preview=1`)}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <Eye className="h-4 w-4 opacity-70" /> Xem thử
          </button>
          <button
            data-testid={`template-details-${template.id}`}
            type="button"
            onClick={openDetails}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-3 text-xs font-semibold text-white transition hover:bg-black shadow-md hover:shadow-lg"
          >
            <Sparkles className="h-4 w-4 opacity-70" /> Chi tiết
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default TemplateCard;
