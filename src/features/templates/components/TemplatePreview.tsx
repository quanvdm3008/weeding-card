import type { WeddingTemplate } from "@/data/templates";
import { getTemplateImage } from "@/features/templates/catalog/templateAssets";

export default function TemplatePreview({ template }: { template: WeddingTemplate }) {
  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <img 
        src={getTemplateImage(template.id)} 
        alt={`Sample preview ${template.nameVi}`} 
        loading="lazy" 
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
      />
    </div>
  );
}
