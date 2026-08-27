import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  /** Example: "Minh Anh & Thanh Ha" — small display below the title. */
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  /** Action button on the right (cross link between admin pages, button to open dialog...). */
  actions?: ReactNode;
}

/**
 * Standard header for admin pages (Guest / RSVP / Check-in).
 * Share glass-nav with Builder to synchronize design language.
 */
const AdminPageHeader = ({ title, subtitle, backTo = "/dashboard", backLabel = "Dashboard", actions }: AdminPageHeaderProps) => (
  <header className="sticky top-0 z-30 glass-nav border-b border-border">
    <div className="max-w-6xl mx-auto px-5 py-3 flex items-center gap-4 min-h-[60px]">
      <Link
        to={backTo}
        className="flex items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <ChevronLeft className="w-4 h-4" /> {backLabel}
      </Link>
      <div className="w-px h-6 bg-border shrink-0" />
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-lg font-semibold leading-tight truncate">{title}</h1>
        {subtitle && <p className="font-body text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap justify-end">{actions}</div>}
    </div>
  </header>
);

export default AdminPageHeader;
