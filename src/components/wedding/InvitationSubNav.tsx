import { Link, useLocation } from "react-router-dom";
import {
  Armchair,
  CalendarClock,
  CheckCircle2,
  DollarSign,
  Gift,
  Heart,
  ListChecks,
  LucideIcon,
  MessageSquareShare,
  Pencil,
  Printer,
  Projector,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

interface InvitationSubNavProps {
  invitationId: string;
  title?: string;
  subtitle?: string;
}

export function InvitationSubNav({ invitationId, title, subtitle }: InvitationSubNavProps) {
  const location = useLocation();

  const navItems: NavItem[] = [
    { to: `/editor/${invitationId}`, label: "Thiết kế", icon: Pencil },
    { to: `/invitations/${invitationId}/guests`, label: "Khách mời", icon: Users },
    { to: `/invitations/${invitationId}/seating`, label: "Xếp bàn", icon: Armchair },
    { to: `/invitations/${invitationId}/rsvps`, label: "RSVP", icon: ListChecks },
    { to: `/invitations/${invitationId}/check-in`, label: "Check-in", icon: CheckCircle2 },
    { to: `/invitations/${invitationId}/timeline`, label: "Kịch bản", icon: CalendarClock },
    { to: `/invitations/${invitationId}/live-wall`, label: "Màn hình LED", icon: Projector, badge: "Live" },
    { to: `/invitations/${invitationId}/lucky-draw`, label: "Quay số", icon: Gift, badge: "MC" },
    { to: `/invitations/${invitationId}/live-photos`, label: "Ảnh tiệc", icon: Sparkles },
    { to: `/invitations/${invitationId}/printables`, label: "In ấn / Standee", icon: Printer },
    { to: `/invitations/${invitationId}/budget`, label: "Ngân sách", icon: DollarSign },
    { to: `/invitations/${invitationId}/broadcasts`, label: "Nhắc lịch", icon: MessageSquareShare },
  ];

  return (
    <div className="border-b border-border/80 bg-card/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent hover:bg-accent/25 transition"
            title="Quay lại Dashboard"
          >
            <Heart className="h-4 w-4 fill-current" />
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold font-display text-foreground">
              {title || "Quản lý tiệc cưới"}
            </h1>
            {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map(({ to, label, icon: Icon, badge }) => {
            const isActive = location.pathname === to || (to !== `/editor/${invitationId}` && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? "bg-accent text-accent-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
                {badge && (
                  <Badge
                    variant={isActive ? "outline" : "secondary"}
                    className={`ml-0.5 px-1 py-0 text-[9px] font-bold ${
                      isActive ? "border-accent-foreground/30 text-accent-foreground" : "bg-accent/15 text-accent"
                    }`}
                  >
                    {badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default InvitationSubNav;
