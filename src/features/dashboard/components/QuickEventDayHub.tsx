import React from "react";
import { Link } from "react-router-dom";
import { Projector, CheckCircle2, Gift, Printer, Sparkles, ArrowRight } from "lucide-react";

interface QuickEventDayHubProps {
  primaryInvitationId?: string;
}

export const QuickEventDayHub: React.FC<QuickEventDayHubProps> = ({ primaryInvitationId }) => {
  const tools = [
    {
      title: "Màn LED Live Wall",
      desc: "Trình chiếu lời chúc & ảnh",
      icon: Projector,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      path: primaryInvitationId ? `/invitations/${primaryInvitationId}/live-wall` : "#template-marketplace",
    },
    {
      title: "Quay số Lucky Draw",
      desc: "Minigame bốc thăm trúng quà",
      icon: Gift,
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      path: primaryInvitationId ? `/invitations/${primaryInvitationId}/lucky-draw` : "#template-marketplace",
    },
    {
      title: "Check-in QR Sự kiện",
      desc: "Quét mã đón khách sảnh cưới",
      icon: CheckCircle2,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      path: primaryInvitationId ? `/invitations/${primaryInvitationId}/check-in` : "#template-marketplace",
    },
    {
      title: "In Standee & QR",
      desc: "Xuất file in độ nét cao",
      icon: Printer,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      path: primaryInvitationId ? `/invitations/${primaryInvitationId}/printables` : "#template-marketplace",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-accent/15 text-accent shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground">Bộ Tiện Ích Ngày Cưới</h3>
            <p className="text-[10px] text-muted-foreground">Công cụ tương tác tiệc cưới</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.title}
              to={tool.path}
              className="group flex flex-col justify-between rounded-xl border border-border/60 bg-muted/20 p-3 transition-all duration-200 hover:border-accent/40 hover:bg-muted/50 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className={`grid h-7 w-7 place-items-center rounded-lg border ${tool.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <div className="mt-3">
                <p className="font-medium text-xs text-foreground group-hover:text-accent transition-colors leading-tight">
                  {tool.title}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1">
                  {tool.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickEventDayHub;
