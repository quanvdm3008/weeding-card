import { LayoutPanelTop, PanelsTopLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

interface EditorWorkspaceSwitcherProps {
  active: "guided" | "canvas";
  invitationId?: string | null;
  compact?: boolean;
}

export function EditorWorkspaceSwitcher({ active, invitationId, compact = false }: EditorWorkspaceSwitcherProps) {
  const [searchParams] = useSearchParams();
  const basePath = invitationId ? `/editor/${invitationId}` : "/editor";

  const hrefFor = (workspace: "guided" | "canvas") => {
    const next = new URLSearchParams(searchParams);
    next.set("workspace", workspace);
    if (workspace === "canvas" && !invitationId && next.has("template")) next.set("import", "1");
    if (workspace === "guided") {
      next.delete("import");
      next.delete("blank");
    }
    return `${basePath}?${next.toString()}`;
  };

  return (
    <div className="inline-flex shrink-0 rounded-md border border-border bg-muted/60 p-1" aria-label="Edit mode">
      <Link
        to={hrefFor("guided")}
        className={`inline-flex h-8 items-center justify-center gap-1.5 rounded px-2.5 text-xs font-semibold transition ${
          active === "guided" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Adjust content according to structure"
        title="Adjust content and interface according to structure"
      >
        <LayoutPanelTop className="h-3.5 w-3.5" /> {!compact && <span className="hidden xl:inline">Content</span>}
      </Link>
      <Link
        to={hrefFor("canvas")}
        className={`inline-flex h-8 items-center justify-center gap-1.5 rounded px-2.5 text-xs font-semibold transition ${
          active === "canvas" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Adjust freely on canvas"
        title="Adjust freely according to layers on canvas"
      >
        <PanelsTopLeft className="h-3.5 w-3.5" /> {!compact && <span className="hidden xl:inline">Canvas</span>}
      </Link>
    </div>
  );
}
